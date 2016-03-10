
module.exports= function(express,db,config,log){
    var router = express.Router();
    var bodyParser= require("body-parser");
    
    router.use(function logRequest(req,res,next){
	log.info('request from '+req.ip+' to '+req.path);
	next();
    });
    
    router.use(bodyParser.json());

    //Post Request
    //Create new adventure on bd
    router.post('/adventure/create',function(req,res){
	if(req.isAuthenticated()){req.body.userID=req.session.passport.user;} //push userID if logged in.
	db.createAdventure(req.body,function(err,doc){
	    if(err){
		log.err(err);
		res.sendStatus(500);       //send error status
	    }else{res.status(200).send(doc);} //sends document
	});
    });
    
    //Edit adventure on database
    router.post('/adventure/edit',function(req,res){
	if(req.isAuthenticated()){req.body.userID=req.session.passport.user;} //push userID if logged in.
	db.editAdventure(req.body._id,req.body.userID,req.body,function(err,doc){
	    if(err){
		log.err(err);
		err.message==='forbiden' ? res.sendStatus(401) : res.sendStatus(500); //send error status
	    }else{res.status(200).json(doc);} //send document
	});
    });
    
    //remove the adventure
    router.post('/adventure/remove',function(req,res){
	if(req.isAuthenticated()){req.body.userID=req.session.passport.user;} //push userID if logged in.
	db.removeAdventure(req.body._id,req.body.userID,function(err){
	    if(err){
		log.err(err);
		if(err.message=='forbiden'){res.sendStatus(401);}
		else{res.sendStatus(500);}
	    }else{res.sendStatus(200);};
	});
    });
    
    //adds new player to adventure
    router.post('/adventure/player/add',function(req,res){
	var id=req.body._id;
	var playerName = req.body.player;
	db.addPlayer(id,playerName,function(err,doc){
	    if(err){
		log.err(err);
		res.sendStatus(500);
	    }else{res.status(200).send(doc);}
	});
    });
    
    //Remove setected player from adventure
    router.post('/adventure/player/remove',function(req,res){
	var id = req.body._id;
	var playerName = req.body.playerName;
	log.debug("removing "+id+ " with name:"+playerName);
	db.removePlayer(id,playerName,function(err,doc){
	    if(err){
		log.err(err);
		res.sendStatus(500);
	    }
	    else{res.status(200).send(doc);}
	});
    });
    
    //GET
    router.get('/adventure/:date',function(req,res){
	db.getAdventure(req.params.date,function(err,docs){
	    if(err){
		log.err(err);
		res.sendStatus(500);
	    }else{
		log.debug(JSON.stringify(docs));
		res.json(docs);
	    }
	});
    });
    return router;
}



