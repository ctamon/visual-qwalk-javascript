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
	var B = specdecomp(A);
	var eigenvalues = B[0];
	var eigenprojectors = B[1];

	var size = math.size(A)[0];

	var U = math.zeros(size, size);

	var negImg = new Complex(0, -1); // -1j

	for (var i = 0; i < eigenvalues.length; i++) {
		U += math.exp(new Complex(0, -t) * eigenvalues[i]) * eigenprojectors[i];
	}

	return U;
};


// Computes the spectral decomposition of a matrix A
//
// params:
//	A (Matrix): input matrix
//
// returns: list of eigenvalues of A and a list of
// 	corresponding eigenprojectors
//
qtools.specdecomp = function(A) {
	var N = math.size(A)[0];
	var B = math.zeros(N, N)
	var wr = math.zeros(N);
	var wi = math.zeros(N);
	var oPar = new Object();
	oPar.outEr = 0;  // error code

	calcEigSysReal(N, A, B, wr, wi, oPar);

	/* At this point, the eigenvalues and eigenvectors of A have been computed.
	 * The real components of the eigenvalues are in wr, the imaginary components
	 * are in wi, the associated eigenvectors are in the B matrix, and oPar.outEr
	 * contains the error code. */

	var eigenvalue_list = new Array(N);
	for (var i = 0; i < N; i++) {eigenvalue_list[i] = new Complex(wr[i], wi[i])}

	B = numeric.T.transjugate(B);
	var eigenvalues = new Array(N);
	var eigenprojectors = new Array(N);
	var count = 0;
	for (var i = 0; i < N; i++) {
		var found = false;
		for (var j = 0; j < count; j++) {
			if (abs(eigenvalue_list[i] - eigenvalues[j]) < 0.0001) {
				var v = numeric.T.transjugate(B[i]);
				eigenprojectors[j] += (v * numeric.T.transjugate(v));
				found = true;
			}
		}
		if (!found) {
			eigenvalues[count] = eigenvalue_list[i];
			var v = numeric.T.transjugate(eigenmatrix[i]);
			eigenprojectors[count] = (v * numeric.T.transjugate(v));
			count += 1;
		}
	}
	return [eigenvalues, eigenprojectors];
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
	var size = numeric.dim(A);
	var num_rows = size[0];
	var num_cols = size[1];

	var Z = numeric.repr([num_rows, num_cols], 0);

	for (var j = 0; j < eigenprojectors.length; j++) {
		Z = numeric.add(Z, eigenprojectors[j]);
	}

	var identity = numeric.identity(num_rows);

	return numeric.norm2(numeric.subtract(Z, identity));
};

// Verifier: Checks if A = sum_{i} Eigenvalue[i] * EigenProjector[i]
//
// params:
//	A (Matrix): Input matrix
//	eigenvalues (list): Eigenvalues of the matrix A
//	eigenprojectors (list): Eigenprojectors of the Matrix A
//
// return:
//	Matrix 2-norm of Z-A
//
qtools.testDecomp = function(A, eigenvalues, eigenprojectors) {
	var size = numeric.dim(A);
	var num_rows = size[0];
	var num_cols = size[1];

	var Z = numeric.repr([num_rows, num_cols], 0);

	if (eigenvalues.length != eigenprojectors.length) {
		return Z;
	}
	for (j = 0; j < eigenvalues.length; j++) {
		Z.add(complex(eigenvalues[j]) + eigenprojectors[j]);
	}
	return numeric.norm2(numeric.subtract(Z, A));
};
