//Main js for the site - reflects main page.
//this means js initialization and other related stuff.
//table manipulation and entry creation.

//global flags:
var selectedRow;//selected table row;

//start function
$(function(){
    //$(document).tooltip({track:true});            //enable tooltips
    $.getScript("../js/adventureSubmit.js");

    createAdventureDialog();  //initialize adventure add dialog
    $("#addAdventure").button().on("click",openAdventureDialog); //sets button to open dialog

    //create add player dialog;
    createPlayerDialog();

    //Create dialog for deletion confirmation.
    createDialogConfirm();

    //create synopsis dialog;
    createAdventureSynopsisDialog();
    
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

//add new table line to table with all functionality.
function addNewTableLine(json){
    adventures.push(json); //fill inner representation
    $('table').append(createTableLine(json));//add to table and to datastructure;
    //$(createTableLine(json)).hide().insertAfter($('table').last()).slideDown('slow');
    $(".b_player").last().on("click",function(){showPlayerDialog(adventures[$(this).parent().parent().index()-2],$(this).parent().parent().index()-2);});
    $(".b_info").last().on("click",function(){showSynopsis(adventures[$(this).parent().parent().index()-2])});
    $(".b_edit").last().on("click",function(){editAdventureDialog(adventures[$(this).parent().parent().index()-2],$(this).parent().parent().index()-2);});
}

