//Usefull functions to be used.


//returns string with name of the month
function monthName(language,monthNumber){
    if(monthNumber>11 || monthNumber <0){
	return new Error("Wrong number for month");
    }
    switch (language){
    case "pt":
	var months = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Stembro","Outubro","Novembro","Dezembro"];
	return months[monthNumber];
	break;
    default:
	return new Error("Language not supported");
	break;
    }
}

//returns monthy day by normalizing the first day to the start of the week, and counting the number of days. 
function getMonthDay(days,month,year){
    var startWeekDay = new Date(year,month,1).getDay(); //normalize start of the week
    return days-startWeekDay;
}


