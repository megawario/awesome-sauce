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
	    "Inscrever": function(){
		var json = $("#playerDialog").data('json'); 
		var index = $("#playerDialog").data('index'); 
		createPlayer(json,index)},
	    Cancel: function(){$("#playerDialog").dialog("close")}
	},
	close: function(){
	    $("#playerForm")[0].reset();//clear all form info
	}
    });    
}

//call to api for adding the player.
function createPlayer(json,index){
    //json post, and submit to database;
    var content = new Object();
    content._id = json._id;
    content.player=$("#pf_player").val();
    json.players.push(content.player);
    //ajax request:
    $.ajax({
	type:'POST',
	contentType: "application/json",
	url: "../rest/adventure/player/add",
	data: JSON.stringify(content),
	success: function(){
	    $('.tableRow').eq(index).children('.td_slots').text(json.slots-json.players.length);//update line
	},
	error:  function(){alert("TODO - playerDialog - implement error handling")}   //show error message
	//TODO behavior for this. probably in the form of promisses.
    });
    $('#playerDialog').dialog('close');  
}

//opens the playerDialog
function showPlayerDialog(json,index){
    $("#playerDialog")
	.data('json',json) //pass data to be used on the save.
        .data('index',index)
	.dialog('option','title','inscrever - ' + json.adventure)
	.dialog("open");
}
