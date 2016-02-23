var express = require('express');
var router = express.Router();
var db = require("../database");
var config = require("../config");
var log = require("../utils").log;
var bodyParser= require("body-parser");

router.use(function logRequest(req,res,next){
    log.info('request from '+req.ip+' to '+req.path);
    next();
});

router.use(bodyParser.json());

//Post Request
//Create new database on bd
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
    db.editAdventure(req.body,function(err,doc){
	if(err){
	    log.err(err);
	    res.sendStatus(500); //send error status
	}else{res.status(200).send(doc);} //send document
    });
});

//remove the adventure
router.post('/adventure/remove',function(req,res){
    var id =req.body._id;
    db.removeAdventure(id,function(err){
	if(err){
	    log.err(err);
	    res.sendStatus(500);
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
	    res.json(docs);
	}
    });
});

module.exports=router;
