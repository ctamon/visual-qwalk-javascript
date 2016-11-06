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
  return "n"+qmanip.nodeCounter++
}

qmanip.addNode = function() {
  var nodeId = qmanip.nextNodeId()
  cy.add({data: {id: nodeId, bg: '#000000'}})
}

qmanip.addNodeWithPosition = function(posx,posy) {
  var nodeId = qmanip.nextNodeId()
  cy.add({data: {id: nodeId, bg: '#000000'}, position: {x: posx,y: posy}})
}

qmanip.addEdge = function(id1,id2) {
  if (qmanip.getEdges(id1,id2).length == 0 ) {
    cy.add({data: {id: "e"+id1+"-"+id2, source: id1, target: id2}})
  }
}
