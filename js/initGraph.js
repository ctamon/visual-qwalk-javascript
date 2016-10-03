


function initGraph()
{

	//We make a initial graph

	
	//Nodes


	cy.add({

		data:{

			id: 'node1'

		}

	});

	cy.add({

		data:{

			id: 'node2'

		}

	});

	cy.add({

		data:{

			id: 'node3'

		}

	});

	cy.getElementById('node1').data('isStart',true);


	//Edges

	cy.add({

		data:{

			id: 'edge12',
			source: 'node1',
			target: 'node2'

		}

	});


	cy.add({

		data:{

			id: 'edge23',
			source: 'node2',
			target: 'node3'

		}

	});

	cy.add({

		data:{

			id: 'edge31',
			source: 'node3',
			target: 'node1'

		}

	});


	//For now, we will lay it out in a circle
	cy.layout({
		name: 'circle'
	});

}
