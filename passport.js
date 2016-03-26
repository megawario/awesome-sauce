//handles passport & auth for the application.

module.exports=function(db,config,log){
    var passport = require('passport');
 
    //Google OAuth
    var googleStrategy = require('passport-google-oauth2').Strategy;
    var session = require('express-session');
    var uuid = require('node-uuid');

    //Session store
    var mongoStore = require("connect-mongo")(session);
    //define session
    passport._session=session({
	genid: function(req) {
	    return uuid.v1();
	},
	secret: 'keyboard cat',
	name: 'session.sid',
	resave: false,
	saveUninitialized: false,
	store: new mongoStore({url: config.db.url, collection: 'cookies'})
    })
    
    //Google OAuth
    passport.use(new googleStrategy({
	clientID:  config.auth.google.clientID,
	clientSecret: config.auth.google.clientSecret, 
	callbackURL: config.auth.google.callbackURL,
	scope: config.auth.google.scope,
	passReqToCallback: true
	
    }, function(req, accessToken, refreshToken, profile, done){
	
	log.debug("AUTH: got access token "+accessToken);
	log.debug("AUTH: got refresh token "+refreshToken);
	log.debug("AUTH: profile info given: "+profile.id);
	
	db.getUserById(profile.id,
		       function(err, user){
			   //if no user is found in the session store matching the one we got from the provider, add a new one
			   if(!user){
			       log.debug("User NOT FOUND on session store - Creating User!");
			       
			       var user = {
				   displayName: profile.displayName,
				   email: profile.email,
				   userID: profile.id,
				   provider: 'google',
				   accessToken: accessToken,
				   cookieID: ''
			       };
			       
			       db.addUser(user,function(err,userDoc){
				   if(err)
				       log.critical("Error inserting user to the DB!"+err);
				   return done(err,userDoc);
			       });
			   }
			   else{
			       log.debug("User FOUND on session store! userID "+profile.id);
			       return done(null, user);
			   };
		       });
    }));
    
    //inserts user id into the session store @.sessions.passport.user
    passport.serializeUser(function(user, cb) { 
	cb(null, user.userID); 
	
    });
    
    passport.deserializeUser(function(obj, cb) {
	cb(null, obj);
    });
    
    return passport
};
