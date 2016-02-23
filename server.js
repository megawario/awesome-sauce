//Main server app

//setup
var config = require("./config");
var log = require("./utils").log;

//set debug mode according to config
if(config.server.debug){ 
    process.env.NODE_ENV="development";
    log.warning("Development mode on");
}else{ process.env.NODE_ENV="production";}

//catch errors and log.
process.on('uncaughtException',function(err){
    log.err('Caught exception: '+err);
    log.err('Caught exception: '+err.stack);
});

var passport = require('./passport.js');
var express = require('express');
var app = express();
var advRoutes = require("./routes/adventureAPI.js");
var authRoutes =require("./routes/authAPI.js");
var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(passport._session);
app.use(passport.initialize());
app.use(passport.session());

app.use(config.server.path+"/rest",advRoutes);
app.use(config.server.path+"/auth",authRoutes);

//serve static pages:
if(config.server.serveStatic){
    app.use(config.server.path,express.static(__dirname + '/public'));
}

//start server
app.listen(config.server.port, function(){
    log.info('App running on port '+config.server.port);
});
