// ***** Missing ******
// draw_graph(graph)
// place_graph(graph)
// listToMatrix(G)

var graph = {};

// Turn the adjacency matrix to an adjacency list
//
// params:
//  A (Matrix): Adjacency Matrix
//
// return (List): Adjacency List
//
graph.matrixToList = function(A) {
  var size = numeric.dim(A);
  var numRows = size[0];
  var numCols = size[1];

  if (numRows != numCols) {
    throw new Error('A must be a square matrix');
  }

  var G = [];
  for (var i = 0; i < numRows; i++){
    for (var j = 0; j < numCols; j++) {
      if (A[i][j] != 0) {
        G.push([i,j]);
      }
    }
  }

  return G;
};

function getVertices(G) {
  var vertices = []
  for (var i = 0; i < G.length; i++) {
    if (vertices.indexOf(G[i][0]) == -1) {
      vertices.push(G[i][0])
    }
    if (vertices.indexOf(G[i][1]) == -1) {
      vertices.push(G[i][1])
    }
  }
  return vertices
};

// Turn the adjacency list to an adjacency matrix
//
// params:
//  G (List): Adjacency List
//
// return (Matrix): Adjacency Matrix
//
graph.listToMatrix = function(G) {
  var vertices = getVertices(G)
  var n = vertices.length
  var A = numeric.rep([n, n], 0)
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      if ([i, j] in G) {
        A[i][j] = 1
      }
    }
  }
  return A
};

graph.place_graph = function(graph) {
  nodes = getVertices(graph);

  // add nodes to graph
  for (var i = 0; i < nodes.length; i++) {
    qmanip.addNodeWithId('n'+i);
  }
  qmanip.nodeCounter = nodes.length;

  // add edges
  for (var i = 0; i < graph.length; i++) {
    source = 'n' + graph[i][0].toString();
    target = 'n' + graph[i][1].toString();
    qmanip.addEdge(source,target);
  }

  // compute placements
  cy.layout({name: 'circle'});
};

// Create a path graph
//
// params:
//   n: number of nodes
//
// returns (Matrix): the (n x x) adjacency matrix of a path graph
//
graph.pathGraph = function(n) {
  var A = numeric.rep([n, n], 0);

  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      if (Math.abs(i-j) == 1) {
        A[i][j] = 1.0;
      }
    }
  }

  return A;
};

// Create a cycle graph
//
// params:
//   n: number of nodes
//
// returns (Matrix): the (n x n) adjacency matrix of a cycle graph
//
graph.cycleGraph = function(n) {
  var A = numeric.rep([n, n], 0);

  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      // Used to be
      // pow(i-j,1,n) == 1
      if ((i-j) % n == 1) {
        A[i][j] = 1.0;
      }
    }
  }

  return A;
};

// Create a complete graph on n matricies
//
// params:
//   n: number of nodes
//
// returns (Matrix): the (n x x) adjacency matrix
//  for a complete graph
//
graph.completeGraph = function(n) {
  var A = numeric.rep([n, n], 0);

  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      if (i != j) {
        A[i][j] = 1.0;
      }
    }
  }

  return A;
};

// Create a complete oriented graph
//
// params:
//   n: number of nodes
//
// returns (Matrix): the (n x x) adjacency matric of
//   a complete oriented graph
//
graph.completeOrientedGraph = function(n) {
  var A = numeric.rep([n, n], 0);

  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      if (j == n-1 && i==0) {
        A[i][j] = new Complex(0, 1);
      } else if(j < i) {
        A[i][j] = new Complex(0, 1);
      } else if (i != j) {
        A[i][j] = new Complex(0, -1);
      }
    }
  }

  return A;
};
