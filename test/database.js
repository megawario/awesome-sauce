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
	});
    });

    describe('#CreateAdventure',function(){

	it('should be able to create an adventure whith minimum requirements',function(done){
	    var minimumJson = {name:'test name',adventure:'test adventure',slots_max:10}
	    this.timeout(30000);
	    database.createAdventure(minimumJson,function(err,jsonID){
		if(err){done(err)}
		else{done();};
	    });
	})
	
	it('should NOT be able to create an adventure without one of the  minimum requirements',function(done){
	    var notMinimumJson = {slots_min:10}
	    database.createAdventure(notMinimumJson,function(err,jsonID){
		assert.isDefined(err,'Error is Undifined');
		done();
	    });	    
	});
    });
});
