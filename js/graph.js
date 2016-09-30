// ***** Missing ******
// draw_graph(graph)
// place_graph(graph)

var graph = {};

// Turn the adjacency matrix to an adjacency list
//
// params:
//	A (Matrix): Adjacency Matrix
//
// return (List): Adjacency List
//
graph.matrixToList = function(A) {
	var size = numeric.dim(A);
	var numRows = size[0];
	var numCols = size[1];

	// ToDo: assert numRows == numCols

	var G = [];
	for (var i = 0; i < numRows; i++){
		for (var j = 0; j < numCols; j++) {
			if (A[i][j] != 0) {
				G.push([i,j]);
			}
		}
	}
};

// Turn the adjacency list to an adjacency matrix
//
// params:
//	G (List): Adjacency List
//
// return (Matrix): Adjacency Matrix
// 
graph.listToMatrix = function(G) {
	// ToDo
};

// Create a path graph
//
// params:
// 	n: number of nodes
//
// returns (Matrix): the (n x x) adjacency matrix of a path graph
//
graph.pathGraph = function(n) {
	var A = numeric.repr([n, n], 0);

	for (var i = 0; i < n; i++) {
		for (var j = 0; j < n; j++) {
			if (math.abs(i-j) == 1) {
				A[i][j] = 1.0;
			}
		}
	}

	return A;
};

// Create a cycle graph
//
// params:
// 	n: number of nodes
//
// returns (Matrix): the (n x n) adjacency matrix of a cycle graph
//
graph.cycleGraph = function(n) {
	var A = numeric.repr([n, n], 0);

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
// 	n: number of nodes
//
// returns (Matrix): the (n x x) adjacency matrix
//	for a complete graph
//
graph.completeGraph = function(n) {
	var A = numeric.repr([n, n], 0);

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
// 	n: number of nodes
//
// returns (Matrix): the (n x x) adjacency matric of
// 	a complete oriented graph
//
graph.pathGraph = function(n) {
	var A = numeric.repr([n, n], 0);

	for (var i = 0; i < n; i++) {
		for (var j = 0; j < n; j++) {
			if (q == n-1 && p==0) {
				A[i][j] = Complex(0, 1);
			} else if(i < j) {
				A[i][j] = Complex(0, 1);
			} else if (p != q) {
				A[i][j] = Comple(0, -1);
			}
		}
	}

	return A;
};