//Main server app

//import
var http = require("http");
var express = require("express");
var services = require("express");
var fs = require("fs");
var config = require("./config");
var bodyParser= require("body-parser");

var db = require("./database");

var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res){
    res.send('Nothing to see here');
});


//define services
app.use(bodyParser.json());
app.post('/rest/adventure/create',function(req,res){
    //putOnDB
    db.createAdventure(req.body,function(result){
	res.send(result);
    });
});

app.get('/rest/adventure/:date',function(req,res){
    db.getAdventure(req.params.date,function(result){
	res.send(result);
    });
});



//start server
app.listen(config.server.port, function(){
    console.log('App running on port '+config.server.port);
});

