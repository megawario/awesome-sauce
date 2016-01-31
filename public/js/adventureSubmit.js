//js relating to Adventure dialog submition


//recenters and opens the dialog
//Type - "edit" or "create"
function openAdventureDialog(type,json,index){
    if(type == "edit"){
	//get need info - json object and the index for table mapping	     
	$("#adventureDialog").dialog("option","buttons",
				     { "Guardar": function(){
					 var json = $("#adventureDialog").data('json');
					 var index = $("#adventureDialog").data('index');
					 editAdventure(json,index)},
				     "Eliminar":function(){
					 var json = $("#adventureDialog").data('json');
					 var index = $("#adventureDialog").data('index');
					 removeAdventure(json,index)},
				     Cancel: function(){$("#adventureDialog").dialog("close")}
				     })
	    .data('json',json)     //pass data to be used on the save.
	    .data('index',index); //pass index for possible delection or edit.
    }
    else{//create
	$("#adventureDialog").dialog("option","buttons",{ "Criar":createAdventure,
							  Cancel: function(){$("#adventureDialog").dialog("close")}
							});
    }
    $("#adventureDialog").dialog("open");
}

//Creates adventure dialog
//on dialog close, refresh should be done to view page.
function createAdventureDialog(){
    $("#adventureDialog").dialog({
	title: "Adicionar aventura",
	show: {effect: "drop",duration:800,direction:"up"},
	hide: {effect: "drop",duration:800,direction:"up"},
	closeOnEscape: true,
	draggable:false,
	resizable:false,
	autoOpen: false,
	modal: true,
	position:{
	    my: "top",
	    at: "top",
	    of: window,
	    collision:"none"
	},
	close: function(){
	    $("#adventureForm")[0].reset();  //clear all form info
	}
    });
}

//Create or update the Adventure
function createAdventure(){
    //create new json object
    var json = new Object();
    json.date=getGameDate(true);
    json.name=$("#adv_name").val();
    json.synopsis=$("#adv_synopsis").val();
    json.adventure=$("#adv_adventure").val();
    json.system=$("#adv_system").val();
    json.slots=$("#adv_slots").val();
    json.time=$("#adv_time").val();
    json.players=[];
    
    //ajax request:
    $.ajax({
	type:'POST',
	contentType: "application/json",
	url: "../rest/adventure/create",
	data: JSON.stringify(json),
	success: function(data){ //add new entry to table.
	    json._id=data;//set id;
	    addNewTableLine(json);
	},
	error: function(){alert("TODO implement error msg");}  //show error message
    });

    //instead of close here, should show animation of processing. and close should be given by ajax.
    $("#adventureDialog").dialog("close")
};

function editAdventure(json,index){
    //reset all edit information
    json.date=getGameDate(true);
    json.name=$("#adv_name").val();
    json.synopsis=$("#adv_synopsis").val();
    json.adventure=$("#adv_adventure").val();
    json.system=$("#adv_system").val();
    json.slots=$("#adv_slots").val();
    json.time=$("#adv_time").val();
    json.players=[];
    
    //ajax request:
    $.ajax({
	type:'POST',
	contentType: "application/json",
	url: "../rest/adventure/edit",
	data: JSON.stringify(json),
	success: function(data){ //update table entry.
	    //alert($('.tableRow').eq(index).children('.td_system').text());
	    $('.tableRow').eq(index).children('.td_system').text(json.system);
	    $('.tableRow').eq(index).children('.td_adventure').text(json.adventure);
	    $('.tableRow').eq(index).children('.td_slots').text(json.slots);
	    $('#adventureDialog').dialog('close');
	},
	error: function(){alert("Edit Message - implement error msg");}  //show error message
    });
}

//removes adventures.
function removeAdventure(json,index){
    var postData = new Object();
    postData._id= json._id;
    $.ajax({
	type:'POST',
	contentType: "application/json",
	url: "../rest/adventure/remove",
	data: JSON.stringify(postData),
	success: function(){ //deleted adventure - refresh screen
	    adventures.splice(index,1); //remove from data model
	    $('.tableRow').eq(index).hide("slow",function(){$(this).remove();});
	},
	error: function(){alert("Remove Adventure TODO: implement error behaviour");}   //show error message
    });
    $('#adventureDialog').dialog('close');
}
    
//reuse create dialog - just update the data.
function editAdventureDialog(json,index){
    //set values for dialog:
    $("#adv_name").val(json.name);
    $("#adv_synopsis").val(json.synopsis);
    $("#adv_adventure").val(json.adventure);
    $("#adv_system").val(json.system);
    $("#adv_slots").val(json.slots);
    $("#adv_time").val(json.time);
    openAdventureDialog("edit",json,index);
}
