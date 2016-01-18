//js for the adventure module
//this means table and other things related

//start function
$(function(){
    //enable tooltips
    $(document).tooltip({track:true});

    //add adventure dialog
    var adventureDialog = getAdventureDialog();
    $("#addAdventure").button().on("click",function(){adventureDialog.dialog("open")});

    //load adventure
    getAdventure();
});

//Returns the adventure dialog
function getAdventureDialog(){
    return $("#adventureDialog").dialog({
	title: "Adicionar aventura",
	show: {effect: "drop",duration:800},
	draggable:false,
	resizable:false,
	autoOpen: false,
	modal: true,
	buttons:{
	    "Save":createAdventure,
	    Cancel: function(){adventureDialog.dialog("close")}
	},
	close: function(){} //on close dia11log
    });
}

//Create the Adventure
// 1- post on db
// 2- on OK - close form and reload data from database
function createAdventure(){
    var content = new Object();
    content.name=$("#adv_name").val();
    content.synopsis=$("#adv_synopsis").val();
    content.adventure=$("#adv_adventure").val();
    content.system=$("#adv_system").val();

    //consider set up obeject id for update as an hidden field.
    
    //ajax request:
    $.ajax({
	type:'POST',
	contentType: "application/json",
	url: "../rest/adventure/create",
	data: JSON.stringify(content),
	//success: //refresh the screen
	//error:
    });
    //close dialog
}

//Gets adventure data, and updates the table
function getAdventure(){
    $.get("../rest/adventure",function(data){updateTable(data)});
    
}


//Updates table with information obtained on JSON
//This Json is a goup of groups
function updateTable(json){
    //json is of type adventure array
    var obj;
    for(i=0;i<json.length;i++){
	alert(JSON.stringify(json[i]));111
	obj=JSON.parse(JSON.stringify(json[i]));
	$('table').append(createTableLine(obj));//add to table
	
    }
}

//returns a table entry
function createTableLine(json){
    return "<tr> <th>"+json.system+"</th><th>"+json.adventure+"</th><th>"+json.name+"</th></tr>";   
}

//other
function showAlert(msg){
    alert(msg);
}
