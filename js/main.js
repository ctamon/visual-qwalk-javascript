//Main graph object
var cy

String.prototype.format = function() {
    var formatted = this
    for( var arg in arguments ) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg])
    }
    return formatted
}

function main() {
  //Init main graph object
  console.log('Initializing cytoscape')
  cy = cytoscape({
    container: document.getElementById('hook'),

    style: [
      {
        selector: 'node',
        style: {
          shape: 'ellipse',
          width: 20,
          height: 20,
          'label': 'data(prob)',
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
        srcNode = evt.cyTarget.id()
        graphState = addEdgeState_SecondClick
      } else if (graphState === addEdgeState_SecondClick) {
        qmanip.addEdge(srcNode, evt.cyTarget.id())
        graphState = neutralState
      } else if (graphState === deleteNodeState) {
        cy.remove(evt.cyTarget)
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

  // Generate initial graph
  for (var i = 0; i < 3; i++) {
    qmanip.addNode()
  }
  qmanip.addEdge('n0', 'n1')
  qmanip.addEdge('n1', 'n2')
  // compute placements
  cy.layout({name: 'circle', radius: 100, padding: 100})
  qmanip.setStartNode('n0')

  // Run tests on backend code
  qtools.testAll(true)
}
