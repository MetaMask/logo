const fs = require('fs')
const path = require('path')
const OBJFile = require('obj-file-parser')

const obj = fs.readFileSync('./fox.obj').toString()
const mtlRaw = fs.readFileSync('./fox.mtl').toString('utf8')

function parseMTL (mtl) {
  const output = {}
  mtl.split('newmtl ').slice(1).forEach(function (block) {
    const lines = block.split('\n')
    const label = lines[0]
    const props = {}
    lines.slice(1).forEach(function (line) {

      // Skip illum lines
      if (line.indexOf('illum') === 0) {
        return
      }

      const toks = line.split(/\s+/u)
      const lineLabel = toks[0]
      const data = toks.slice(1)
      if (data.length === 1) {
        props[lineLabel] = Number(data[0])
      } else {
        props[lineLabel] = data.map(function (x) {
          return Math.sqrt(x).toPrecision(4)
        })
      }
    })
    output[label] = props
  })

  return output
}

const mtl = parseMTL(mtlRaw)

const objF = new OBJFile(obj)

const data = objF.parse(objF)

const outpath = path.join(__dirname, 'fox.json')

const output = {
  positions: [],
  chunks: [],
}

/*

type colorValue = number; // 0-255
type positionId = number; // Index of that position
type CoordVal = number;

type Position = [CoordVal, CoordVal, CoordVal];
type Face = [positionId, positionId, positionId];

export type EfficientModel = {
  positions: Array<Position>;
  chunks: Array<{
    color: [colorValue, colorValue, colorValue];
    faces: Array<Face>;
  }>;
}

*/
const VI = 'vertexIndex'

const model = data.models[0]
model.vertices.forEach((v) => {
  output.positions.push([v.x, v.y, v.z])
})

for (const mtlKey of Object.keys(mtl)) {
  const m = mtl[mtlKey]

  if (m.Ka) {
    const color = m.Kd.map(function (c) {
      return (255 * c) | 0
    })
    m.Kd.forEach((c, i) => {
      if (color[i] === 0) {
        color[i] = (255 * c) | 0
      }
    })

    const chunk = {
      color,
      faces: [],
    }

    model.faces.forEach((f) => {

      // Only if this face matches the material!
      if (
        f.material === mtlKey
      ) {
        chunk.faces.push([
          f.vertices[0][VI] - 1,
          f.vertices[1][VI] - 1,
          f.vertices[2][VI] - 1,
        ])
        console.log('we pushed some faces, eh?', chunk.faces)
      } else {
        console.log(`I guess ${f.material} !== ${mtlKey}`)
      }
    })

    output.chunks.push(chunk)
  } else {
    console.log(`PROBLEM with ${mtlKey}`)
    console.dir(m)
  }
}

fs.writeFileSync(outpath, JSON.stringify(output, null, 2))
