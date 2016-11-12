//Main graph object
var cy;
var startNodeColor = '#009acd'

function assert(condition, message) {
  if (!condition) {
    message = message || 'Assertion failed'
    if (typeof Error !== 'undefined') {
      throw new Error(message)
    }
    throw message  // Fallback
  }
}

String.prototype.format = function() {
    var formatted = this;
    for( var arg in arguments ) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg])
    }
    return formatted
}

function main() {
  //Init main graph object
  console.log('Initializing cytoscape.');
  cy = cytoscape({
    container: document.getElementById('hook'),

    style: [
      {
        selector: 'node',
        style: {
          shape: 'ellipse',
          width: 20,
          height: 20,
          'background-color': 'data(bg)',
          'border-color': '#000000',
          'border-width': 3
        }
      }
    ]
  })

  cy.on('tap', function(evt) {
    if (evt.cyTarget === cy) {
      if (graphState === addNodeState) {
        qmanip.addNodeWithPosition(evt.cyPosition.x, evt.cyPosition.y)
        graphState = neutralState
      }
    } else if (evt.cyTarget.isNode()) {
      if (graphState === addEdgeState_FirstClick) {
        source_node = evt.cyTarget.id()
        graphState = addEdgeState_SecondClick
      } else if (graphState === addEdgeState_SecondClick) {
        if (evt.cyTarget.id() !== source_node) {
          qmanip.addEdge(source_node, evt.cyTarget.id())
          graphState = neutralState
		}
      } else if (graphState === deleteNodeState) {
        qmanip.deleteNode(evt.cyTarget)
        graphState = neutralState
      } else if (graphState === setStartNodeState) {
        qmanip.setStartNode(evt.cyTarget)
        graphState = neutralState
      }
    } else if (evt.cyTarget.isEdge()) {
      if (graphState === deleteEdgeState) {
        cy.remove(evt.cyTarget)
        graphState = neutralState
      }
    }
  })

  //Create dummy graph and animate quantum walk
  var A = graph.pathGraph(3)
  graph.place_graph(graph.matrixToList(A));
  qmanip.setStartNode(qmanip.getNode('n0'));
  
  cy.layout({name: 'circle', radius: 100, padding: 100});


  // Generate initial graph
  //for (var i = 0; i < 3; i++) {
  //  qmanip.addNode()
  //}
  //qmanip.addEdge('n0', 'n1')
  //qmanip.addEdge('n1', 'n2')
  // compute placements
 
  //cy.$('#n0').style('border-color', startNodeColor)

}
