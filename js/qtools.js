// ***** Issues *****
// Using the numericjs frameworks
// documentation website for numericjs lib is down
// methods may be called improperly

var qtools = {};

// Run the quantum walk simulation on the adjacency
// matrix at a particular time
//
// using: exp(-jtA)
//
// params:
//	A: Adjacency matrix of graph G
//	t: the time that the matrix is resolved at
//
// returns (Matrix): the resolved matrix
//
qtools.qwalk = function(A, t) {
	var B = speedcomp(A);
	var eigenvalues = B[0];
	var eigenprojectors = B[1];

	var size = math.size(A);
	var num_rows = size[0];
	var num_cols = size[1];

	var U = math.zeros(num_rows, num_cold)

	var negImg = new Complex(0, -1); // -1j

	for (var i = 0; i < eigenvalues.length; i++) {
		U += math.exp(negImg * new Complex(t * eigenvalues[i])) * eigenprojectors[i];
	}

	return U;
};


// Computes the spectral decomposition of a matrix A
//
// params:
//	A: input matrix
//
// returns: list of eigenvalues of A and a list of
// 	corresponding eigenprojectors
//
qtools.speedcomp = function(A) {

}


// Verifier: Checks if the eigenprojectors of a matrix
//	sums to identity
//
// params:
//	A (Matrix): Input matrix
//	eigenprojectors (list): Eigenprojectors of the matrix A
//
// return:
//	Matrix 2-norm of the Z - identity
//
qtools.testBias = function(A, eigenprojectors) {

}

// Verifier: Checks if A = sum_{i} Eigenvalue[i] * EigenProjector[i]
//
// params:
//	A (Matrix): Input matrix
//	eigenvalues: Eigenvalues of the matrix A
//	eigenprojectors: Eigenprojectors of the Matrix A
//
// return:
//	Matrix 2-norm of Z-A
//
qtools.testDecomp = function(A, eigenvalues, eigenprojectors) {

}