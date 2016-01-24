//Main js for the site - reflects main page.
//this means js initialization and other related stuff.
//table manipulation and entry creation.

//global flags:

var adventures=[];
var selectedRow;//selected table row;
//start function
$(function(){
    $(document).tooltip({track:true});            //enable tooltips
    $.getScript("../js/adventureSubmit.js");

    createAdventureDialog();  //initialize adventure add dialog
    $("#addAdventure").button().on("click",openDialog); //sets button to open dialog

    //create synopsis dialog;
    createAdventureSynopsisDialog();
    
    //set page title
    $("#gameDay").text(getGameDate());

    //load adventures
    getAdventure();
});

function selectTableRow(event){
    var index = $(this).parent().index()-2; //minus the header and title row
    showSynopsis(adventures[index]);
}


//Get game day date
//Returns second Saturday of the month string in the format: dd Month yyyy
//if number = false, returns in numeral dd-mm-yyyy
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
    $('table').find("tr:gt(1)").remove(); //delete table except header
    $.get("../rest/adventure/"+getGameDate(true),function(data){
	var obj;
	for(i=0;i<data.length;i++){
	    obj=JSON.parse(JSON.stringify(data[i]));
	    $('table').append(createTableLine(obj));//add to table and to datastructure;
	    $(".tableRow").last().on("click","td",selectTableRow); //delegate behavior;
	}
    });
 }


//returns a table entry
function createTableLine(json){
    //fill var
    adventures.push(json);
    return "<tr class='tableRow'> <td class='td_time'>"+json.time
	+"</td><td class='td_system'>"+json.system
	+"</td><td class='td_adventure'>"+json.adventure
	+"</td><td class='td_slots'>"+json.slots+"</td></tr>";   
}

