//Database for this server
var mongoClient = require('mongodb').MongoClient;
var config = require('./config');
//utils

var database={

//initialize database
    initialize : function(err,callback){	
	mongoClient.connect(config.db.url,function(err,db){
	    db.collection('adventure').createIndex({"date":1,"time":1,"name":1},{unique:true});
	});
    },
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

//returns json with adventures using a projection for the date and request info
    getAdventure : function(date,callback){
	mongoClient.connect(config.db.url,function(err,db){
	    if(err){return console.dir(err);}
	    db.collection('adventure').find({"date":date}).toArray(function(err,docs){
		db.close();
		return callback(docs);
	    });
    });
    }
}

module.exports=database;
