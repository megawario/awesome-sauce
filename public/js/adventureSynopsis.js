//functions related to the adventure synopsis

//json is the adventure data
function createAdventureSynopsisDialog(){
    //create dialog
    $("#tabs").tabs();
    $("#progressbar").progressbar();
    $("#as_addPlayer").button();
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
    var progress = json.players.length*100/json.slots;
    $('#as_name').text(json.name);
    $('#as_synopsis').text(json.synopsis);
    $('#progressbar').progressbar("option","value",progress);
    $('#as_slots').text(getProgressLabelText(progress));
    $('#adventureSynopsisDialog').dialog("option","title",json.adventure);
    $('#adventureSynopsisDialog').dialog("open");
}


//returns funny sentence to progress advancement.
function getProgressLabelText(progress){
    if(progress <= 0){return "Be the first!";}else
	if(progress <=25){return "fill it up!";} else
	    if(progress <=50){return "Half empty/full!";}else
		if(progress <=75){return "Hurry!!";}else
		    if(progress=100){
			return "Full!";
		    };
}

