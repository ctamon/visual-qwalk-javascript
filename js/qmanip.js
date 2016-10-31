
qmanip = {};

qmanip.nodeCounter = 0;

qmanip.getNode = function(id1)
{
	return cy.getElementById(id1);
}

qmanip.getEdges = function(id1,id2){
	return cy.getElementById(id1).edgesWith(cy.getElementById(id2));
};

qmanip.addNode = function(posx,posy){

	qmanip.nodeCounter++;

	cy.add({

		data:{id: 'n'+qmanip.nodeCounter,bg:'#000000'},
		position: {x:posx,y:posy},
		
	});

};

qmanip.addEdge = function(id1,id2)
{

	if( qmanip.getEdges(id1,id2).length == 0 )
	{

		cy.add({

			data:{
				id: 'e'+id1+'-'+id2,
				source: id1,
				target: id2
			}

		});

	}

};

qmanip.deleteNode = function(n)
{

	cy.remove(n);

};

qmanip.deleteEdge = function(e)
{

	cy.remove(e);

};
