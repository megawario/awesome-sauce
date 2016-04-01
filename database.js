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
    this.editAdventure = function(id,userID,json,callback){
	//only update if userID is equal to adventure userID
	this.adventure.findById(id,function(err,doc){
	    if(err){callback(err);}
	    if(doc.userID!==userID){callback(new Error("forbiden"))}
	    else{ //only update the edit adventure fields
	    	delete json.players;
	    	delete json.date;
	    	adventure.update(json,callback);}
	});
    };
	   

    //returns json with adventures using a projection for the date and request info
    this.getAdventure = function(date,callback){
	this.adventure.find()
	    .where('date').equals(date)
	    .exec(function(err,docs){
		callback(err,docs);
	    });
    };

    // removes adventure document identified by id.
    this.removeAdventure = function(id,userID,callback){
	this.adventure.findById(id,function(err,doc){
	    if(err){callback(err);}
	    doc.userID!==userID ? callback(new Error("forbiden")) : adventure.remove(doc,callback);
	});
    };
	
    //updates adventure by id, adding a new player.
    this.addPlayer = function(id,playerName,userID,callback){
	this.adventure.findById(id,function(err,doc){
	    if(err){callback(err);}
	    else{
		doc.players.push({name:playerName,userID:userID});
		doc.save(); //used to force validations of playerName
		callback(err,doc);
	    }
	});
    };
    
    //removes a player from the adventure with the id. 
    this.removePlayer = function(id,playerName,userID,callback){
	this.adventure.findById(id,function(err,doc){
	    if(err){callback(err);}
	    else{
		var player = doc.players.find(x => x.name==playerName);
		//remove if userID is null, if admin or if user owns it.
		log.debug('player userID '+player.userID+ ' doc '+doc.userID +' user '+userID);
		if(!player.userID || player.userID===userID || doc.userID===userID){
		    doc.players.pull(player);
		    doc.save(callback);
		}else{callback(new Error("forbiden"));}
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
		    cb(null,result);
		}).catch(function(err){cb(err);});
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
