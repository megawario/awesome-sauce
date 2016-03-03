module.exports = function(passport,express,db,config,log ){
    var bodyParser= require("body-parser");
    var router= express.Router();
    
    router.use(function logRequest(req,res,next){
	log.info('request from '+req.ip+' to '+req.path);
	next();
    });

    //check if user is authenticated sending 401 or userInfo.
    router.get('/checkAuth', function(req, res){ 
	if(!req.isAuthenticated()) return res.sendStatus(401);
	else{
	    db.getUserById(req.session.passport.user,
			   function(err, user){
			       if(user){
				   var json= 
				       { "isAuthenticated": req.isAuthenticated(),
					 "displayName": user.displayName,
					 "email": user.email };
				   log.debug("Sending auth json: ",json);
				   return res.json(json);
			       }
			       else{
				   log.critical("ERROR: User in session not found in DB!");
				   return res.sendStatus(401);
			       }
			   });
	}
    });
    
    //authentication
    router.get('/google', passport.authenticate('google'));
    router.get('/google/return',
	       passport.authenticate('google', { successRedirect: config.server.path,
						 failureRedirect: config.server.path }));
    //log out path
    router.get('/logout', function(req, res){
    req.logout();
	res.redirect('/');
    });

    return router;
};
