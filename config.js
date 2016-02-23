//configuration files for the app
var config={};

//server configurations
config.server={};
config.server.port=8080;
config.server.path='/lisrpg';
config.server.serveStatic=true; //serve static pages using nodejs use false when using nginx
config.server.debug=true; //set debug env var for nodeJS. use false for prod. This sets inside the working process.

//database config
config.db={};
config.db.url='mongodb://localhost:27017/merge';

//auth config
config.auth={};
config.auth.google={};
config.auth.google.clientID=''; //api key
config.auth.google.clientSecret=''; //api password
config.auth.google.callbackURL='http://thebard.pt:8080/lisrpg/auth/google/return'; 
config.auth.google.scope='https://www.googleapis.com/auth/userinfo.email';


//others soon:
module.exports = config;
