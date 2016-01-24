//functions related to the adventure synopsis

//json is the adventure data
function createAdventureSynopsisDialog(){
    //create dialog
    $("#tabs").tabs();
    $("#adventureSynopsisDialog").dialog({
	title: "synopsis",
	show: {effect: "drop",duration:800},
	hide: {effect: "drop",duration:800},
	closeOnEscape: true,
	draggable:false,
	resizable:false,
	autoOpen: false,
	modal: true,
	width: "500px",
	//buttons:{
	    //"Save":createAdventure,
	    //Cancel: function(){$("#adventureSynopsisDialog").dialog("close")}
	//},
	//close: function(){
	  //  $("#adventureForm")[0].reset();//clear all form info
	    //getAdventure()} //fetch new possible info
    });
    
}

//set elements for synopsis
function showSynopsis(json){
    $('#as_name').text(json.name);
    $('#as_synopsis').text(json.synopsis);
    $('#adventureSynopsisDialog').dialog("option","title",json.adventure);
    $('#adventureSynopsisDialog').dialog("open");
}

