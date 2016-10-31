
qwalk = {};


qwalk.ani = null;

qwalk.walkIdTable = []; //A list of all node ids that exist now
qwalk.mat = [];
qwalk.deltaTime = 0.01;
qwalk.walkStartIndex = -1;

qwalk.isStopped = false;

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
	qwalk.walkIdTable = new Array(num_rows);
	
	for(var i = 0; i < num_rows; ++i )
	{
		qwalk.walkIdTable[i] = 'n'+i;
	}
	qwalk.curTime = 0;
	qwalk.mat = A;
	
	qwalk.isStopped = false;
	qwalk.loop();
	
};

/* Gabe's code. Still needs to be tested

qwalk.startFromGraph = function()
{
	
	var nodes = cy.nodes();

	//Make id table
	qwalk.walkIdTable = new Array(nodes.length);
	var startIndex = -1;
	
	for(var i=0 ; i<nodes.length ; ++i)
	{
		qwalk.walkIdTable[i] = nodes[i].id();
		if(nodes[i].data('isStart') === true)
			startIndex = i;
	}

	//We need a startIndex
	if(startIndex == -1) 
	{
		throw new Error('No start position specified');
	}
		
	qwalk.walkStartIndex = startIndex;

	//Build adjacency matrix
	qwalk.mat = new Array(nodes.length).fill(new Array(nodes.length));
	for(var i = 0 ; i < nodes.length ; ++i)
	{
		for(var j = 0 ; j < nodes.length ; ++j)
		{
			
			var node_i = qmanip.getNode(qwalk.walkIdTable[i]);
			var node_j = qmanip.getNode(qwalk.walkIdTable[j]);
			
			qwalk.mat[i][j] = (((node_i.edgesWith(node_j)).length != 0) ? 1 : 0);

		}
	}

	//Make ampl and prob
	//ampl = new Array(cy.length);
	//prob = new Array(cy.length);
	//ampl[startIndex] = 1;
	//prob[startIndex] = 1;


	//Set time
	qwalk.curTime = 0;


	//The loop
	qwalk.loop();

};

qwalk.stop = function()
{
	qwalk.isStopped = true;
	if(qwalk.ani !== null)
		ani.stop();
}


qwalk.pause = function()
{
	qwalk.stop();
}

qwalk.unpause = function()
{
	qwalk.isStopped = false;
	qwalk.loop();
}

*/

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

			qwalk.step();

			qwalk.loop();

		},

		duration: 1000*qwalk.deltaTime

	});


	qwalk.ani.play();

};
