$(document).ready(function(){

    //$("#google_login").click(function(){
	
	$.ajax({
	    type: 'GET',
	    url: 'http://pieinthesky.xyz:8090/checkAuth',
	    processData: true,
	    data: {},
	    dataType: "json",
	    success: function(json) {
		if(json.isAuthenticated)
		    $("#auth_buttons").html("<a href='/logout'>Logout</a>");
		else
		    $("#auth_buttons").html("<a href='/auth/google'><img src='../image/auth/google_login_dark.png'></a>");
	    },
	    error: function(x,y,z) {
		alert("error");

	    },
	});

});


function getUserID(){
    $.ajax({
	type: 'GET',
	url: 'http://pieinthesky.xyz:8090/checkAuth',
	processData: true,
	data: {},
	dataType: "json",
	success: function(json) {
	    if(json.isAuthenticated){
		alert("sending "+json.userID);
		return json.userID;
	    }
	    else{
		alert("sending null");
		return null;
	    }
	},
	error: function(x,y,z) {
	    alert("error");
	    return null;
	    
	},
    });
    
}
