//configuration files for the app
var config={};

//server configurations
config.server={};
config.server.port=8090;
config.server.path='/lisrpg/';

//service configuration
config.services={};
config.services.port=8090;

//database config
config.db={};
config.db.url='mongodb://localhost:27017/lissch';

//others soon:

module.exports = config;
