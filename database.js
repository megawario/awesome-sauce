//Database access for the server
// Instanciate the object and access database using the methods.

module.exports = function Database(connectionString){
    	log = require('./utils').log;
	this.mongoose = require('mongoose');
	this.mongoose.connect(connectionString);


	//load schemas
	this.adventure = require('./models/adventureModel.js');
	this.session = require('./models/sessionModel.js');
	
	//connection events:
	this.mongoose.connection.on('connected',function(){
	    log.info('Mongoose connected to: '+connectionString);
	});
	this.mongoose.connection.on('error',function(err){
	    log.err('Mongoose error on connection: '+err);
	});
	this.mongoose.connection.on('disconnected',function(){
	    log.warning('Mongoose disconnected');
	});

    //creates new adventure on database, returns the err, and doc newlycreated id on the callback.
    this.createAdventure = function(json,callback){
		this.adventure.create(json)
			.then(
				function(result){ //success
				callback(null,result);
		}).catch(function(err){callback(err);});
    };

    //updates existing adventure
    this.editAdventure = function(json,callback){
		this.adventure.update({_id:json._id},json)
			.then(function(result){
			callback(null,result);})
			.catch(function(err){callback(err);});
    };

    //returns json with adventures using a projection for the date and request info
    this.getAdventure = function(date,callback){
		this.adventure.find()
			.where('date').equals(date)
			.exec(function(err,docs){
			callback(err,docs);
	    });
    };

    // removes adventure docment identified by id.
    this.removeAdventure = function(id,callback){
		console.log("Removing ID ", id);
		this.adventure.remove(id,callback);
	};
    
    // removes adventure docment identified by id.
    this.removeAdventure = function(id,callback){
		this.adventure.remove(id,callback);
    };
    
    //updates adventure by id,  ading a new user.
    this.addPlayer = function(id,playerName,callback){
		this.adventure.findById(id,function(err,doc){
			if(err){callback(err);}
			else{
			doc.players.push(playerName);
			doc.save(callback); //used to force validations of playerName
			}
		});
    };
    
    //removes a player from the adventure with the id. 
    this.removePlayer = function(id,playerName,callback){
		this.adventure.findById(id,function(err,doc){
			if(err){callback(err);}
			else{
			doc.players.pull(playerName);
			doc.save(callback);
			}
		});
    };
	
	//auth:
    this.getUserById = function(id, cb){
		this.session.findOne({'userID': id}, function(err, user){
			cb(err, user);
		});
	};
    
	this.addUser = function(json, cb){
		this.session.create(json)
			.then(
			function(result){ //success
				callback(null,result);
			}).catch(function(err){callback(err);});
    };
	
	//verifies that a user is authorized to edit/remove adventure
    this.checkUserAuth = function(id, userID, callback){
		this.adventure.findById(id, function(err, doc){
			if(err){
			console.log("cheakUserAuth ERROR!!!!!!!");
			callback(err, null)
			}
			else{
				if(doc.userID != null && doc.userID== userID){
					log.info("USER AUTHORIZED TO EDIT DB DATA Doc: "+doc+" userID: "+userID);
					callback(null, true);
				}
				else{
					log.info("USER NOTAUTHORIZED TO EDIT DB DATA Doc: "+doc+" userID: "+userID);
					callback(null, false)
				}
			}
		});
    };
	
	return this;
}
