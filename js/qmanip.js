qmanip = {};

qmanip.nodeCounter = 0;

//Accepts an id and returns the node
qmanip.getNode = function(id1) {
  return cy.getElementById(id1);
}

//Accepts two node ids and returns the collection of edges between them
qmanip.getEdges = function(id1,id2) {
  return cy.getElementById(id1).edgesWith(cy.getElementById(id2))
}

qmanip.nextNodeId = function() {
  qmanip.nodeCounter++;
  return "n"+qmanip.nodeCounter;
}

qmanip.addNode = function() {
  var nodeId = qmanip.nextNodeId()
  cy.add({data: {id: nodeId, bg: '#000000'}})
}

qmanip.addNodeWithPosition = function(posx,posy) {
  var nodeId = qmanip.nextNodeId()
  cy.add({data: {id: nodeId, bg: '#000000'}, position: {x: posx,y: posy}})
}


qmanip.addNodeWithId = function(nodeId)
{
	cy.add({data:{id:nodeId,isStart:false,bg:'#000000'}});
}

qmanip.addEdge = function(id1,id2) {
  if (qmanip.getEdges(id1,id2).length == 0 ) {
    cy.add({data: {id: "e"+id1+"-"+id2, source: id1, target: id2}})
  }
}

qmanip.deleteNode = function(n)
{

	cy.remove(n);

};

qmanip.deleteEdge = function(e)
{

	cy.remove(e);

};

qmanip.setStartNode = function(n)
{
	//Set every node's isStart field to false
	cy.nodes().style('border-color','#000000');
	for(var i = 0 ; i<cy.nodes().length ; ++i)
		cy.nodes()[i].data('isStart',false);
	
	//Set n's isStart to true
	n.data('isStart',true);
	n.style('border-color','#009acd');
}


