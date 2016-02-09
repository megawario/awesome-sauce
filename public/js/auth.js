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


function getUserID(cb){
    $.ajax({
	type: 'GET',
	url: 'http://pieinthesky.xyz:8090/checkAuth',
	processData: true,
	data: {},
	dataType: "json",
	success: function(json) {
	    if(json.isAuthenticated){
		return cb(json.userID);
	    }
	    else{
		return cb(null);
	    }
	},
	error: function(x,y,z) {
	    alert("error");
	    return cb(null);
	    
	},
    });
    
}

function verifyAuthorization(json, cb){
    $.ajax({
    	type: 'POST',
	contentType: "application/json",
	url: 'http://pieinthesky.xyz:8090/checkAuth',
	data: JSON.stringify(json),
	dataType: "json",
	success: function(authReply) {
	    return cb(authReply);
	},
	error: function(x,y,z) {
	    return cb({"isAuthorized": false});
	    
	},
    });
    
}



