
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
					shape: 'circle',
					'background-color': function(ele){return ele.data('bg')}
				}
			}
		]
	});

	//Create dummy graph and animate quantum walk

	var A = graph.pathGraph(3);
	qwalk.startFromMatrix(A,0);

	
};
