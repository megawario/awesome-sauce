//Database for this server
var mongoClient = require('mongodb').MongoClient;
var mongo = require('mongodb');
var config = require('./config');
//utils

var database={

//initialize database
    initialize : function(err,callback){	
	//mongoClient.connect(config.db.url,function(err,db){
	//    db.collection('adventure').createIndex({"date":1,"time":1,"name":1},{unique:true});
	//});
    },
    
//creates new adventure on database
    createAdventure : function(json,callback){
	mongoClient.connect(config.db.url,function(err,db){
	    if(err){return console.dir(err);}
	    db.collection('adventure').insertOne(json,{w:1},function(err,result){
		db.close();
		return callback(err,result.insertedId);
	    });
			    
	});
    },

    editAdventure: function(json,callback){
	mongoClient.connect(config.db.url,function(err,db){
	    if(err){return console.dir(err);}
	    var id = json._id;
	    delete json['_id'];
	    console.log('JSON: '+json+' for id '+id);
	    console.log(json.adventure);
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
module.exports=database;
