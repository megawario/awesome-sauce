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
    $("#addAdventure").button().on("click",openDialog); //sets button to open dialog

    //create add player dialog;
    createPlayerDialog();
    
    //create synopsis dialog;
    createAdventureSynopsisDialog();
    
    //set page title
    $("#gameDay").text(getGameDate());

    //load adventures
    getAdventure();
});


function selectTableRow(event){
    var index = $(this).parent().parent().parent().index()-2; //minus the header and title row (-2) the parent.parent fetches the line
    showSynopsis(adventures[index]);
}

function playerDialog(){
    // -2 for headers 3 parents to fetch the line.
    var index=$(this).parent().parent().parent().index()-2;
    alert(index);
    showPlayerDialog(adventures[index]);
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
    adventures=[];
    $('table').find("tr:gt(1)").remove(); //delete table except header
    $.get("../rest/adventure/"+getGameDate(true),function(data){
	var obj;
	for(i=0;i<data.length;i++){
	    obj=JSON.parse(JSON.stringify(data[i]));
	    $('table').append(createTableLine(obj));//add to table and to datastructure;
	    $(".b_player").last().on("click",playerDialog);
	    $(".b_info").last().on("click",selectTableRow);
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
	+"</td><td class='td_slots'>"+json.slots
	+"</td><td class='td_icons'>"
	+"<button class='button'><i class='material-icons b_info myButton'>info</i></button>"
	+"<button class='button'><i class='material-icons b_player myButton'>person_add</i></button></td></tr>";   
}

