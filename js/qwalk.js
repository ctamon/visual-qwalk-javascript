qwalk = {}

qwalk.mat = undefined
qwalk.eigenvalues = undefined
qwalk.eigenprojectors = undefined
qwalk.deltaTime = 0.01
qwalk.startIndex = undefined
qwalk.timer = undefined

function valToColor(value) {
  if(value < 0 || value > 1) return '#000000'
  var c = Math.floor(value * 255)
  if(c < 16) return '#0' + c.toString(16) + '0000'
  else return '#' + c.toString(16) + '0000'
}

qwalk.startFromGraph = function() {
  // We need a startNode
  if (qwalk.startIndex === undefined) {
    throw new Error('No start position specified')
  }

  // Build adjacency matrix
  var N = cy.nodes().length
  qwalk.mat = numeric.rep([N, N], 0)
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      if (i == j) {
        continue
      }
      var edges = qmanip.getEdges(cy.nodes()[i].id(), cy.nodes()[j].id())
      qwalk.mat[i][j] = edges.length > 0 ? 1 : 0
    }
  }

  // Set time
  qwalk.curTime = 0
  // Compute and cache the spectral decomposition
  var B = qtools.specdecomp(qwalk.mat)
  qwalk.eigenvalues = B[0].map(function(x) {return numeric.t([x], [0])})
  qwalk.eigenprojectors = B[1].map(function(x) {
    return numeric.t(x, numeric.rep([N, N], 0))
  })
  // Verify that spectral decomposition was computed correctly
  qtools.testSpectralDecomposition(qwalk.mat, B, true)
  // Run qwalk
  qwalk.timer = setInterval(qwalk.loop, 25)
}

qwalk.loop = function() {
  var N = cy.nodes().length, t = qwalk.curTime
  var U = qtools.qwalk(qwalk.eigenvalues, qwalk.eigenprojectors, N, t)
  cy.nodes().forEach(function(node, i) {
    // The amplitude is given by the nth column of U,
    // where n = qwalk.startIndex
    var ampl = U.getBlock([i, qwalk.startIndex], [i, qwalk.startIndex])
    var prob = ampl.mul(ampl.conj()).x[0][0]
    node.data('bg', valToColor(prob))
    node.data('prob', Math.round(prob*100))
  })
  qwalk.curTime += qwalk.deltaTime
}
