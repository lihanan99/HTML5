/**
This is a test for geolocation fucntion of the HTML feature


@auther Hannan Li

update 1:
Adding error message
uodate 2:
Adding google map to the HTML page
*/
var map;//global variable

window.onload=getMyLocation;

function getMyLocation(){
	if(navigator.geolocation){
		//alert("we get some location ~");
		navigator.geolocation.getCurrentPosition(displayLocation,displayErrorMsg);
		
	}else{
		alert("no geolocation suppoer for this browser ");
	}

}
function displayLocation(position){
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	var div= document.getElementById("showLocation");
	div.innerHTML="ur latitude is "+latitude+", and your longitude is "+longitude+" .";
	
	showMap(position.coords);
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

function showMap(coords){//show the google map on the page
	var title = "Your Location";
	var content = "HI~ You are here: " + coords.latitude + ", " + coords.longitude;
	var googleLatiAndLong= 
			new google.maps.LatLng(coords.latitude, coords.longitude);
	var mapOptions={
		zoom : 10,
		center : googleLatiAndLong,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var div=document.getElementById("map");
	map = new google.maps.Map(div,mapOptions);//shows the map to the selected <div> part.	
	addMarker(map, googleLatiAndLong, title, content);
}

//adding the marker to the map, with title and content when clicked on it. 
function addMarker(map, latlong,title,content){
	var markerOptions = {
			position : latlong,
			map : map,
			title : title ,
			clickable : true
			
	};
	var marker = new google.maps.Marker(markerOptions);
	var infoWindowOptions = {
			content : content,
			position : latlong			
	};
	var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
	
	google.maps.event.addListener(marker,"click",function(){
		infoWindow.open(map);
	});
	
	
	
}

