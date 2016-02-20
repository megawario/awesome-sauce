
//messed up log function

var logger =  function (string,level){
    if(process.env.NODE_ENV == "development"){
	switch(level){
	case "info": console.log("INFO: "+string);break;
	case "debug":console.log("DEBUG: "+string);break;
	case "warning": console.log("WARNING: "+string);break;
	case "critical":console.log("CRITICAL: "+string);break;
	default: //default value is info
	    console.log("INFO: "+string);break;
	}
    }
    else{ //log in production
	if(level=="critical"){
	    console.log("CRITICAL: "+ string);
	}
    }
}

var utils={};

//support methods
utils.log={};
utils.log.log = function(string,level){logger(string,level);};
utils.log.warning = function(string){logger(string,"warning");};
utils.log.info = function(string){logger(string,"info");};
utils.log.err = function(string){logger(string,"critical");};
utils.log.debug = function(string){logger(string,"debug");};
module.exports=utils;
