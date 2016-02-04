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

//Auth objects declaration
var passport = require('passport');
//Google OAuth
var googleStrategy = require('passport-google-oauth2').Strategy;
var session = require('express-session');
var uuid = require('node-uuid');

passport.use(new googleStrategy({
    clientID:  '819734387202-0uu7puep4peo0kibf7taattcqjcp6d09.apps.googleusercontent.com',
    clientSecret: 'CeleNxJDziJlTJ1j-rLOhlHY', 
    callbackURL: 'http://pieinthesky.xyz:8090/auth/google/return',
    scope: 'email',
    passReqToCallback: true

},

				function(request, accessToken, refreshToken, profile, done){
				   
				    //console.log("AUTH: identifier is" + identifier);
				    console.log("AUTH: profile info given: "+profile.email);
				    process.nextTick(function(){
					return done(null, profile);
				    });
				}
			       ));
	    

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

app.use(session({
    genid: function(req) {
	return uuid.v1();
    },
    secret: 'keyboard cat'
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));


app.get('/', function(req,res){ //delete when a properly configured webserver is put in place
    res.redirect("/html/index.html");
});

app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/return',
	passport.authenticate('google', { successRedirect: '/',
					  failureRedirect: '/error' }));

//Services
//POST
app.use(bodyParser.json());

//Push new adventure to the database
app.post('/rest/adventure/create',function(req,res){
    console.log('post request from '+req.ip+' to ' +req.path);
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
