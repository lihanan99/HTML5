/**
 * 
 */

window.onload = function(){
	var url = "http://wickedlysmart.com/ifeelluckytoday";
	var request = new XMLHttpRequest();
	request.onload = function(){
		if(request.status==200){
			displayLuck(request.responseText);
		}		
	};	
	request.open("get", url);
	request.send(null);
}
function displayLuck(luck){
	var p = document.getElementById("luck");
	p.innerHTML = "today you are " + luck;
}