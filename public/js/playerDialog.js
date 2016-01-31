//Player Dialog JS

function createPlayerDialog(){
    $("#playerDialog").dialog({
	title: "Inscrever",
	show: {effect: "drop",duration:1000,direction:"up"},
	hide: {effect: "drop",duration:1000,direction:"up"},
	closeOnEscape: true,
	draggable:false,
	resizable:false,
	autoOpen: false,
	modal: true,
	width: "500px",
	position:{
	    my: "top",
	    at: "top",
	    of: window,
	    collision:"none"},
	buttons:{
	    "Inscrever": createPlayer,
	    Cancel: function(){$("#playerDialog").dialog("close")}
	},
	close: function(){
	    $("#playerForm")[0].reset();//clear all form info
	    getAdventure(); //fetch new possible info
	}
    });    
}

//call to api for adding the player.
function createPlayer(){
    var json = $("#playerDialog").data('json'); //fetch current selected information
    //json post, and submit to database;
    var content = new Object();
    content._id = json._id;
    content.player=$("#pf_player").val();
    //TODO validate input by user.
    //ajax request:
    $.ajax({
	type:'POST',
	contentType: "application/json",
	url: "../rest/adventure/player/add",
	data: JSON.stringify(content),
//	success: function(){},
	//error:   //show error message
	//TODO behavior for this. probably in the form of promisses.
    });
    $('#playerDialog').dialog('close');  
}

//opens the playerDialog
function showPlayerDialog(json){
    $("#playerDialog")
	.data('json',json) //pass data to be used on the save.
	.dialog('option','title','inscrever - ' + json.adventure)
	.dialog("open");
}
