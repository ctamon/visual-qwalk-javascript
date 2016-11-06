qwalk = {}

qwalk.path = undefined
qwalk.mat = undefined
qwalk.spectralDecomposition = undefined
qwalk.deltaTime = 0.01
qwalk.startNode = 'n0'
qwalk.timer = undefined

function valToColor(value) {
  if(value < 0 || value > 1) return '#ffffff'
  var c = Math.floor(value * 255)
  if(c < 16) return '#0' + c.toString(16) + '0000'
  else return '#' + c.toString(16) + '0000'
}

qwalk.startFromGraph = function() {
  // We need a startNode
  if (qwalk.startNode === undefined) {
    throw new Error('No start position specified');
  }

  // Build quantum walk path using breadth first search.
  // Note: this will exclude unconnected nodes from the quantum walk
  qwalk.path = []
  var path = cy.elements().bfs({root: '#'+qwalk.startNode}).path
  for (var i = 0; i < path.length; i += 2) {
    qwalk.path.push(path[i].id())
  }

  //Build adjacency matrix
  var numOfNodes = qwalk.path.length
  qwalk.mat = numeric.rep([numOfNodes,numOfNodes],-1)
  for(var i = 0; i < numOfNodes; ++i) {
    for(var j = 0; j < numOfNodes; ++j) {
      var edges = qmanip.getEdges(qwalk.path[i], qwalk.path[j])
      qwalk.mat[i][j] = (edges.length != 0) ? 1 : 0
    }
  }

  // Set time
  qwalk.curTime = 0
  // Compute and cache the spectral decomposition
  qwalk.spectralDecomposition = qtools.specdecomp(numeric.clone(qwalk.mat))
  // Run qwalk
  qwalk.timer = setInterval(qwalk.loop, 25)
}

qwalk.loop = function() {
  var numOfNodes = qwalk.path.length
  var U = qtools.qwalk(qwalk.spectralDecomposition, numOfNodes, qwalk.curTime)
  for (var i = 0; i < numOfNodes; i++) {
    // The amplitude is given by the first column of U
    var ampl = U.getBlock([i, 0], [i, 0])
    var prob = ampl.mul(ampl.conj()).x[0][0]
    cy.getElementById(qwalk.path[i]).data('bg', valToColor(prob))
  }
  qwalk.curTime += qwalk.deltaTime
}
