//Main js for the site - reflects main page.
//this means js initialization and other related stuff.
//table manipulation and entry creation.

//global flags:

var adventures=[]; //datastructure to hold the get information for displaying the content of adventures

var selectedRow;//selected table row;

//start function
$(function(){
    $(document).tooltip({track:true});            //enable tooltips
    $.getScript("../js/adventureSubmit.js");

    createAdventureDialog();  //initialize adventure add dialog
    $("#addAdventure").button().on("click",openAdventureDialog); //sets button to open dialog

    //create add player dialog;
    createPlayerDialog();

    //Create dialog for deletion confirmation.
    createDialogConfirm();

    //create synopsis dialog;
    createAdventureSynopsisDialog();

    //set page title
    $("#gameDay").text(getGameDate());

    //load adventures
    getAdventure();
});

function createDialogConfirm(){
    $("#dialogConfirm").dialog({
	resizable:false,
	autoOpen: false,
	height:140,
	modal:true,
    });
}

//Get game day date
//Returns second Saturday of the month string in the format: dd Month yyyy
//if number = false, returns in month full name
function getGameDate(number){
    var current = new Date();
    var day = getMonthDay(14,current.getMonth(),current.getFullYear());
    if(number){
	return day+"-"+current.getMonth()+"-"+current.getFullYear();
    }else{
	return getMonthDay(14,current.getMonth(),current.getFullYear()) +" "+ monthName("pt",current.getMonth())+" "+current.getFullYear();
    }
}

//Gets adventure data, and updates the table
function getAdventure(){
    //clear table
    adventures=[];
    $('table').find("tr:gt(1)").remove(); //delete table except header
    $.get("../rest/adventure/"+getGameDate(true),function(data){
	var obj;
	for(i=0;i<data.length;i++){
	    obj=JSON.parse(JSON.stringify(data[i]));
	    addNewTableLine(obj);
	}
    });
}

//add new table line to table with all functionality.
function addNewTableLine(json){
    adventures.push(json); //fill inner representation
    $('table').append(createTableLine(json));//add to table and to datastructure;
    //$(createTableLine(json)).hide().insertAfter($('table').last()).slideDown('slow');
    $(".b_player").last().on("click",function(){showPlayerDialog(adventures[$(this).parent().parent().index()-2],$(this).parent().parent().index()-2);});
    $(".b_info").last().on("click",function(){showSynopsis(adventures[$(this).parent().parent().index()-2])});
    $(".b_edit").last().on("click",function(){editAdventureDialog(adventures[$(this).parent().parent().index()-2],$(this).parent().parent().index()-2);});
}

//returns a table entry
function createTableLine(json){
    return "<tr class='tableRow'> <td class='td_time'>"+json.time
	+"</td><td class='td_system'>"+json.system
	+"</td><td class='td_adventure'>"+json.adventure
	+"</td><td class='td_slots'>"+(json.slots_max-json.players.length)
	+"</td><td class='td_icons'>"
	+"<button class='actionButton redButton b_edit'><i class='material-icons'>mode_edit</i></button>"
	+"<button class='actionButton greenButton b_info'><i class='material-icons'>info</i></button>"
	+"<button class='actionButton greenButton b_player'><i class='material-icons'>person_add</i></button></td></tr>";
}
