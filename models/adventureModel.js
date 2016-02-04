//Adventure data model for mongoose.

//adventure data schema
var adventureSchema = new Schema(
    {
	_id: ObjectId,               //object id
	time_start: Date,            //adventure start time
	time_end: Date,              //adventure end time
	name: {type: String, required: true},             //dm name
	system: {type: String},      //game system
	adventure: {type: String, required: true} ,       //adventure title
	slots_min: {type: Number, min:0, max: slot_max},  //minumum slots
	slots_max: {type: Number,required: true},         //maximum slots
	players: Array,              //players
	synopsis: {type: String}     //adventure synopsis
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


var adventureModel = mongoose.model('Participant',,'');

module.exports = adventureModel;
