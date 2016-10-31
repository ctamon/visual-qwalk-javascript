
//Main graph object
var cy;



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

