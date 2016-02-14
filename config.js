//configuration files for the app
var config={};

//server configurations
config.server={};
config.server.port=9090;
config.server.path='/lisrpg/';
config.server.serveStatic=true; //serve static pages using nodejs use false when using nginx
config.server.debug=true; //set debug env var for nodeJS. use false for prod. This sets inside the working process.

//database config
config.db={};
config.db.url='mongodb://localhost:27017/dev';

//others soon:
module.exports = config;
