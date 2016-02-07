//Main server app

//import
var http = require("http");
var express = require("express");
var services = require("express");
var fs = require("fs");
var config = require("./config");
var bodyParser= require("body-parser");

var db = require("./database");

var app = express();

//AUTH
var passport = require('passport');

//Google OAuth
var googleStrategy = require('passport-google-oauth2').Strategy;
var session = require('express-session');
var uuid = require('node-uuid');

//Session store
var mongoStore = require("connect-mongo")(session);

var cookieParser = require('cookie-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/lissch');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var sessionSchema = new Schema({
    userID: Number,
    displayName: String,
    email: String,
    accessToken: String,
    cookieID: String
});

/*sessionSchema.statics.findOrCreate = function(id, cb){
    var query = 
    return this.find({_id: id}, cb);
    
};*/

var User = mongoose.model('sessions', sessionSchema);

passport.use(new googleStrategy({
   clientID:  config.auth.google.clientID,
    clientSecret: config.auth.google.clientSecret, 
    callbackURL: config.auth.google.callbackURL,
    scope: config.auth.google.scope,
    passReqToCallback: true

},

				function(req, accessToken, refreshToken, profile, done){
				    
				    //console.log("AUTH: identifier is" + identifier);
				    
				    console.log("AUTH: got access token "+accessToken);
				    console.log("AUTH: got refresh token "+refreshToken);
				    console.log("AUTH: profile info given: "+profile.id);
				    User.findOne({'userID': profile.id}, function(err, user){
					if(!user){
					    console.log("User NOT FOUND on session store :(\nCreating User!");
					    
					    user = new User({
						displayName: profile.displayName,
						email: profile.email,
						userID: profile.id,
						provider: 'google',
						accessToken: accessToken,
						cookieID: ''
					    });
					    user.save(function(err){
						if(err) console.log(err);
						return done(err, user);
						
					    });
					}
					
					else{
					    console.log("User FOUND on session store! userID ", profile.id);
					    return done(null, user);
					}
					
					
				    });
				}));

					
	    
	    

passport.serializeUser(function(user, cb) {
    //console.log("Serialize: ",user);
    cb(null, user.userID);
    
});

passport.deserializeUser(function(obj, cb) {
    //    console.log("Deserialize ",obj);
    //User.findById(id, function(err, user){	
	cb(null, obj);
    //});
});

app.use(cookieParser());
app.use(session({
    genid: function(req) {
	return uuid.v1();
    },
    secret: 'keyboard cat',
    name: 'session.sid',

    resave: false,
    saveUninitialized: false,
    store: new mongoStore({url: config.db.url, collection: 'cookies'})
    
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));


app.get('/', function(req,res){ //delete when a properly configured webserver is put in place
    
    
    if(!req.session){
	console.log("Cookie not set, user not logged in");
    }
    else{
	console.log("Cookie set, user logged in. User id:");
	console.log('Session:\n', req.session.passport.user);
	User.findOne({'userID': req.session.passport.user}, function(err, user){
	    if(user){
		console.log("E-mail: "+user.email);
		console.log("Display Name: "+user.displayName);
		console.log("UserID: "+user.userID);
	    }
	    else{
		console.log("ERROR: User in session not found in DB!");
	    }
	});
    }
    //    console.log("Session:\n", req.session.passport.user);
    res.redirect("/html/index.html");
});

app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/return',
	passport.authenticate('google', { successRedirect: '/auth/google/postauth',
					  failureRedirect: '/error' }));

app.get('/auth/google/postauth', function(req, res){ //do some auth post processing that can only happen after the cookie is set.
    var cookieID = req.cookies['session.sid'].slice(2, req.cookies['session.sid'].length);//get rid of the 's:' prefix that express-session prepends to the cookie id
    cookieID = cookieID.slice(0,cookieID.indexOf('.'));
    console.log(cookieID);
    console.log(res.session);

    res.redirect("/");
});
//	console.log(req.session);
//Services
//POST
app.use(bodyParser.json());

//Push new adventure to the database
app.post('/rest/adventure/create',function(req,res){
    console.log('post request from '+req.ip+' to ' +req.path);
    console.log("isAuthenticated? "+req.isAuthenticated());
    console.log("USER:"+req.session.id);
    console.log("SESSION DATA: "+req.session.cookie.id);
    //TODO process validation for the req body here.
    db.createAdventure(req.body,function(err,docId){
	if(err){
	    console.log(err);
	    res.sendStatus(500);//send error status
	}else{
	    res.status(200).send(docId);
	}
    });
});

app.post('/rest/adventure/edit',function(req,res){
    console.log('post request from '+req.ip+' to ' +req.path);
    //TODO process validations here
    db.editAdventure(req.body,function(err){
	if(err){
	    console.log(err);
	    res.sendStatus(500);//send error status
	}else{
	    res.sendStatus(200);
	}
    });
});

//remove the adventure
app.post('/rest/adventure/remove',function(req,res){
    console.log('post request from '+req.ip+' to ' +req.path);
    var id =req.body._id;
    //TODO process validations here.
    db.removeAdventure(id,function(err){
	if(err){
	    console.log(err);
	    res.sendStatus(500);
	}else{
	    res.sendStatus(200);
	};
    });
});

//adds new player to adventure
app.post('/rest/adventure/player/add',function(req,res){
     console.log('post request from '+req.ip+' to ' +req.path);
    var id=req.body._id;
    var playerName = req.body.player;
    //TODO process validation here for post arg.
    db.addPlayer(id,playerName,function(err){
	if(err){
	    console.log(err);
	    res.sendStatus(500);
	}else{
	    res.sendStatus(200);
	}
    });
});

//Remove setected player from adventure
app.post('/rest/adventure/player/remove',function(req,res){
    console.log('post request from '+req.ip+' to ' +req.path);
    var id = req.body._id;
    var playerName = req.body.playerName;
    console.log("removing "+id+ " with name:"+playerName);
    //TODO process validations here
    db.removePlayer(id,playerName,function(err){
	if(err){
	    console.log(err);
	    res.sendStatus(500);
	}
	else{
	    res.sendStatus(200);
	}
    });
});

//GET
app.get('/rest/adventure/:date',function(req,res){
    console.log('get request from '+req.ip+' param:'+req.params.date);
    db.getAdventure(req.params.date,function(err,result){
	if(err){
	    console.log(err);
	    res.sendStatus(500);
	}else{
	    res.json(result);
	}
    });
1});

app.get(config.server.path,function(req,res){
    res.redirect('/html/index.html');
});

//start server
app.listen(config.server.port, function(){
    console.log('App running on port '+config.server.port);
});

process.on('uncaughtException',function(err){
    console.log('Caught exception: '+err);
})
