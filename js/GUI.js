function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function addNode() {
    
}

function deleteNode() {
    
}

function addEdge() {
    
}

function deleteEdge() {
    
}

function play() {
	var element = document.getElementById("PlayButton");
	if (element.alt == "Play") {
		element.alt = "Stop";
		element.src = "StopButton.png";
    	//elmt.innerHTML = "Stop";
		//elmt.style.backgroundColor = 'red';
}	else {
		element.alt = "Play";
		element.src = "PlayButton.png";
    //elmt.innerHTML = "Play";
	//elmt.style.backgroundColor = 'green';
}
}