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
          return +x
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
        faceGroups[currentMTL].push(toks.slice(1, 4).map(function (tuple) {
          return (tuple.split('/')[0] | 0) - 1
        }))
        break
    }
  })

  var faceCount = 0

  var chunks = []
  Object.keys(faceGroups).forEach(function (name) {
    var material = mtl[name]
    faceCount += faceGroups[name].length
    chunks.push({
      color: material.Ka.map(function (c, i) {
        return c
      }),
      faces: faceGroups[name]
    })
  })

  return {
    positions: positions,
    chunks: chunks,
    faces: faceCount
  }
}

var obj = parseOBJ(fs.readFileSync('fox.obj').toString('utf8'))

console.log(JSON.stringify(obj))
