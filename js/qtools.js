var qtools = {}
qtools.tolerance = 0.5e-15  // represents 15 significant decimal places

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
qtools.qwalk = function(eigenvalues, eigenprojectors, N, t) {
  var U = numeric.t(numeric.rep([N, N], 0), numeric.rep([N, N], 0))

  for (var i = 0; i < eigenvalues.length; i++) {
    var c = numeric.t([0], [-t]).mul(eigenvalues[i]).exp().get([0])
    U = U.add(eigenprojectors[i].mul(c))
  }

  return U
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

  for (var i = 0; i < A.length; i++) {
    var found = false
    for (var j = 0; j < eigenvalues.length; j++) {
      if (Math.abs(eig[0][1] - eigenvalues[i]) < 0.0001) {
        var v = numeric.getBlock(eig[1], [0, i], [eig[1].length - 1, i])
        numeric.addeq(eigenprojectors[j], numeric.dot(v, numeric.transpose(v)))
        found = true
      }
    }
    if (!found) {
      eigenvalues.push(eig[0][i])
      var v = numeric.getBlock(eig[1], [0, i], [eig[1].length - 1, i])
      eigenprojectors.push(numeric.dot(v, numeric.transpose(v)))
    }
  }
  return [eigenvalues, eigenprojectors.map(qtools.correct)]
}

qtools.eig = function(A) {
  var N = A.length
  var B = numeric.rep([N, 2*N], 0)
  var wr = numeric.rep(N, 0)
  var wi = numeric.rep(N, 0)
  var oPar = {outEr: 0}  // error code

  calcEigSysReal(N, numeric.clone(A), B, wr, wi, oPar)

  /* At this point, the eigenvalues and eigenvectors of A have been computed.
   * The real components of the eigenvalues are in wr, the imaginary components
   * are in wi, the associated eigenvectors are in the B matrix, and oPar.outEr
   * contains the error code. */

  if (oPar.outEr !== -1) {
    throw new Error('Eigenvector computation failed.')
  }

  // Since the adjacency matrix is always real and symmetric, the eigenvalues
  // should always be real
  if (numeric.any(wi.map(function (x) {return x > 0}))) {
    var msg = 'Real symmetric matrix should always have real eigenvalues'
    throw new Error(msg)
  }

  var eigenvalues = wr.map(function (x) {
    return Math.abs(x) < qtools.tolerance ? 0 : x
  })
  var eigenvectors = numeric.getBlock(B, [0,0], [N-1, N-1])
  return [eigenvalues, qtools.correct(qtools.MGS(eigenvectors))]
}

qtools.norm = function(A) {
  var eig = qtools.eig(numeric.dot(A, numeric.transpose(A)))
  return Math.sqrt(Math.max.apply(null, eig[0]))
}

qtools.MGS = function(V) {
  var N = V.length
  var getV = function(A, i) {return numeric.getBlock(A, [0,i], [N-1,i])}
  var setV = function(A, i, v) {numeric.setBlock(A, [0,i], [N-1,i], v)}
  var T = numeric.transpose, dot = numeric.dot, mul = numeric.mul
  var U = numeric.rep([N, N], 0)
  var v0 = getV(V, 0)
  setV(U, 0, numeric.div(v0, numeric.norm2(T(v0)[0])))
  for (var i = 1; i < N; i++) {
    setV(U, i, getV(V, i))
    for (var j = 0; j < i; j++) {
      var ui = getV(U, i)
      var uj = getV(U, j)
      setV(U, i, numeric.sub(ui, mul(dot(T(ui), uj)[0][0], uj)))
    }
    var ui = getV(U, i)
    setV(U, i, numeric.div(ui, numeric.norm2(T(ui)[0])))
  }
  return U
}

qtools.correct = function(A) {
  for (var i = 0; i < A.length; i++) {
    for (var j = 0; j < A.length; j++) {
      if (Math.abs(A[i][j]) < qtools.tolerance) {
        A[i][j] = 0
      }
    }
  }
  return A
}

/******************/
/* Test functions */
/******************/

qtools.testMGS = function(verbose) {
  console.log('Test Modified Gram-Schmidt')
  var A = [[3,2],[1,2]]
  if (verbose) {
    console.log('A =\n%s', numeric.prettyPrint(A))
  }
  var pass = qtools.isOrthogonal(qtools.MGS(A))
  console.log(pass ? 'Passed' : 'Failed')
  return pass
}

qtools.isOrthogonal = function(A) {
  var dot = numeric.dot, T = numeric.transpose, I = numeric.identity
  var diff = qtools.correct(numeric.sub(dot(A, T(A)), I(A.length)))
  return numeric.all(numeric.eq(diff, numeric.rep([A.length, A.length], 0)))
}

// Test for qtools.eig
qtools.testEig = function(A, verbose) {
  console.log('Test qtools.eig()')
  var T = numeric.transpose, sub = numeric.sub, norm2 = numeric.norm2
  var eig = qtools.eig(A)
  if (verbose) {
    console.log('A =\n%s', numeric.prettyPrint(A))
  }
  var N = A.length
  for (var i = 0; i < N; i++) {
    var v = numeric.getBlock(eig[1], [0, i], [N-1, i])
    var error = norm2(T(sub(numeric.dot(A, v), numeric.mul(eig[0][i], v))))
    if (verbose) {
      console.log('Eigenvalue =', eig[0][i])
      console.log('Eigenvector = %s', numeric.prettyPrint(T(v)[0]))
      console.log('Error =', error)
    }
    if (error > qtools.tolerance) {
      console.log('Failed')
      return false
    }
  }
  console.log('Passed')
  return true
}

// Test for qtools.norm
qtools.testNorm = function() {
  console.log('Test qtools.norm():')
  var A = [[2,0,1],[-1,1,0],[-3,3,0]]
  var r = Math.sqrt((Math.sqrt(385)+25)/2)  // true value of ||A||_2
  var pass = Math.abs(qtools.norm(A) - r) < qtools.tolerance
  console.log(pass ? 'Passed' : 'Failed')
  return pass
}

// Run all tests
qtools.testAll = function(verbose) {
  // First round of tests.
  // MGS() is tested first since eig() depends on it.
  if (!qtools.testMGS(verbose)) return
  var A = [[0,1,0],[1,0,1],[0,1,0]]
  if (!qtools.testEig(A, verbose)) return
  // norm() is tested before specdecomp() because
  // qtools.testSpectralDecomposition() depends on norm().
  if (!qtools.testNorm()) return
  var eig = qtools.specdecomp(A)
  if (!qtools.testSpectralDecomposition(A, eig, verbose)) return

  // Double check eig() and specdecomp()
  A = [[0,1,0,0],[1,0,1,1],[0,1,0,0],[0,1,0,0]]
  if (!qtools.testEig(A, verbose)) return
  var eig = qtools.specdecomp(A)
  if (!qtools.testSpectralDecomposition(A, eig, verbose)) return

  // Triple check
  A = [[0,1,0,1],[1,1,0,1],[0,0,0,1],[1,1,1,1]]
  if (!qtools.testEig(A, verbose)) return
  var eig = qtools.specdecomp(A)
  if (!qtools.testSpectralDecomposition(A, eig, verbose)) return
  console.log('All tests passed')
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
  console.log('qtools.testBasis():')
  var Z = eigenprojectors.reduce(function(acc, cur) {
    return numeric.add(acc, cur)
  }, numeric.rep([N, N], 0))
  var error = qtools.norm(qtools.correct(numeric.sub(numeric.identity(N), Z)))
  var pass = error < qtools.tolerance
  console.log(pass ? 'Passed' : 'Failed')
  return pass
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
  console.log('qtools.testDecomp():')
  var Z = numeric.rep([A.length, A.length], 0)
  for (var i = 0; i < eigenvalues.length; i++) {
    numeric.addeq(Z, numeric.mul(eigenvalues[i], eigenprojectors[i]))
  }
  var pass = qtools.norm(qtools.correct(numeric.sub(A, Z))) < qtools.tolerance
  console.log(pass ? 'Passed' : 'Failed')
  return pass
}


qtools.testSpectralDecomposition = function(A, B, verbose) {
  if (verbose) {
    console.log('Eigenvalues =', numeric.prettyPrint(B[0]))
    console.log('Eigenprojectors =')
    for (var i = 0; i < B[1].length; i++) {
      console.log(numeric.prettyPrint(B[1][i]), '\n')
    }
  }
  return qtools.testBasis(A.length, B[1]) && qtools.testDecomp(A, B[0], B[1])
}
