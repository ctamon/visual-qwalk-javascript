graphState = 0
neutralState = 0
addNodeState = 1
deleteNodeState = 2
deleteEdgeState = 3
addEdgeState_FirstClick = 4
addEdgeState_SecondClick = 5

srcNode = undefined

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("SideNavBtn").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("SideNavBtn").style.marginLeft = "0";
}

function setGraphState(state) {
  graphState = state
}

function play() {
  if (document.getElementById("PlayButton").alt == "Play") {
    document.getElementById("PlayButton").alt = "Stop";
    document.getElementById("PlayButton").src = "StopButton.png";
    qwalk.startFromGraph()
  } else {
    document.getElementById("PlayButton").alt = "Play";
    document.getElementById("PlayButton").src = "PlayButton.png";
    clearInterval(qwalk.timer)
  }
}
