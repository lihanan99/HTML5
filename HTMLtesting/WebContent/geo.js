/**
This is a test for geolocation fucntion of the HTML feature

@auther Hannan Li
*/

window.onload=getMyLocation;

function getMyLocation(){
	if(navigator.geolocation){
		alert("we get some location ~");
	}else{
		alert("sth wrong with location");
	}
	
	
	
	
	
}