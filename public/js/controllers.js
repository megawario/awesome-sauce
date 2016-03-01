//Controller for table behaviour.

angular.module('lisapp.controllers',
	       ['lisapp.services'])

    .controller('scopeController',function($scope,lisappAPI){

	
    })

    //controller for adventures
    .controller('adventuresController',function($scope,$location,$anchorScroll,lisappAPI){
	
	this.adventure={}; //adventureOnFocus
	this.adventures={};
	this.showAdd={};
	this.player={};
	
	//visual queue to add player correctly
	this.toAdd = function(id){this.showAdd=id;
				  this.player={};
				 };
	this.isAdd = function(id){return (this.showAdd==id)};

	//returns current selected button
	this.selectedItem='infoTable'; //default id selection is table
	this.selected = function(id){ //sets if id not undefined otherwise returns crurrent selected
	    if(typeof id!=='undefined'){
		if(id=='createForm'){ //clear adventure before opening form
		    this.adventure = {};
		    id='ceForm';
		}
		this.selectedItem = id;
	    };
	    return this.selectedItem;
	};
	//checks if it is selected 
	this.isSelected = function(id){
	    return this.selectedItem === id;
	}
	
	//adds a player
	this.addPlayer = function(adventure,player){
	    adventure.players.push(player.name);
	    //push change to database
	    lisappAPI.addPlayer(adventure,player.name)
		.then((function(response){
		    alert('worked');
		}).bind(this),function(response){alert('add player failed');});
	    this.toAdd('hide');
	}
	
	
	//removes player from adventure
	this.removePlayer = function (adventure,player){
	    alert(adventure._id);
	    lisappAPI.removePlayer(adventure._id,player)
		.then( (function(response){
		    this.adventure=response.data;
		}).bind(this), //change object to reflect deletion
		       function(response){alert("failed to remove the played");});
	};

	
	this.selectAdventure = function selectAdventure(adventure){
	    this.adventure=adventure;
	};

	this.getGameDate = function getGameDate(number){
	    var current = new Date();
	    var day = getMonthDay(14,current.getMonth(),current.getFullYear());
	    if(number){
		return day+"-"+current.getMonth()+"-"+current.getFullYear();
	    }else{
		return getMonthDay(14,current.getMonth(),current.getFullYear()) +" "+ monthName("pt",current.getMonth())+" "+current.getFullYear();
	    };
	};
	
	this.title = this.getGameDate(false);
	this.gameDate = this.getGameDate(true);

	
	//updates or creates an adventure
	this.addAdventure = function(){
	    //fill in extra adventure info:
	    this.adventure.date = this.gameDate;
	    
	    lisappAPI.addAdventure(this.adventure)
		.then(
		    (function(response){ 
			this.adventures.push(response.data);
			this.selected('infoTable'); //return to table screen.
		    }).bind(this),
		      function(response){alert('add adventure failed');
		      });
	};

	//deletes adventure
	this.removeAdventure = function(adventure){
	    this.adventures.splice(this.adventures.indexOf(adventure),1);
	    this.selected('infoTable');
	    lisappAPI.deleteAdventure(adventure._id)
		.then(
		    (function(response){alert('removed');}).bind(this),
		    function(response){alert('delete adventure failed');}
		);
	};
	
	lisappAPI.getAdventures(this.gameDate)
	    .then(
		(function(response){ this.adventures=response.data;}).bind(this));

    });
