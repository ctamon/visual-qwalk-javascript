

qwalkObj = {};


qwalkObj.ani = null;

qwalkObj.curIdTable = null; //A list of all node ids that exist now
qwalkObj.ampl = null;
qwalkObj.prob = null;
qwalkObj.mat = null;

qwalkObj.curTime = 0;
qwalkObj.deltaTime = 0.01;


qwalkObj.qwalk_me = function()
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
	curTime = 0;


	//The loop
	ani = cy.animation({

		complete: function(){

			stepqw();

			ani.play();

		},

		duration: 1000*deltaTime

	});

	ani.play();

}



//The loop code
qwalk.stepqw = function()
{

	var U = qwalk(mat,curTime);
	var i;
	for(i=0;i<cy.length;++i)
		ampl[i] = U[i][0];
	for(i=0;i<cy.length;++i)
		prob[i] = ampl[i]*ampl.conj()[i];

	//TODO: Finish. Note that we need a good way to handle complex numbers

}
