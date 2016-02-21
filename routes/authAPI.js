var express = require('express');
var router = express.Router();
var db = require("../database");
var config = require("../config");
var log = require("../utils").log;
var bodyParser= require("body-parser");
var passport = require('passport'); //TODO check if works

router.use(function logRequest(req,res,next){
    log.info('request from '+req.ip+' to '+req.path);
    next();
});

//log out path
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

//check if user is auth
//checkAuthentication - api for frontend check on whether a user has a valid login
router.get('/checkAuth', function(req, res){ 
    var json = "";
    if(!req.isAuthenticated())
	return res.json({"isAuthenticated": false});
    else{
	db.getUserById(req.session.passport.user, function(err, user){
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

//checkAuthorization - api for frontend - send adventure/player data to check for edit/removal authorization
router.post('/checkAuth', function(req, res){ 
    if(!req.body.userID || !req.user)
	return res.json({"isAuthorized":false});
    else
	db.checkUserAuth(req.body._id, req.session.passport.user,function(err, authorized){
	    return res.json({"isAuthorized":authorized});
	});
});

router.get('/google', passport.authenticate('google'));
router.get('/google/return',
	   passport.authenticate('google', { successRedirect: config.server.path,
					     failureRedirect: config.server.path+'/public/html/error.html' }));


module.exports=router;
