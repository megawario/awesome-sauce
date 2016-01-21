//Main js for the site - reflects main page.
//this means js initialization and other related stuff.
//table manipulation and entry creation.

//start function
$(function(){
    $(document).tooltip({track:true});            //enable tooltips
    $.getScript("../js/adventureSubmit.js");

    createAdventureDialog();  //initialize adventure add dialog
    $("#addAdventure").button().on("click",function(){$("#adventureDialog").dialog("open")}); //sets button to open dialog

    //load adventure
    //getAdventure();
});

//Gets adventure data, and updates the table
function getAdventure(){
    $.get("../rest/adventure",function(data){
	var obj;
	for(i=0;i<data.length;i++){
	    obj=JSON.parse(JSON.stringify(data[i]));
	    $('table').append(createTableLine(obj));//add to table
	}
    });
 }


//returns a table entry
function createTableLine(json){
    return "<tr> <th>"+json.time+"</th><th>"+json.system+"</th><th>"+json.adventure+"</th><th>"+json.slots+"</th></tr>";   
}

//Create a new entry on the synopsis table
function createSynopsis(json){
    var syn= $(".synopsis").clone();       //clone structure for use next
    alert(syn.children("#s_name").text());
    //syn.("#s_name").text("This is text");  //edit values and then append to corect place
    syn.appendTo("#synopsis");
    //synopsis.("#s_name").val("This is test");
    //synopsis.("#s_synopsis").val("awesome test this is");
    //return synopsis;
}
