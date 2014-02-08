/**
This is a test for geolocation fucntion of the HTML feature


@auther Hannan Li

update 1:
Adding error message

*/

window.onload=getMyLocation;

function getMyLocation(){
	if(navigator.geolocation){
		//alert("we get some location ~");
		navigator.geolocation.getCurrentPosition(displayLocation,displayErrorMsg);
		alert("hi");
	}else{
		alert("no geolocation suppoer for this browser ");
	}

}
function displayLocation(position){
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	var div= document.getElementById("showLocation");
	div.innerHTML="ur latitude is "+latitude+", and your longitude is "+longitude+" .";
}

function displayErrorMsg(error){
	var errorType = {
			0 : "Unkonw error",
			1 : "Permission error",
			2 : "Position is not available",
			3 : "request Time out"
	};
	
	var errorMsg = errorType[error.code];
	if(error.code==0 || error.code == 2){
		errorMsg=errorMsg+" "+error.message;
	}
	var div = document.getElementById("showLocation");
	div.innerHTML=errorMsg;
	
	
}
