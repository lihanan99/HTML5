/**
 * playlist used to mimic the itune play list 
 */

window.onload=init;
function init(){
	var button=document.getElementById("addButton");
	button.onclick=handleButton;
}

function handleButton(){
	var textInput=document.getElementById("songTextInput");
	var songName=textInput.value;
	alert("songName");//Testing clicking button working correctly.
	
}