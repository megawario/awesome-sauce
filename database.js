//Database for this server
var mongoClient = require('mongodb').MongoClient;
var config = require('./config');
//utils

var database={

//creates new adventure on database
    createAdventure : function(json,callback){
	mongoClient.connect(config.db.url,function(err,db){
	    if(err){return console.dir(err);}
	    db.collection('adventure').insertOne(json,{w:1},function(err,r){
		console.log(r.insertedCount);
		db.close();
		return callback(err);
	    });
			    
	});
    },

//returns json with adventures
    getAdventure : function(callback){
    mongoClient.connect(config.db.url,function(err,db){
	if(err){return console.dir(err);}
	db.collection('adventure').find().toArray(function(err,docs){
	    db.close();
	    return callback(docs);
	});
    });
    }
}

module.exports=database;
