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
  var U = qtools.zero(N)

  for (var i = 0; i < eigenvalues.length; i++) {
    var c = numeric.t([0], [-t]).mul(eigenvalues[i]).exp().get([0])
    U = U.add(eigenprojectors[i].mul(c))
  }

  return U
}

qtools.zero = function(N) {
  return numeric.t(numeric.rep([N, N], 0), numeric.rep([N, N], 0))
}

qtools.real = function(A) {
  var N = numeric.dim(A)[0]
  return numeric.t(A, numeric.rep([N, N], 0))
}


// Computes the spectral decomposition of a matrix A
//
// params:
//  A (Matrix): input matrix
//
// returns: list of eigenvalues of A and a list of
//   corresponding eigenprojectors
//
qtools.specdecomp = function(A) {
  var eig = qtools.eig(A)
  var eigenvalues = []
  var eigenprojectors = []
  for (var i = 0; i < numeric.dim(A)[0]; i++) {
    var found = false
    for (var j = 0; j < eigenvalues.length; j++) {
      if (eig[0][i].sub(eigenvalues[j]).abs().x[0] < 0.0001) {
        var v = eig[1].getRows(i, i).transjugate()
        eigenprojectors[j] = eigenprojectors[j].add(v.dot(v.transjugate()))
        found = true
      }
    }
    if (!found) {
      eigenvalues.push(eig[0][i])
      var v = eig[1].getRows(i, i).transjugate()
      eigenprojectors.push(v.dot(v.transjugate()))
    }
  }
  return [eigenvalues, eigenprojectors]
}

qtools.eig = function(A) {
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

   if (oPar.outEr !== -1) {
     throw new Error('Eigenvector computation failed.')
   }

  var eigenvalues = new Array(N)
  var hasComplex = false
  for (var i = 0; i < N; i++) {
    eigenvalues[i] = numeric.t([wr[i]], [wi[i]])
    if (wi[i] > 0) {
      hasComplex = true
    }
  }

  if (!hasComplex) {
    var re = numeric.rep([N, N], 0)
    for (var row = 0; row < N; row++) {
      for (var col = 0; col < N; col++) {
        re[row][col] = B[row][col]
      }
    }
    B = qtools.real(re)
  } else {
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

  return [eigenvalues, B]
}

qtools.norm = function(A) {
  eig = qtools.eig(A.transjugate().dot(A).x)
  return Math.max.apply(null, eig[0].map(function(c) {return c.x[0]}))
}

// Verifier: Checks if the eigenprojectors of a matrix
//  sums to identity
//
// params:
//  A (Matrix): Input matrix (must be square)
//  eigenprojectors (list): Eigenprojectors of the matrix A
//
// return:
//  Matrix 2-norm of the Z - identity
//
qtools.testBasis = function(N, eigenprojectors) {
  var Z = eigenprojectors.reduce(function(acc, cur) {
    return acc.add(cur)
  }, qtools.zero(N))
  return qtools.norm(qtools.real(numeric.identity(N)).sub(Z))
}

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
  var N = numeric.dim(A)[0]
  if (eigenvalues.length !== eigenprojectors.length) {
    throw new Error('Eigenvalue and eigenvector lists must have same length.')
  }
  var Z = qtools.zero(N)
  for (var i = 0; i < eigenvalues.length; i++) {
    Z = Z.add(eigenvalues[i].get([0]).mul(eigenprojectors[i]))
  }
  return qtools.norm(Z.sub(qtools.real(A)))
}

// Prints debug info to console to verify that the spectral decomposition of a
// square matrix was computed correctly
//
// params:
// A (Square Matrix): Input matrix
// B (list): Spectral decomposition of A (B[0] has eigenvalues and
//           B[1] has the eigenprojectors)
//
qtools.verify = function(A, B, verbose) {
  if (verbose) {
    console.log('A =', numeric.prettyPrint(A))
    console.log('Eigenvalues =', numeric.prettyPrint(B[0]))
    console.log('Eigenprojectors =', numeric.prettyPrint(B[1]))
  }
  var error = qtools.testBasis(numeric.dim(A)[0], B[1])
  console.log('||I - SUM Eigenprojectors||_2 <=', error)
  error = qtools.testDecomp(A, B[0], B[1])
  console.log('||A - SUM Eigenvalue * Eigenprojector||_2 <=', error)
}
