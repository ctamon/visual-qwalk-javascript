
qwalk = {};


qwalk.ani = null;

qwalk.curIdTable = null; //A list of all node ids that exist now
qwalk.mat = null;

function valToColor(value) {
	if(value < 0 || value > 1) return '#000000'

	var c = Math.floor(value * 255)

	if(c < 16) return '#0' + c.toString(16) + '0000'
	else return '#' + c.toString(16) + '0000'
}


qwalk.init = function(A) {
	var shape = math.size(A)
	var num_rows = shape[0], num_cols = shape[1]
	if (num_rows != num_cols) {
		throw new Error('A must be a square matrix')
	}

	graph.place_graph(graph.matrixToList(A))
	qwalk.curTime = 0
	qwalk.deltaTime = 0.01
	qwalk.mat = A
}

qwalk.step = function() {
	var U = qtools.qwalk(numeric.clone(qwalk.mat), qwalk.curTime)
	for (var i = 0; i < numeric.dim(qwalk.mat)[0]; i++) {
		var ampl = U.getBlock([i, 0], [i, 0])
		//console.log(numeric.prettyPrint(ampl))
		var prob = ampl.mul(ampl.conj()).x[0]
		cy.$('#n' + i.toString()).data('bg', valToColor(prob))
	}
	qwalk.curTime += qwalk.deltaTime
}

qwalk.start = function()
{


	//Make id table
	curIdTable = [];
	var i;
	var startIndex = -1;
	for(i=0 ; i<cy.length ; ++i)
	{
		curIdTable[i] = cy.nodes()[i].id();
		cy.nodes()[i].data('tableId',i);
		if(cy.nodes()[i].isStart == true)
			startIndex = i;
	}

	//We need a startIndex
	if(startIndex == -1) return;


	//Build adjacency matrix
	mat = [];
	var j;
	for(i=0 ; i<cy.length ; ++i)
	{
		for(j = 0 ; j < cy.length ; ++j)
		{

			mat[i][j] = (cy.nodes()[i].edgesWith(cy.nodes()[j]).length != 0) ? 1 : 0;

		}
	}


	//Make ampl and prob
	ampl = new Array(cy.length);
	prob = new Array(cy.length);
	ampl[startIndex] = 1;
	prob[startIndex] = 1;


	//Set time
	qwalk.curTime = 0;


	//The loop
	qwalk.loop();

}


qwalk.loop = function()
{

	ani = cy.animation({

		complete: function(){

			qwalk.step();

			qwalk.loop();

		},

		duration: 17

	});


	ani.play();

}
