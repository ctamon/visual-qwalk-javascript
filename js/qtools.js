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
//  A: Adjacency matrix of graph G
//  t: the time that the matrix is resolved at
//
// returns (Matrix): the resolved matrix
//
qtools.qwalk = function(B, N, t) {
  var eigenvalues = B[0]
  var eigenprojectors = B[1]

  var U = numeric.t(numeric.rep([N, N], 0), numeric.rep([N, N], 0))

  for (var i = 0; i < eigenvalues.length; i++) {
    var c = numeric.t([0], [-t]).mul(eigenvalues[i]).exp().get([0])
    U = U.add(eigenprojectors[i].mul(c))
  }

  return U;
};


// Computes the spectral decomposition of a matrix A
//
// params:
//  A (Matrix): input matrix
//
// returns: list of eigenvalues of A and a list of
//   corresponding eigenprojectors
//
qtools.specdecomp = function(A) {
  var N = numeric.dim(A)[0]
  var B = numeric.rep([N, 2*N], 0)
  var wr = numeric.rep(N, 0)
  var wi = numeric.rep(N, 0)
  var oPar = new Object()
  oPar.outEr = 0  // error code

  calcEigSysReal(N, A, B, wr, wi, oPar)

  /* At this point, the eigenvalues and eigenvectors of A have been computed.
   * The real components of the eigenvalues are in wr, the imaginary components
   * are in wi, the associated eigenvectors are in the B matrix, and oPar.outEr
   * contains the error code. */

   if (oPar.outEr != -1) {
     throw new Error('Eigenvector computation failed.')
   }

  var eigenvalue_list = new Array(N)
  var hasComplex = false
  for (var i = 0; i < N; i++) {
    eigenvalue_list[i] = numeric.t([wr[i]], [wi[i]])
    if (wi[i] > 0) {hasComplex = true}
  }


  if (!hasComplex) {
    var re = numeric.rep([N, N], 0)
    for (var row = 0; row < N; row++) {
      for (var col = 0; col < N; col++) {
        re[row][col] = B[row][col]
      }
    }
    B = numeric.t(re, numeric.rep([N, N], 0))
  }
  else {
    var re = numeric.rep([N, N], 0)
    var im = numeric.rep([N, N], 0)
    for (var row = 0; row < N; row++) {
      for (var col = 0; col < 2*N; col += 2) {
        re[row][col] = B[row][col]
        im[row][col] = B[row][col+1]
      }
    }
    B = numeric.t(re, im)
  }
  var eigenvalues = []
  var eigenprojectors = []
  for (var i = 0; i < N; i++) {
    var found = false
    for (var j = 0; j < eigenvalues.length; j++) {
      if (eigenvalue_list[i].sub(eigenvalues[j]).abs().x[0] < 0.0001) {
        var v = B.getRows(i, i).transjugate()
        eigenprojectors[j] = eigenprojectors[j].add(v.dot(v.transjugate()))
        found = true
      }
    }
    if (!found) {
      eigenvalues.push(eigenvalue_list[i])
      var v = B.getRows(i, i).transjugate()
      eigenprojectors.push(v.dot(v.transjugate()))
    }
  }
  return [eigenvalues, eigenprojectors]
};


// Verifier: Checks if the eigenprojectors of a matrix
//  sums to identity
//
// params:
//  A (Matrix): Input matrix
//  eigenprojectors (list): Eigenprojectors of the matrix A
//
// return:
//  Matrix 2-norm of the Z - identity
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
//  A (Matrix): Input matrix
//  eigenvalues (list): Eigenvalues of the matrix A
//  eigenprojectors (list): Eigenprojectors of the Matrix A
//
// return:
//  Matrix 2-norm of Z-A
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
