//define session schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sessionSchema = new Schema({
    userID: Number,
    displayName: String,
    email: String,
    accessToken: String,
    cookieID: String
});

//user data model for mongoose.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var type = Schema.Types;

//session data schema
var sessionSchema = new Schema(
    {
	userID: Number,
	displayName: String,
	email: String,
	accessToken: String,
	cookieID: String
	
    });

module.exports = mongoose.model('session',sessionSchema);
