
qmanip = {};

qmanip.nodeCounter = 0;


qmanip.nodeIdTable = [];

qmanip.compareNodeIds= function(id1,id2)
{
	var idNum1 = parseInt(id1.slice(1),10);
	var idNum2 = parseInt(id2.slice(1),10);
	
	return idNum1-idNum2;
	
}

//Accepts an id and returns the node
qmanip.getNode = function(id1)
{
	return cy.getElementById(id1);
}

//Accepts two node ids and returns the collection of edges between them
qmanip.getEdges = function(id1,id2){
	return cy.getElementById(id1).edgesWith(cy.getElementById(id2));
};

qmanip.nextNodeId = function()
{
	++qmanip.nodeCounter;
	return "n"+qmanip.nodeCounter;
}

qmanip.newIdTable = function(){
	qmanip.nodeIdTable = [];
}

qmanip.addNodeIdToIdTable = function(id)
{
	qmanip.nodeIdTable.push(id);
	qmanip.nodeIdTable.sort(qmanip.compareNodeIds);
}

qmanip.deleteNodeIdFromIdTable = function(idToDelete)
{	
	
	//Update id table
	var tmpIdTable = [];
	for(var i =0 ; i < qmanip.nodeIdTable.length ; ++i)
	{
		if(qmanip.nodeIdTable[i] !== idToDelete)
			tmpIdTable.push(qmanip.nodeIdTable[i]);
	}
	
	qmanip.nodeIdTable = tmpIdTable;
}

qmanip.addNode = function()
{
	
	qmanip.addNodeWithId(qmanip.nextNodeId());
		
}

qmanip.addNodeWithId = function(nodeId)
{
	cy.add({
		data:{id:nodeId,bg:'#000000'}
	});
	
	qmanip.addNodeIdToIdTable(nodeId);
}

qmanip.addNodeWithPosition = function(posx,posy){

	var nodeId = qmanip.nextNodeId();
	
	cy.add({

		data:{id:nodeId,bg:'#000000'},
		position: {x:posx,y:posy},
		
	});
	
	qmanip.addNodeIdToIdTable(nodeId);

};

qmanip.addEdge = function(n1,n2)
{
	return qmanip.addEdgeByIds(n1.data('id'),n2.data('id'));
}

qmanip.addEdgeByIds = function(id1,id2)
{

	if( qmanip.getEdges(id1,id2).length == 0 )
	{

		cy.add({

			data:{
				id: "e"+id1+"-"+id2,
				source: id1,
				target: id2
			}

		});

	}
	else return -1;

};

qmanip.deleteNode = function(n)
{

	cy.remove(n);

	qmanip.deleteNodeIdFromIdTable(n.id());
	
};

qmanip.deleteEdge = function(e)
{

	cy.remove(e);
	
};
