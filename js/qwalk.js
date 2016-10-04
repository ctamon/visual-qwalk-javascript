
qwalk = {};


qwalk.ani = null;

qwalk.curIdTable = null; //A list of all node ids that exist now
qwalk.ampl = null;
qwalk.prob = null;
qwalk.mat = null;

qwalk.curTime = 0;
qwalk.deltaTime = 0.01;


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



//The loop code
qwalk.step = function()
{

	//I will assume the matrix is in numeric complex vector form

	var U = qwalk(mat,curTime);
	var i;

	var ampl = new numeric.t(new Array(cy.length),new Array(cy.length))	
	var prob = new Array(cy.length);


	for(i=0;i<cy.length;++i)
		ampl[i] = numeric.t(U.x[i][0],U.y[i][0]); //ampl[i] = U[i][0]
	for(i=0;i<cy.length;++i)
		prob[i] = (numeric.t(ampl.x[i],ampl.y[i])*numeric.conj(ampl)[i]).x;

	for(i=0;i<cy.length;++i)
		cy.getElementById(curIdTable[i]).data('value',prob[i]);

	//TODO: Finish. Note that we need a good way to handle complex numbers

}
