var fs = require('fs')

function parseMTL (mtl) {
  var output = {}
  mtl.split('newmtl ').slice(1).forEach(function (block) {
    var lines = block.split('\r\n')
    var label = lines[0]
    var props = {}
    lines.slice(1).forEach(function (line) {
      if (line.charAt(0) !== '\t') {
        return
      }
      var toks = line.split(/\s+/).slice(1)
      var label = toks[0]
      var data = toks.slice(1)
      if (data.length === 1) {
        props[label] = +data[0]
      } else {
        props[label] = data.map(function (x) {
          return Math.sqrt(x).toPrecision(4)
        })
      }
    })
    output[label] = props
  })

  return output
}

var mtl = parseMTL(fs.readFileSync('fox.mtl').toString('utf8'))

function parseOBJ (obj) {
  var lines = obj.split('\r\n')

  var positions = []
  var faceGroups = {}
  var currentMTL

  lines.forEach(function (line) {
    var toks = line.split(/\s+/)
    if (toks.length === 0) {
      return
    }

    switch (toks[0]) {
      case 'v':
        positions.push(toks.slice(1, 4).map(function (p) {
          return +p
        }))
        break
      case 'usemtl':
        currentMTL = toks[1]
        if (!(currentMTL in faceGroups)) {
          faceGroups[currentMTL] = []
        }
        break
      case 'f':
        var f = toks.slice(1, 4).map(function (tuple) {
          return (tuple.split('/')[0] | 0) - 1
        })
        if (f[0] !== f[1] && f[1] !== f[2] && f[2] !== f[0]) {
          faceGroups[currentMTL].push(f)
        }
        break
    }
  })

  var chunks = []
  Object.keys(faceGroups).forEach(function (name) {
    var material = mtl[name]
    chunks.push({
      color: material.Ka.map(function (c, i) {
        return (255 * c) | 0
      }),
      faces: faceGroups[name]
    })
  })

  return {
    positions: positions,
    chunks: chunks
  }
}

var obj = parseOBJ(fs.readFileSync('fox.obj').toString('utf8'))

console.log(JSON.stringify(obj, null, 2))
