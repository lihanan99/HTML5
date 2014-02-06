/**
This is a test for geolocation fucntion of the HTML feature

@auther Hannan Li
*/

window.onload=getMyLocation;

function getMyLocation(){
	if(navigator.geolocation){
		//alert("we get some location ~");
		navigator.geolocation.getCurrentPosition(displayLocation);
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