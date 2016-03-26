//Adventure data model for mongoose.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var type = Schema.Types;

//obfuscate fields when sending to client.
function obfuscate(doc,ret,options){
    delete ret.userID;
    ret.players.map(function(x){delete x.userID; delete x._id}); //delete userID;
}

//adventure data schema
var adventureSchema = new Schema(
    {
	date: {type:String,required:true,index:true,unique:false},
	time_start: {type:Date, required:true},            //adventure start time
	time_end: Date,              //adventure end time
	name: {type: String, required: true, maxlength:20, minlength:1 }, //dm name
	system: {type: String, maxlength:100, minlength:1},               //game system
	adventure: {type: String, required: true, maxlength:100, minlength:1} ,  //adventure title
	slots_min: {type: Number, min:0, max: 20},   //minumum slots
	slots_max: {type: Number,required: true, min:0, max:20},    //maximum slots
	players: [{name: String,
		   userID: Number}],              //players
	synopsis: {type: String, maxlength:2000},    //adventure synopsis
	image: {type:String,default:"image/brand.png"}, //image to display on card for adventure.
	userID: {type: Number, required: false}         //user id, owner of the adventure.
    },{toJSON:{transform: obfuscate, virtuals:true}}
);

//returns the count of maximum filled slots
adventureSchema.virtual('maxSlots').get(function(){
    var slots= this.slots_max-this.players.length;
    if(slots<0) slots=0;
    return slots;
});

//returns the count of minimum filled slots
adventureSchema.virtual('minSlots').get(function(){
    var slots= this.slots_min-this.players.length;
    if(slots<0) slots=0;
    return slots;
});


module.exports = mongoose.model('adventure',adventureSchema);
