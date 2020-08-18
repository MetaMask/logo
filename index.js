var perspective = require('gl-mat4/perspective')
var multiply = require('gl-mat4/multiply')
var lookAt = require('gl-mat4/lookAt')
var invert = require('gl-mat4/invert')
var rotate = require('gl-mat4/rotate')
var transform = require('gl-vec3/transformMat4')
var foxJSON = require('./fox.json')

var SVG_NS = 'http://www.w3.org/2000/svg'

function createNode (type) {
  return document.createElementNS(SVG_NS, type)
}

function setAttribute (node, attribute, value) {
  node.setAttributeNS(null, attribute, value)
}

module.exports = function createLogo (options_) {
  var options = options_ || {}

  var followCursor = !!options.followMouse
  var followMotion = !!options.followMotion
  var slowDrift = !!options.slowDrift
  var shouldRender = true

  var DISTANCE = 400
  var lookCurrent = [0, 0]
  var lookRate = 0.3

  var width = options.width || 400
  var height = options.height || 400
  var container = createNode('svg')
  var mouse = {
    x: 0,
    y: 0
  }

  var NUM_VERTS = foxJSON.positions.length

  var positions = new Float32Array(3 * NUM_VERTS)
  var transformed = new Float32Array(3 * NUM_VERTS)

  var toDraw = []

  if (!options.pxNotRatio) {
    width = (window.innerWidth * (options.width || 0.25)) | 0
    height = ((window.innerHeight * options.height) || width) | 0

    if ('minWidth' in options && width < options.minWidth) {
      width = options.minWidth
      height = (options.minWidth * options.height / options.width) | 0
    }
  }

  setAttribute(container, 'width', width + 'px')
  setAttribute(container, 'height', height + 'px')

  function setLookAt(target) {
    var bounds = container.getBoundingClientRect()
    mouse.x = 1.0 - 2.0 * (target.x - bounds.left) / bounds.width
    mouse.y = 1.0 - 2.0 * (target.y - bounds.top) / bounds.height
  }

  document.body.appendChild(container)

  ;(function () {
    var pp = foxJSON.positions
    var ptr = 0
    for (var i = 0; i < pp.length; ++i) {
      var p = pp[i]
      for (var j = 0; j < 3; ++j) {
        positions[ptr++] = p[j]
      }
    }
  })()

  function Polygon (svg, indices) {
    this.svg = svg
    this.indices = indices
    this.zIndex = 0
  }

  var polygons = (function () {
    var polygons = []
    for (var i = 0; i < foxJSON.chunks.length; ++i) {
      var chunk = foxJSON.chunks[i]
      var color = 'rgb(' + chunk.color + ')'
      var faces = chunk.faces
      for (var j = 0; j < faces.length; ++j) {
        var f = faces[j]
        var polygon = createNode('polygon')
        setAttribute(
          polygon,
          'fill',
          color)
        setAttribute(
          polygon,
          'stroke',
          color)
        setAttribute(
          polygon,
          'points',
          '0,0, 10,0, 0,10')
        container.appendChild(polygon)
        polygons.push(new Polygon(polygon, f))
      }
    }
    return polygons
  })()

  var computeMatrix = (function () {
    var objectCenter = new Float32Array(3)
    var up = new Float32Array([0, 1, 0])
    var projection = new Float32Array(16)
    var model = new Float32Array(16)
    var view = lookAt(
      new Float32Array(16),
      new Float32Array([0, 0, DISTANCE]),
      objectCenter,
      up)
    var invView = invert(new Float32Array(16), view)
    var invProjection = new Float32Array(16)
    var target = new Float32Array(3)
    var transformed = new Float32Array(16)

    var X = new Float32Array([1, 0, 0])
    var Y = new Float32Array([0, 1, 0])
    var Z = new Float32Array([0, 0, 1])

    return function () {
      var rect = container.getBoundingClientRect()
      var viewportWidth = rect.width
      var viewportHeight = rect.height
      perspective(
        projection,
        Math.PI / 4.0,
        viewportWidth / viewportHeight,
        100.0,
        1000.0)
      invert(invProjection, projection)
      target[0] = lookCurrent[0]
      target[1] = lookCurrent[1]
      target[2] = 1.2
      transform(target, target, invProjection)
      transform(target, target, invView)
      lookAt(
        model,
        objectCenter,
        target,
        up)
      if (slowDrift) {
        var time = (Date.now() / 1000.0)
        rotate(model, model, 0.1 + (Math.sin(time / 3) * 0.2), X)
        rotate(model, model, -0.1 + (Math.sin(time / 2) * 0.03), Z)
        rotate(model, model, 0.5 + (Math.sin(time / 3) * 0.2), Y)
      }

      multiply(transformed, projection, view)
      multiply(transformed, transformed, model)

      return transformed
    }
  })()

  function updatePositions (M) {
    var m00 = M[0]
    var m01 = M[1]
    var m02 = M[2]
    var m03 = M[3]
    var m10 = M[4]
    var m11 = M[5]
    var m12 = M[6]
    var m13 = M[7]
    var m20 = M[8]
    var m21 = M[9]
    var m22 = M[10]
    var m23 = M[11]
    var m30 = M[12]
    var m31 = M[13]
    var m32 = M[14]
    var m33 = M[15]

    for (var i = 0; i < NUM_VERTS; ++i) {
      var x = positions[3 * i]
      var y = positions[3 * i + 1]
      var z = positions[3 * i + 2]

      var tw = x * m03 + y * m13 + z * m23 + m33
      transformed[3 * i] =
        (x * m00 + y * m10 + z * m20 + m30) / tw
      transformed[3 * i + 1] =
        (x * m01 + y * m11 + z * m21 + m31) / tw
      transformed[3 * i + 2] =
        (x * m02 + y * m12 + z * m22 + m32) / tw
    }
  }

  function compareZ (a, b) {
    return b.zIndex - a.zIndex
  }

  function updateFaces () {
    var i
    var rect = container.getBoundingClientRect()
    var w = rect.width
    var h = rect.height
    toDraw.length = 0
    for (i = 0; i < polygons.length; ++i) {
      var poly = polygons[i]
      var indices = poly.indices

      var i0 = indices[0]
      var i1 = indices[1]
      var i2 = indices[2]
      var ax = transformed[3 * i0]
      var ay = transformed[3 * i0 + 1]
      var bx = transformed[3 * i1]
      var by = transformed[3 * i1 + 1]
      var cx = transformed[3 * i2]
      var cy = transformed[3 * i2 + 1]
      var det = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)
      if (det < 0) {
        continue
      }

      var points = []
      var zmax = -Infinity
      var zmin = Infinity
      var element = poly.svg
      for (var j = 0; j < 3; ++j) {
        var idx = indices[j]
        points.push(
          0.5 * w * (1.0 - transformed[3 * idx]) + ',' +
          0.5 * h * (1.0 - transformed[3 * idx + 1]))
        var z = transformed[3 * idx + 2]
        zmax = Math.max(zmax, z)
        zmin = Math.min(zmin, z)
      }
      poly.zIndex = zmax + 0.25 * zmin
      var joinedPoints = points.join(' ')

      if (joinedPoints.indexOf('NaN') === -1) {
        setAttribute(element, 'points', joinedPoints)
      }

      toDraw.push(poly)
    }
    toDraw.sort(compareZ)
    container.innerHTML = ''
    for (i = 0; i < toDraw.length; ++i) {
      container.appendChild(toDraw[i].svg)
    }
  }

  function stopAnimation() { shouldRender = false }
  function startAnimation() { shouldRender = true }
  function setFollowMouse (state) { followCursor = state }
  function setFollowMotion (state) { followMotion = state }

  window.addEventListener('mousemove', function (ev) {
    if (!shouldRender) { startAnimation() }
    if (followCursor) {
      setLookAt({
        x: ev.clientX,
        y: ev.clientY,
      })
      renderScene()
    }
  })

  window.addEventListener('deviceorientation', function (ev) {
    if (!shouldRender) { startAnimation() }
    if (followMotion) {
      // gamma: left to right
      const leftToRight = event.gamma,
      // beta: front back motion
      frontToBack = event.beta,
      // x offset: needed to correct the intial position
      xOffset = 200
      // y offset: needed to correct the intial position
      yOffset = -300
      // acceleration
      acceleration = 10


      setLookAt({
        x: xOffset + leftToRight * acceleration,
        y: yOffset + frontToBack * acceleration,
      })
      renderScene()
    }
  })

  function renderScene () {
    if (!shouldRender) return
    window.requestAnimationFrame(renderScene)

    var li = (1.0 - lookRate)
    var bounds = container.getBoundingClientRect()

    lookCurrent[0] = li * lookCurrent[0] + lookRate * mouse.x
    lookCurrent[1] = li * lookCurrent[1] + lookRate * mouse.y + 0.085

    var matrix = computeMatrix()
    updatePositions(matrix)
    updateFaces()
    stopAnimation()
  }

  renderScene()

  return {
    container: container,
    lookAt: setLookAt,
    setFollowMouse: setFollowMouse,
    setFollowMotion: setFollowMotion,
    stopAnimation: stopAnimation,
    startAnimation: startAnimation,
  }
}
