//Adventure data model for mongoose.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var type = Schema.Types;

//adventure data schema
var adventureSchema = new Schema(
    {
	date: {type:String,required:true,index:true,unique:false},
	time_start: Date,            //adventure start time
	time_end: Date,              //adventure end time
	name: {type: String, required: true, maxlength:20, minlength:1 }, //dm name
	system: {type: String, maxlength:100, minlength:1},               //game system
	adventure: {type: String, required: true, maxlength:100, minlength:1} ,  //adventure title
	slots_min: {type: Number, min:0, max: 20},   //minumum slots
	slots_max: {type: Number,required: true, min:0, max:20},    //maximum slots
	players: Array,              //players
	synopsis: {type: String, maxlength:2000},    //adventure synopsis
	image: {type:String,default:"image/brand.png"}, //image to display on card for adventure.
	userID: {type: Number, required: false}         //user id, owner of the adventure.
    });

//virtual properties

//returns the count of maximum filled slots
adventureSchema.virtual('maxFilledSlots').get(function(){
    return this.slots_max-this.players.length;
});

//returns the count of minimum filled slots
adventureSchema.virtual('minFilledSlots').get(function(){
    return this.slots_min-this.players.length;
});

module.exports = mongoose.model('adventure',adventureSchema);
