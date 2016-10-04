


function initGraph()
{

	//We make a initial graph

	
	//Nodes


	cy.add([
            {group: "nodes",
		data:{id: 'node1'},
                position: { x: 100, y: 100}
            }   
        ]);

	cy.add([
            {group: "nodes",
		data:{id: 'node2'},
                position: { x: 200, y:100}
	}
    ]);

	cy.add([
            {group: "nodes",
		data:{id: 'node3'},
                position: { x: 300, y:100}
	}
    ]);

	cy.getElementById('node1').data('isStart',true);


	//Edges

	cy.add([
            {group: "edges",
		data:{
			id: 'edge12',
			source: 'node1',
			target: 'node2'
                    }
            }
        ]);


	cy.add([
            {group: "edges",
		data:{
			id: 'edge23',
			source: 'node2',
			target: 'node3'
                    }
            }
        ]);

	cy.add([
            {group: "edges",
		data:{
			id: 'edge31',
			source: 'node3',
			target: 'node1'
                    }
            }
        ]);


	//For now, we will lay it out in a circle
	//cy.layout({
	//	name: 'circle'
	//});

}
