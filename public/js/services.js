angular.module('lisapp.services',[])
    .factory('lisappAPI',function($http){
	var result={};

	//get request returns http request
	result.getAdventures = function(date){
	    var my_url = '/lisrpg/rest/adventure/'+date;
	    return $http({
		method: 'GET',
		url: my_url
	    });
	};

	//add player to adventure
	result.addPlayer = function(adventureID,playerName){
	    var payload = { "_id":adventureID,"player":playerName};
	    var my_url = '/lisrpg/rest/adventure/player/add';
	    return $http({
		method: 'POST',
		url: my_url,
		data: payload
	    });
	};

	//remove player
	result.removePlayer = function(adventureID,playerName){
	    var payload = { "_id":adventureID,"playerName":playerName};
	    var my_url = '/lisrpg/rest/adventure/player/remove';
	    return $http({
		method: 'POST',
		url: my_url,
		data: payload
	    });
	};

	result.deleteAdventure = function(adventureID){
	    var my_url = '/lisrpg/rest/adventure/remove'
	    var payload = {"_id":adventureID};
	    return $http({
		method: 'POST',
		url: my_url,
		data: payload
	    });

	};
	
	//creates or edits adventure.
	result.addAdventure = function(adventure){ 
	    if(typeof adventure._id !== "undefined"){
		var my_url='/lisrpg/rest/adventure/edit'; 
	    }else{
		var my_url='/lisrpg/rest/adventure/create';
	    }
	    
	    return $http({
		method: 'POST',
		url: my_url,
		data: adventure
	    })
	};

	return result;
    });
