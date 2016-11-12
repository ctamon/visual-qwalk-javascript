qwalk = {}

qwalk.path = undefined
qwalk.mat = undefined
qwalk.spectralDecomposition = undefined
qwalk.deltaTime = 0.01
qwalk.walkStartIndex = -1;
qwalk.timer = undefined
qwalk.animationStatus = {isStopped:true,isRunning:false};

function valToRed(value) {
	if(value < 0 || value > 1) return '#00';

	var c = Math.floor(value * 255);

	if(c < 16) return '#0' + c.toString(16);
	else return '#' + c.toString(16);
};

function setColor(n,value)
{
	//var isStartComponent = ( n.data('isStart')===true ? '55' : '00');
	
	//n.data('bg',valToRed(value)+'00'+isStartComponent);

	n.data('bg',valToRed(value)+'0000');
}



qwalk.startFromGraph = function()
{

	//Make walkIdTable
	qwalk.walkIdTable = new Array(cy.nodes().length);
	for(var i=0 ; i<cy.nodes().length ; ++i)
		qwalk.walkIdTable[i] = cy.nodes()[i].id();
	var startIndex = -1;
	
	var numOfNodes = qwalk.walkIdTable.length;
	
	for(var i=0 ; i<numOfNodes ; ++i)
	{
		if(qmanip.getNode(qwalk.walkIdTable[i]).data('isStart') === true)
			startIndex = i;
	}

	//We need a startIndex
	if(startIndex == -1) 
	{
		throw new Error('No start position specified');
	}
		
	qwalk.walkStartIndex = startIndex;

	//Build adjacency matrix
	qwalk.mat = numeric.rep([numOfNodes,numOfNodes],-1);
	for(var j = 0 ; j < numOfNodes ; ++j)
	{		
		for(var k=0; k < numOfNodes ; ++k)
		{
			qwalk.mat[j][k] = ((qmanip.getEdges(qwalk.walkIdTable[j],qwalk.walkIdTable[k]).length != 0) ? 1 : 0);
		}
	}

	
	//Make ampl and prob
	//ampl = new Array(cy.length);
	//prob = new Array(cy.length);
	//ampl[startIndex] = 1;
	//prob[startIndex] = 1;




	//Set the animation status's flags appropriately
	qwalk.setAnimationStatusToStartFlags();
	// Set time
	qwalk.curTime = 0
	// Compute and cache the spectral decomposition
	qwalk.spectralDecomposition = qtools.specdecomp(numeric.clone(qwalk.mat))
	// Run qwalk
	qwalk.timer = setInterval(qwalk.loop, 25)

};

qwalk.setAnimationStatusToStartFlags = function()
{
	qwalk.animationStatus.isStopped = false;
	qwalk.animationStatus.isRunning = true;
}

qwalk.stop = function()
{
	
		qwalk.animationStatus.isStopped = true;
	
		clearInterval(qwalk.timer);
	
		cy.nodes().data('bg','#000000');
	
		qwalk.curTime = 0;

}

function valToColor(value) {
  if(value < 0 || value > 1) return '#000000'
  var c = Math.floor(value * 255)
  if(c < 16) return '#0' + c.toString(16) + '0000'
  else return '#' + c.toString(16) + '0000'
}

qwalk.loop = function() {
  var numOfNodes = cy.nodes().length;
  var startIndex = qwalk.walkStartIndex;
  var U = qtools.qwalk(qwalk.spectralDecomposition, numOfNodes, qwalk.curTime)
  for (var i = 0; i < numOfNodes; i++) {
    // The amplitude is given by the first column of U
    var ampl = numeric.t(U.x[i][startIndex],U.y[i][startIndex]);
    var prob = ampl.mul(ampl.conj()).x;
    cy.nodes()[i].data('bg', valToColor(prob))
  }
  qwalk.curTime += qwalk.deltaTime
}

