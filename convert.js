const fs = require('fs')

function parseMTL (mtl) {
  const output = {}
  mtl.split('newmtl ').slice(1).forEach(function (block) {
    const lines = block.split('\r\n')
    const label = lines[0]
    const props = {}
    lines.slice(1).forEach(function (line) {
      if (line.charAt(0) !== '\t') {
        return
      }
      const toks = line.split(/\s+/u).slice(1)
      const tokenLabel = toks[0]
      const data = toks.slice(1)
      if (data.length === 1) {
        props[tokenLabel] = Number(data[0])
      } else {
        props[tokenLabel] = data.map(function (x) {
          return Math.sqrt(x).toPrecision(4)
        })
      }
    })
    output[label] = props
  })

  return output
}

const mtl = parseMTL(fs.readFileSync('fox.mtl').toString('utf8'))

function parseOBJ (obj) {
  const lines = obj.split('\r\n')

  const positions = []
  const faceGroups = {}
  let currentMTL

  lines.forEach(function (line) {
    const toks = line.split(/\s+/u)
    if (toks.length === 0) {
      return
    }

    let f
    switch (toks[0]) {
      case 'v':
        positions.push(toks.slice(1, 4).map(function (p) {
          return Number(p)
        }))
        break
      case 'usemtl':
        currentMTL = toks[1]
        if (!(currentMTL in faceGroups)) {
          faceGroups[currentMTL] = []
        }
        break
      case 'f':
        f = toks.slice(1, 4).map(function (tuple) {
          return (tuple.split('/')[0] | 0) - 1
        })
        if (f[0] !== f[1] && f[1] !== f[2] && f[2] !== f[0]) {
          faceGroups[currentMTL].push(f)
        }
        break
      default:
        throw new Error('Unrecognized token.')
    }
  })

  const chunks = []
  Object.keys(faceGroups).forEach(function (name) {
    const material = mtl[name]
    chunks.push({
      color: material.Ka.map(function (c) {
        return (255 * c) | 0
      }),
      faces: faceGroups[name],
    })
  })

  return {
    positions,
    chunks,
  }
}

const obj = parseOBJ(fs.readFileSync('fox.obj').toString('utf8'))

console.log(JSON.stringify(obj, null, 2))
