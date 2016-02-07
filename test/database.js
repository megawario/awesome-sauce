var assert = require('chai').assert;


describe('database',function(){
    
    //set pre conditions to test database
    var database;
    before(function(done){
	database = require('../database.js');
	database.mongoose.connection.on('connected',function(){
	    done(); //no error carry on
	});
	
	database.mongoose.connection.on('error',function(err){
	    done(err);
	}); });

    after(function(done){
	//clear mongo bd
	database.adventure.remove()
	    .then(function(){done();})
	    .catch(function(err){done(err)});
    });

    describe('#Adventure',function(){
	var test_added_id; //for testing 
	it('should be able to create an adventure whith minimum requirements',function(done){
	    var minimumJson = {name:'test name',adventure:'test adventure',slots_max:10}
	    database.createAdventure(minimumJson,function(err,jsonID){
		if(err){done(err)}
		else{
		    test_added_id = jsonID;
		    assert.isDefined(jsonID,'ID of object must not be undefined after insertion');
		    done();};
	    }); })
	
	it('should NOT be able to create an adventure without one of the  minimum requirements',function(done){
	    var notMinimumJson = {slots_min:10}
	    database.createAdventure(notMinimumJson,function(err,jsonID){
		assert.isDefined(err,'Error is Undifined');
		done();
	    }); });
	
	it('should be able to edit an existing adventure',function(done){
	    var adv_json = {name:"testEdit",adventure:"testEdit",slots_max:10};
	    database.createAdventure(adv_json, function(err,result){
		if(err){done(err)}
		else{
		    adv_json._id = result;
		    adv_json.slots_min = 9;
		    database.editAdventure(adv_json,function(err,result){
			if(err){done(err)}
			else{
			    assert.equal(result.nModified,1,"More than one file was updated");
			    done();
	    };});};});})
	
	it('should NOT be able to edit an non existing adventure',function(done){
	    var adv_json = {name:"testEdit",adventure:"testEdit",slots_max:10};
	    database.editAdventure(adv_json,function(err,result){
		if(err){done(err)}//success
		else{
		    assert.equal(result.nModified,0,"Insertion was successfull for non existing element");
		    done();
	    } }); })

	//TODO - trigger field validation and check edit success.
	//it('should NOT be able to edit an adventure with field validations',function(){});

	it('should be able to delete an existing adventure',function(done){
	    database.removeAdventure(test_added_id,function(err){
		if(err){
		    done(err);
		}else{done()}
	    }); });
	//TODO - trigger field validation and check delete success.
	it('should NOT be able to delete an existing adventure without auth',function(){});
	
    })
    
    //describe('#getAdventure',function(){
    //	it('should return adventures for a desired date',function(){});
    //});

    //test player functionality of database
    describe('#Player',function(){
	var jsonId;
	//create a entry with users for testing
	before(function(done){
	    var minimumJson = {name:'test name',adventure:'test adventure',slots_max:10,players:['teste']}
	    database.createAdventure(minimumJson,function(err,jsonID){
		jsonId=jsonID;
		if(err){done(err)}else{done()};
	    })
	});
	    
	it('should be able to add a new user to adventure',function(){
	    database.addPlayer(jsonId,"jogadorTeste",function(err,doc){
		if(err){done(err)}
		else{
		    assert.equal(doc.players[1],"jogadorTeste","Inserted player name does not match");
		    done()}
	    });
	});
	
	
	//TODO trigger validations on users
	//it('should not be able to add a new user due to validations',function(){});
    
	it('should be able to delete a player from the adventure',function(){
	    database.removePlayer(jsonId,function(err,doc){
		if(err){done(err)}
		else{
		    assert.equal(doc.players.length,1,"Did not remove player correctly");
		    done();}
	    }); });

	//TODO implement with auth
	//it('should NOT be able to delete a player form the adventure if not authenticated',function(err,docs){});

	//TODO implement this
	//it('should NOT crash the application deleting a player that does not exist',function(err,docs){});
    });
});
