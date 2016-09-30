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

	var size = numeric.dim(A);
	var num_rows = size[0];
	var num_cols = size[1];

	var U = numeric.repr([nun_rows, num_cols], 1);

	var negImg = new Complex(0, -1); // -1j

	for (var i = 0; i < eigenvalues.length; i++) {
		U += numeric.exp(negImg * new Complex(t * eigenvalues[i])) * eigenprojectors[i];
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
qtools.speedcomp = function(A) {
	var size = numeric.dim(A);
	var num_rows = size[0];
	var num_cols = size[1];

	var eig = numeric.eig(A);
	var eigenvalue_list = eig.lambda.x;
	var eigenmatrix = eig.E.transjugate.x;

	var eigenvalues = [];
	var eigenprojectors = [];
	for (var i = 0; i < num_rows; i++) {
		var found = false;
		for (var j = 0; j < eigenvalues.length; j++) {

			if (Math.abs(eigenvalue_list[i] - eigenvalues[j]) < 0.0) {
				var v = eigenmatrix[i].transjugate;
				eigenprojectors[j] += (numeric.mul(v.x, v.transjugate.x))
				found = true;
			}
		}

		if (!found) {
			eigenvalues.append(eigenvalue_list[i]);
			var v = eigenmatrix[i].transjugate;
			eigenprojectors.push(numeric.mult(v.x, v.transjugate.x));

		}
	}

	return [eigenvalues, eigenprojectors];
};


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