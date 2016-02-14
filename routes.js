module.exports=(
    function(){
	"use strict";
	var router = require('express').Router();
	var db = require("./database");
	var config = require("./config");
	var log = require(".utils").log;
	
	//router functions
	//Create new database on bd
	router.post('/rest/adventure/create',function(req,res){
	    log.info('post request from '+req.ip+' to ' +req.path);
	    db.createAdventure(req.body,function(err,doc){
		if(err){
		    log.err(err);
		    res.sendStatus(500);       //send error status
		}else{res.status(200).send(doc);} //sends document
	    });
	});
	
	//Edit adventure on database
	router.post('/rest/adventure/edit',function(req,res){
	    log.info('post request from '+req.ip+' to ' +req.path);
	    db.editAdventure(req.body,function(err,doc){
		if(err){
		    log.err(err);
		    res.sendStatus(500); //send error status
		}else{res.status(200).send(doc);} //send document
	    });
	});
	
	//remove the adventure
	router.post('/rest/adventure/remove',function(req,res){
	    log.info('post request from '+req.ip+' to ' +req.path);
	    var id =req.body._id;
	    db.removeAdventure(id,function(err){
		if(err){
		    log.err(err);
		    res.sendStatus(500);
		}else{res.sendStatus(200);};
	    });
	});
	
	//adds new player to adventure
	router.post('/rest/adventure/player/add',function(req,res){
	    log.info('post request from '+req.ip+' to ' +req.path);
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
	router.post('/rest/adventure/player/remove',function(req,res){
	    log.info('post request from '+req.ip+' to ' +req.path);
	    var id = req.body._id;
	    var playerName = req.body.playerName;
	    log.debug("removing "+id+ " with name:"+playerName);
	    //TODO process validations here
	    db.removePlayer(id,playerName,function(err,doc){
		if(err){
		    log.err(err);
		    res.sendStatus(500);
		}
		else{res.status(200).send(doc);}
	    });
	});
	
	//GET
	router.get('/rest/adventure/:date',function(req,res){
	    log.info('get request from '+req.ip+' param:'+req.params.date);
	    db.getAdventure(req.params.date,function(err,docs){
		if(err){
		    log.err(err);
		    res.sendStatus(500);
		}else{
		    res.json(docs);
		}
	    });
	});
	
	return router;
    }
);
