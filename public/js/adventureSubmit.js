//js relating to Adventure dialog submition


//recenters and opens the dialog
function openDialog(){
    $("#adventureDialog").dialog("open");
}

//Creates adventure dialog
//on dialog close, refresh should be done to view page.
function createAdventureDialog(){
    $("#adventureDialog").dialog({
	title: "Adicionar aventura",
	show: {effect: "drop",duration:800},
	hide: {effect: "drop",duration:800},
	closeOnEscape: true,
	draggable:false,
	resizable:false,
	autoOpen: false,
	modal: true,
	width: "500px",
	position: "top",
	buttons:{
	    "Save":createAdventure,
	    Cancel: function(){$("#adventureDialog").dialog("close")}
	},
	close: function(){
	    $("#adventureForm")[0].reset();//clear all form info
	    getAdventure()} //fetch new possible info
    });
}

//Create the Adventure
// 1- post on db
// 2- on OK - close form and reload data from database
function createAdventure(){
    var content = new Object();
    content.date=getGameDate(true);
    content.name=$("#adv_name").val();
    content.synopsis=$("#adv_synopsis").val();
    content.adventure=$("#adv_adventure").val();
    content.system=$("#adv_system").val();
    content.slots=$("#adv_slots").val();
    content.time=$("#adv_time").val();
    content.players=[];

    //ajax request:
    $.ajax({
	type:'POST',
	contentType: "application/json",
	url: "../rest/adventure/create",
	data: JSON.stringify(content),
	//success: //refresh screen.
	//error:   //show error message
    });

    //instead of close here, should show animation of processing. and close should be given by ajax.
    $("#adventureDialog").dialog("close")
};  
