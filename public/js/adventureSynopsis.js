//functions related to the adventure synopsis

//json is the adventure data
function createAdventureSynopsisDialog(){
    //create dialoga
    $("#as_accordion").accordion({heightStyle:"content",autoHeight:false})
    $("#progressbar").progressbar();
    $("#adventureSynopsisDialog").dialog({
	title: "synopsis",
	show: {effect: "drop",duration:1000,direction:"up"},
	hide: {effect: "drop",duration:1000,direction:"up"},
	closeOnEscape: true,
	draggable:false,
	resizable:false,
	autoOpen: false,
	modal: true,
	minWidth: "300",
	minHeight: "300",
	height: 500,
	width: 500,
	position:{
	    my: "top",
	    at: "top",
	    of: window,
	    collision:"none"
	},
    });
}

//set elements for synopsis
function showSynopsis(json){
    $('#as_name').text(json.name);
    $('#as_synopsis').text(json.synopsis);
    $('#progressbar').progressbar("option","value",getFillValue(json.players.length,json.slots));
    $('#as_slots').text(getProgressLabelText(getFillValue(json.players.length,json.slots)));
    $('#as_players').empty();//clear current players
    json.players.map(function(current){
	$('#as_players').append(newNameLine(current));
	$('.b_removePlayer').last().on('click',function(){removePlayer($(this).parent(),json,current);});
    });
    $('#adventureSynopsisDialog').dialog("option","title",json.adventure);
    $('#as_accordion').accordion("refresh");//resize the accordion
    $('#adventureSynopsisDialog').dialog("open");
}

function getFillValue(playerNumber,slotNumber){
    if(playerNumber==0 || slotNumber ==0){return 0}
    else{return playerNumber*100/slotNumber;}
}

//returns funny sentence to progress advancement.
function getProgressLabelText(progress){
    if(progress <= 0){return "sem jogadores";}else
	if(progress <=25){return "está a subir!";} else
	    if(progress <=50){return "esta a meio";}else
		if(progress <=75){return "quase lá";}else
		    if(progress=100){
			return "completo!";
		    };
}

//creates a new line for the player name
function newNameLine(name){
    return "<li class='pd_nameLine'><p>"+name+"</p><button class='actionButton redButton b_removePlayer'><i class='material-icons'>clear</i></button></li>"
}

//removes player from game
//elementId will give the position of the li to be remove as well as the pos in the player array.
function removePlayer(element,json,playerName){
    var postData = new Object();
    postData._id = json._id;
    postData.playerName= json.players[element.index()];

    $.ajax({
	type:'POST',
	contentType: "application/json",
	url: "../rest/adventure/player/remove",
	data: JSON.stringify(postData),
	success: function(){//on success remove item directly from the synopsis screen.
	    //hide element
	    element.hide('slow',function(){element.remove()});
	    //update client state: data and recalculate fill.
	    json.players.splice(element.index(),1);//remove from json representation.
	    $('#progressbar').progressbar("option","value",getFillValue(json.players.length,json.slots));
	    $('#as_slots').text(getProgressLabelText(getFillValue(json.players.length,json.slots)));
	},
	//error:   //show error message
	//TODO behavior for this. probably in the form of promisses.
    });
}
