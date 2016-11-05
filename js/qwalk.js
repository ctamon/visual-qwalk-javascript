
qwalk = {};


qwalk.ani = null;

qwalk.walkIdTable = []; //A list of all node ids that exist now
qwalk.mat = [];
qwalk.deltaTime = 0.01;
qwalk.walkStartIndex = -1;

qwalk.isStopped = false;
qwalk.animationStatus = {isStopped: true,isRunning: false};

function valToColor(value) {
	if(value < 0 || value > 1) return '#000000'

	var c = Math.floor(value * 255)

	if(c < 16) return '#0' + c.toString(16) + '0000'
	else return '#' + c.toString(16) + '0000'
};


qwalk.startFromMatrix = function(A,start) {
	var shape = numeric.dim(A);
	var num_rows = shape[0];
	var num_cols = shape[1];
	if (num_rows != num_cols) {
		throw new Error('A must be a square matrix');
	}

	graph.place_graph(graph.matrixToList(A));
	qmanip.getNode('n'+start).data('isStart',true);
	qwalk.walkStartIndex = start;
	qwalk.walkIdTable = qmanip.nodeIdTable;
	qwalk.curTime = 0;
	qwalk.mat = A;
	
	//Set the animation status's flags appropriately
	qwalk.setAnimationStatusToStartFlags();
	
	//Loop
	qwalk.loop();
	
};



qwalk.startFromGraph = function()
{

	//Get id table
	qwalk.walkIdTable = qmanip.nodeIdTable;
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


	//Set time
	qwalk.curTime = 0;


	//Set the animation status's flags appropriately
	qwalk.setAnimationStatusToStartFlags();
	
	//The loop
	qwalk.loop();

};

qwalk.setAnimationStatusToStartFlags = function()
{
	qwalk.animationStatus.isStopped = false;
	qwalk.animationStatus.isRunning = true;
}

qwalk.stop = function()
{
	
		qwalk.animationStatus.isStopped = true;
	
		qwalk.pause();
	
		cy.nodes().data('bg','#000000');
	
		qwalk.curTime = 0;
	
}

qwalk.pause = function()
{
	qwalk.animationStatus.isRunning = false;
	if(qwalk.ani !== null)
		qwalk.ani.stop();
}

qwalk.unpause = function()
{
	if(!qwalk.animationStatus.isStopped)
	{
		qwalk.animationStatus.isRunning = true;
		qwalk.loop();
	}
	else return -1;
}


qwalk.step = function() {
	var startIndex = qwalk.walkStartIndex;
	var U = qtools.qwalk(numeric.clone(qwalk.mat), qwalk.curTime)
	for (var i = 0; i < numeric.dim(qwalk.mat)[0]; i++) {
		var ampl = numeric.t(U.x[i][startIndex],U.y[i][startIndex]);//getBlock([i, qwalk.walkStartIndex], [i, qwalk.walkStartIndex])
		var prob = ampl.mul(ampl.conj()).x
		cy.nodes('#' + qwalk.walkIdTable[i]).data('bg', valToColor(prob))
	}
	qwalk.curTime += qwalk.deltaTime
};




qwalk.loop = function()
{

	qwalk.ani = cy.animation({

		complete: function(){
			if(qwalk.animationStatus.isRunning)
			{
				qwalk.step();
				qwalk.loop();
			}
		},

		duration: 1000*qwalk.deltaTime

	});


	qwalk.ani.play();

};
