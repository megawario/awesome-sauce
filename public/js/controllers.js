//Controller for table behaviour.

angular.module('lisapp.controllers',
	       ['lisapp.services'])

    .controller('scopeController',function($scope,lisappAPI){
	$scope.getGameDate = function getGameDate(number){
	    var current = new Date();
	    var day = getMonthDay(14,current.getMonth(),current.getFullYear());
	    if(number){
		return day+"-"+current.getMonth()+"-"+current.getFullYear();
	    }else{
		return getMonthDay(14,current.getMonth(),current.getFullYear()) +" "+ monthName("pt",current.getMonth())+" "+current.getFullYear();
	    };
	};
	
	$scope.title = $scope.getGameDate(false);
	$scope.gameDate = $scope.getGameDate(true);

	
    })

    //controller for adventures
    .controller('adventuresController',function($scope,lisappAPI){
	
	this.adventure={}; //selected or new adventure.
	this.adventures={"teste":123};
	
	//update or create adventure adventure
	this.addAdventure = function(){
	    //fill in extra adventure info:
	    this.adventure.date = $scope.gameDate;
	    lisappAPI.addAdventure(this.adventure)
		.then(function(response){this.adventures.push(response.data);},
		      function(response){alert('add adventure failed');
		      });
	};

	//returns current selected button
	this.selectedButton=0; //number from 0 onwards
	this.selected = function(button){
	    if(typeof button!=='undefined'){
		this.selectedButton = button;};
	    return this.selectedButton;
	};
	this.isSelected = function(button){
	    return this.selectedButton === button;
	}

	//TODO FIX THIS to return promiss to place. 
	lisappAPI.getAdventures($scope.gameDate)
	    .then(function(response,adventures){ response.data;});

    });
