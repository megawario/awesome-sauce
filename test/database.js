var assert = require('chai').assert;


describe('database',function(){

    describe('#Initialize',function(){
	it('should connect to database',function(){
	    var database = require('../database.js');
	    assert.isDefined(database.adventure,"database model returned undefined");
	});

    });

    describe('#CreateAdventure',function(){
	it('should be able to create an adventure whith minimum requirements',function(done){
	    var database = require('../database.js');
	    var minimumJson = {name:'test name',adventure:'test adventure',slots_max:10}
	    this.timeout(30000);
	    database.createAdventure(minimumJson,function(err,jsonID){
		if(err){done(err)}
		else{done();};
	    });
	})
	it('should NOT be able to create an adventure without one of the  minimum requirements',function(done){
	    var database = require('../database.js');
	    var notMinimumJson = {slots_min:10}
	    database.createAdventure(notMinimumJson,function(err,jsonID){
		assert.isDefined(err,'Error is Undifined');
		done();
	    });	    
	});
    });
});
