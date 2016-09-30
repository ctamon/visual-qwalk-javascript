
//Main graph object
var cy;



function main() {

//Init main graph object

cy = cytoscape({

	container: document.getElementById('hook'),

	style: cytoscape.stylesheet()
		.selector('node')
		.style({

			shape: 'circle',

			//TODO: Link color to data
			'background-color': function(ele){return valToColor(0);}

		})
		

});


//Create dummy graph
initGraph();

	
}

