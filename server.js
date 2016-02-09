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
//mongoose.connect('mongodb://127.0.0.1/lissch');

var devMode = process.env.NODE_ENV == "production" ? 0 : 1; //activate development mode if NODE_ENV is not production

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var sessionSchema = new Schema({
    userID: Number,
    displayName: String,
    email: String,
    accessToken: String,
    cookieID: String
});

var User = mongoose.model('sessions', sessionSchema);

function logger(level,string){
    if(level == "critical" || devMode)
	console.log(string);
}

function verifyAuth(){
    //TODO: verify if the user is authenticated, return json object with user info relevant to the frontend
}

function getUserById(id, cb){
    User.findOne({'userID': id}, function(err, user){
	cb(err, user);
    });
}

//Google OAuth
passport.use(new googleStrategy({
    clientID:  config.auth.google.clientID,
    clientSecret: config.auth.google.clientSecret, 
    callbackURL: config.auth.google.callbackURL,
    scope: config.auth.google.scope,
    passReqToCallback: true

}, function(req, accessToken, refreshToken, profile, done){
    
    logger("debug","AUTH: got access token "+accessToken);
    logger("debug","AUTH: got refresh token "+refreshToken);
    logger("debug","AUTH: profile info given: "+profile.id);
    
    User.findOne({'userID': profile.id}, function(err, user){
	if(!user){
	    logger("debug","User NOT FOUND on session store :(\nCreating User!");
	    
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
	    logger("debug","User FOUND on session store! userID "+profile.id);
	    return done(null, user);
	}
	
	
    });
}));


passport.serializeUser(function(user, cb) { //inserts user id into the session store @.sessions.passport.user
    cb(null, user.userID);
    
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
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
        
    if(!req.user){

	logger("debug","Cookie not set, user not logged in");
	logger("debug",req.session);
    }
    else{
	logger("debug","Cookie set, user logged in. User id:");
	logger("debug",'Session:\n'+req.session.passport.user);
	User.findOne({'userID': req.session.passport.user}, function(err, user){
	    if(user){
		
		logger("debug","E-mail: "+user.email);
		logger("debug","Display Name: "+user.displayName);
		logger("debug","UserID: "+user.userID);	
	    }

	    else{
		logger("critical","ERROR: User in session not found in DB!");
	    }
	});
    }
    //    console.log("Session:\n", req.session.passport.user);
    res.redirect("/html/index.html");
});

app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/return',
	passport.authenticate('google', { successRedirect: '/',
					  failureRedirect: '/error' }));


app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
    
});

app.get('/checkAuth', function(req, res){ //checkAuthentication - api for frontend check on whether a user has a valid login
    var json = "";
    if(!req.isAuthenticated())
	return res.json({"isAuthenticated": false});
    else{
	User.findOne({'userID': req.session.passport.user}, function(err, user){
	    if(user){

		json = {
		    "isAuthenticated": req.isAuthenticated(),
		    "displayName": user.displayName,
		    "email": user.email,
		    "userID":user.userID
		};
		logger("debug","Sending auth json: ",json);
		return res.json(json); 
	    }
	
	    
	    else{
		logger("critical","ERROR: User in session not found in DB!");
		return res.json({"isAuthenticated": false});
	    }
	});
	

    }
});

//Services
//POST
app.use(bodyParser.json());

app.post('/checkAuth', function(req, res){ //checkAuthorization - api for frontend - send adventure/player data to check for edit/removal authorization
    if(!req.body.userID || !req.user)
	return res.json({"isAuthorized":false});
    else
	db.checkUserAuth(req.body._id, req.session.passport.user,function(err, authorized){
	    return res.json({"isAuthorized":authorized});
	});
			 
});

//Push new adventure to the database
//Create new database on bd
app.post('/rest/adventure/create',function(req,res){
    console.log('post request from '+req.ip+' to ' +req.path);
    console.log("isAuthenticated? "+req.isAuthenticated());
        
    if(req.isAuthenticated()){
	getUserById(req.session.passport.user, function(err, user){
	    if(!err && user)
		console.log("Found user by id: ",user);
	});
    }
    //TODO process validation for the req body here.
    //Insert userID into the received object if a user is logged in so we can check for removal and edit permissions later
    if(req.isAuthenticated())
	req.body.userID=req.session.passport.user;
    else
	req.body.userID=null;
    
    db.createAdventure(req.body,function(err,doc){
	if(err){
	    console.log(err);
	    res.sendStatus(500);       //send error status
	}else{res.status(200).send(doc);} //sends document
    });
});

//Edit adventure on database
app.post('/rest/adventure/edit',function(req,res){
    console.log('post request from '+req.ip+' to ' +req.path);
    db.editAdventure(req.body,function(err,doc){
	if(err){
	    console.log(err);
	    res.sendStatus(500); //send error status
	}else{res.status(200).send(doc);} //send document
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
	}else{res.sendStatus(200);};
    });
});

//adds new player to adventure
app.post('/rest/adventure/player/add',function(req,res){
    console.log('post request from '+req.ip+' to ' +req.path);
    var id=req.body._id;
    var playerName = req.body.player;
    //TODO process validation here for post arg.
    db.addPlayer(id,playerName,function(err,doc){
	if(err){
	    console.log(err);
	    res.sendStatus(500);
	}else{res.status(200).send(doc);}
    });
});

//Remove setected player from adventure
app.post('/rest/adventure/player/remove',function(req,res){
    console.log('post request from '+req.ip+' to ' +req.path);
    var id = req.body._id;
    var playerName = req.body.playerName;
    console.log("removing "+id+ " with name:"+playerName);
    //TODO process validations here
    db.removePlayer(id,playerName,function(err,doc){
	if(err){
	    console.log(err);
	    res.sendStatus(500);
	}
	else{res.status(200).send(doc);}
    });
});

//GET
app.get('/rest/adventure/:date',function(req,res){
    console.log('get request from '+req.ip+' param:'+req.params.date);
    db.getAdventure(req.params.date,function(err,docs){
	if(err){
	    console.log(err);
	    res.sendStatus(500);
	}else{
	    res.json(docs);
	}
    });
});

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
