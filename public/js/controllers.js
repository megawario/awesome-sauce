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
	this.errorMSG;
	this.errorPlace;

	//use this to set errors
	this.setError = function(err,place){
	    this.errorMSG = err;
	    this.errorPlace=place;
	};
	
	this.isError = function(place) {
	    if(place != this.errorPlace){return false;} //not this error
	    return (typeof this.errorMSG !== "undefined");
	};
	

	//auth
	this.isAuth = function(){ //check if user is logged in
	    return (typeof this.user.displayName !== "undefined");
	};

	//visual
	this.selectAddPlayer = function(adventureID){ //select player add
	    this.showAdd=adventureID;
	    this.setError(undefined,undefined);
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
	    this.setError(undefined,undefined);
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
	    //commit to database;
	    lisappAPI.addPlayer(adventure,player.name)
		.then((function(response){
		    this.adventures[this.adventures.indexOf(adventure)]=response.data;
		    this.selectAddPlayer('hide');
		}).bind(this),function(response){
		    //failed with code:
		    this.setError("Ocurreu um erro e a operação não foi executada","player");
		});
	}
	
	//removes player from adventure
	this.removePlayer = function (adventure,player){
	    lisappAPI.removePlayer(adventure._id,player)
		.then( (function(response){
		    this.adventures[this.adventures.indexOf(adventure)]=response.data;
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
		    (function(response){
			if(response.status==401){
			    
			    this.setError("Esta operação não está autorizada. Só o dono da aventura a pode editar.","table");
			}else{
			    this.setError("Ocurreu um erro e a operação não foi executada.","table");
			}
		    }).bind(this));
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
			   this.setError("Esta operação não está autorizada. Só o dono da aventura a pode apagar.","table");;
			}else{
			    this.setError("Ocurreu um erro e a operação não foi executada.","table");
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
	    (function(response){
		this.adventures=response.data;
		//do to contraints on input field [time] starttiem and endtime must be converted to date objects
		for (var i of this.adventures) {
		    i.time_start=new Date(i.time_start);
		    i.time_end= new Date(i.time_end);
		}
	    }).bind(this));

	lisappAPI.getAuth().then(
	    (function(response){this.user=response.data}).bind(this));
    });
