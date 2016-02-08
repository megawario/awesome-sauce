//Database for this server
var mongoClient = require('mongodb').MongoClient;
var config = require('./config');
var mongoose = require('mongoose');

var database={

    //initialize database
    initialize : function(err,callback){
	mongoose.connect(config.db.url);

	//connection events:
	mongoose.connection.on('connected',function(){
	    console.log('Mongoose connected to: '+config.db.url);
	});
	mongoose.connection.on('error',function(err){
	    console.log('Mongoose error on connection: '+err);
	});
	mongoose.connection.on('disconnected',function(){
	    console.log('Mongoose disconnected');
	});

	return this;
    },

    //creates new adventure on database, returns the err, and doc newlycreated id on the callback.
    createAdventure : function(json,callback){
	this.adventure.create(json)
	    .then(
		function(result){ //success
		    callback(null,result);
		}).catch(function(err){callback(err);});
    },

    //updates existing adventure
    editAdventure: function(json,callback){
	this.adventure.update({_id:json._id},json)
	    .then(function(result){
		callback(null,result);})
	    .catch(function(err){callback(err);});
    },

//returns json with adventures using a projection for the date and request info
    getAdventure : function(date,callback){
	this.adventure.find()
	    .where('date').equals(date)
	    .exec(function(err,docs){
		callback(err,docs);
	    });
    },

    // removes adventure docment identified by id.
    removeAdventure: function(id,callback){
	this.adventure.remove(id,callback);
    },
    
    //updates adventure by id,  ading a new user.
    addPlayer : function(id,playerName,callback){
	this.adventure.findById(id,function(err,doc){
	    if(err){callback(err);}
	    else{
		doc.players.push(playerName);
		doc.save(callback); //used to force validations of playerName
	    }
	});
    },
    
//removes a player from the adventure with the id. 
    removePlayer: function(id,playerName,callback){
	this.adventure.findById(id,function(err,doc){
	    if(err){callback(err);}
	    else{
		doc.players.pull(playerName);
		doc.save(callback);
	    }
	});
    }
}

//loads adventure module
database.adventure = require('./models/adventureModel.js');
database.mongoose = mongoose;
//starts database connection
module.exports=database.initialize();
