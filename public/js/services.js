angular.module('lisapp.services',[])
    .factory('lisappAPI',function($http){
	var result={};

	//get request returns http request
	result.getAdventures = function(date){
	    var my_url = '/lisrpg/rest/adventure/'+date;
	    return $http({
		method: 'GET',
		url: my_url
	    })
	}

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
	}

	return result;
    });
