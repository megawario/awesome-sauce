//Database for this server
var mongoClient = require('mongodb').MongoClient;
var mongo = require('mongodb');
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

    //Database functions.
    
    //creates new adventure on database, returns the err, and doc newlycreated id on the callback.
    createAdventure : function(json,callback){
	this.adventure.create(json)
	    .then(
		function(result){ //success
		    callback(undefined,result);
		}).catch(function(err){callback(err);});
    },

    editAdventure: function(json,callback){
	

	mongoClient.connect(config.db.url,function(err,db){
	    if(err){return console.dir(err);}
	    var id = json._id;
	    delete json['_id'];
	   db.collection('adventure').updateOne(
		{"_id": mongo.ObjectID(id)},
		json,
		function(err){                 //return status of success to callback
		    db.close();
		    return callback(err);
		});
	});	
    },

//returns json with adventures using a projection for the date and request info
    getAdventure : function(date,callback){
	mongoClient.connect(config.db.url,function(err,db){
	    if(err){return console.dir(err);}
	    db.collection('adventure').find({"date":date}).sort({"time":1}).toArray(function(err,docs){
		db.close();
		return callback(err,docs);
	    });
    });
    },

    //updates adventure by id,  ading a new user.
    addPlayer : function(id,playerName,callback){
	mongoClient.connect(config.db.url,function(err,db){
	    if(err){return console.dir(err);}
	    db.collection('adventure').updateOne(
		{"_id": mongo.ObjectID(id)},
		{$push:{"players":playerName}},
		function(err){                 //return status of success to callback
		    db.close();
		    return callback(err);
		});
	});
    },
    
//removes a player from the adventure with the id. 
    removePlayer: function(id,playerName,callback){
	mongoClient.connect(config.db.url,function(err,db){
	    db.collection('adventure').updateOne(
		{"_id": mongo.ObjectID(id)},
		{$pull:{"players":playerName}},
		function(err){
		    db.close();
		    return callback(err);
		});
	});
    },
    
// removes adventure docment identified by id.
    removeAdventure: function(id,callback){
	mongoClient.connect(config.db.url,function(err,db){
	    db.collection('adventure').remove({"_id":mongo.ObjectID(id)},
					      function(err){
						  db.close();
						  return callback(err);
					      });
	});
    }
}

//loads adventure module
database.adventure = require('./models/adventureModel.js');
database.mongoose = mongoose;
//starts database connection
module.exports=database.initialize();
