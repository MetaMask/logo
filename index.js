var regl = require('regl')()
var perspective = require('gl-mat4/perspective')
var lookAt = require('gl-mat4/lookAt')
var identity = require('gl-mat4/identity')
var foxJSON = require('./fox.json')

var drawLogo = regl({
  vert: `
  precision mediump float;
  attribute vec3 position, color;
  uniform mat4 projection, view, model;
  varying vec3 fragColor;
  void main () {
    fragColor = color;
    gl_Position = projection * view * model * vec4(position, 1);
  }
  `,

  frag: `
  precision mediump float;
  varying vec3 fragColor;
  void main () {
    gl_FragColor = vec4(fragColor, 1);
  }
  `,

  attributes: (function () {
    var numFaces = foxJSON.faces

    var positions = new Float32Array(3 * 3 * numFaces)
    var colors = new Float32Array(3 * 3 * numFaces)

    var ptr = 0
    var verts = foxJSON.positions

    for (var i = 0; i < foxJSON.chunks.length; ++i) {
      var chunk = foxJSON.chunks[i]
      var color = chunk.color
      var faces = chunk.faces

      for (var j = 0; j < faces.length; ++j) {
        var f = faces[j]
        for (var k = 0; k < 3; ++k) {
          var p = verts[f[k]]
          for (var l = 0; l < 3; ++l) {
            positions[ptr] = p[l]
            colors[ptr] = color[l]
            ptr += 1
          }
        }
      }
    }

    return {
      position: positions,
      color: colors
    }
  })(),

  uniforms: (function () {
    var projection = new Float32Array(16)
    var view = new Float32Array(16)
    var model = new Float32Array(16)

    return {
      projection: function (context) {
        return perspective(
          projection,
          Math.PI / 4.0,
          context.viewportWidth / context.viewportHeight,
          0.01,
          1000.0)
      },
      view: function () {
        return lookAt(
          view,
          [0, 0, 500],
          [0, 0, 0],
          [0, 1, 0])
      },
      model: function () {
        return identity(model)
      }
    }
  })(),

  count: 3 * foxJSON.faces
})

regl.frame(() => {
  regl.clear({
    color: [0, 0, 0, 0],
    depth: 1
  })
  drawLogo()
})
