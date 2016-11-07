
//Main graph object
var cy;

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
					'label': function(ele){ return ((ele.data('isStart') === true) ? '*' : '');},
					'background-color': function(ele){return ele.data('bg')}
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
					qmanip.addEdgeByIds(source_node, evt.cyTarget.id())
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
}
