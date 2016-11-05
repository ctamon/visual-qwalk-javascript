graphState = 0
neutralState = 0
addNodeState = 1
deleteNodeState = 2
deleteEdgeState = 3
addEdgeState_FirstClick = 4
addEdgeState_SecondClick = 5

souce_node = undefined

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    //document.getElementById("SideNavBtn")style..margin-left = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    //document.getElementById("SideNavBtn")style..margin-left = "0";
}

function setGraphState(state) {
  graphState = state
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
