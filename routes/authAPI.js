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
			       if(err){
				   log.critical(err);
				   return res.sendStatus(401);
			       }
			       if(user){
				   log.debug(user.displayName);
				   return res.json({"displayName":user.displayName});
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
	res.redirect(config.server.path);
    });

    return router;
};
