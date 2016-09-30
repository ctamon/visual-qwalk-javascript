


function initGraph()
{

	//We make a initial graph

	
	//Nodes


	cy.add({

		data:{

			id: 'bagel1'

		}

	});

	cy.add({

		data:{

			id: 'bagel2'

		}

	});

	cy.add({

		data:{

			id: 'bagel3'

		}

	});


	//Edges

	cy.add({

		data:{

			id: 'casserole12',
			source: 'bagel1',
			target: 'bagel2'

		}

	});

	cy.add({

		data:{

			id: 'casserole23',
			source: 'bagel2',
			target: 'bagel3'

		}

	});

	cy.add({

		data:{

			id: 'casserole31',
			source: 'bagel3',
			target: 'bagel1'

		}

	});


	//For now, we will lay it out in a circle
	cy.layout({
		name: 'circle'
	});

}
