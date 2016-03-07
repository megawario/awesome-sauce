//Controller for table behaviour.

angular.module('lisapp.controllers',
	       ['lisapp.services'])

//controller for adventures
    .controller('adventuresController',function($scope,lisappAPI){
	this.adventure={};  //adventureOnFocus
	this.adventures={}; //adventure collection
	this.showAdd={};    //flag for player game submition
	this.player={};     //player in focus
	this.user={};       //logged in user info
	this.selectedItem='infoTable'; //info selected default is table.	

	//Error handling
	this.isError = function() {    
	    return (typeof this.errorMSG !== "undefined");
	};
	

	//auth
	this.isAuth = function(){ //check if user is logged in
	    return (typeof this.user.displayName !== "undefined");
	};

	//visual
	this.selectAddPlayer = function(adventureID){ //select player add
	    this.showAdd=adventureID;
	    this.player={};
	    if(this.isAuth()) this.player.name = this.user.displayName;
	};
	this.isAdd = function(adventureID){ //checks if player addition is selected
	    return (this.showAdd==adventureID);
	};

	//returns current selected button
	//sets if id not undefined otherwise returns crurrent selected
	this.selected = function(id){
	    //allways clear error message of forms when opening
	    this.errorMSG=undefined;
	    if(typeof id!=='undefined'){
		if(id=='createForm'){ //clear adventure before opening form
		    this.adventure = {};
		    if(this.isAuth()) this.adventure.name=this.user.displayName;
		    this.selected('ceForm'); //open edit create form.
		}else{
		    this.selectedItem = id;
		};
	    };
	    return this.selectedItem;
	};

	this.isSelected = function(id){ //checks if if id is selected 
	    return this.selectedItem === id;
	};
	
	//adds a player
	this.addPlayer = function(adventure,player){
	    adventure.players.push(player.name);
	    //push change to database
	    lisappAPI.addPlayer(adventure,player.name)
		.then((function(response){
		    alert('worked');
		}).bind(this),function(response){alert('add player failed');});
	    this.selectAddPlayer('hide'); //hidePlayerAdd
	}
	
	//removes player from adventure
	this.removePlayer = function (adventure,player){
	    lisappAPI.removePlayer(adventure._id,player)
		.then( (function(response){
		    this.adventure=response.data;
		}).bind(this), //change object to reflect deletion
		       function(response){alert("failed to remove the played");});
	};

	//focus adventure
	this.selectAdventure = function selectAdventure(adventure){
	    this.adventure=adventure;
	};

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
	    lisappAPI.deleteAdventure(adventure._id)
		.then(
		    (function(response){
			this.adventures.splice(this.adventures.indexOf(adventure),1);
			this.selected('infoTable');
		    }).bind(this),
		    (function(response){
			if(response.status==401){
			    this.errorMSG="Esta operação não está autorizada. Só o dono da aventura a pode apagar.";
			}else{
			    this.errorMSG="Ocurreu um erro e a operação não foi executada.";
			}
		    }).bind(this))
		    ;};
	
	//utils
	this.getGameDate = function getGameDate(number){
	    var current = new Date();
	    var day = getMonthDay(14,current.getMonth(),current.getFullYear());
	    if(number){
		return day+"-"+current.getMonth()+"-"+current.getFullYear();
	    }else{
		return getMonthDay(14,current.getMonth(),current.getFullYear()) +" "+ monthName("pt",current.getMonth())+" "+current.getFullYear();
	    };
	};
	
	//opens the adventure edit form, sets adventure in focus
	this.editAdventure = function(adventure){
	    this.adventure = adventure;
	    this.selected('ceForm');
	};

	//defaults and execution
	this.title = this.getGameDate(false);
	this.gameDate = this.getGameDate(true);

	lisappAPI.getAdventures(this.gameDate).then(
	    (function(response){ this.adventures=response.data;}).bind(this));

	lisappAPI.getAuth().then(
	    (function(response){this.user=response.data}).bind(this));
    });
