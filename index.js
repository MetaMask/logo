const perspective = require('gl-mat4/perspective')
const multiply = require('gl-mat4/multiply')
const lookAt = require('gl-mat4/lookAt')
const invert = require('gl-mat4/invert')
const rotate = require('gl-mat4/rotate')
const transform = require('gl-vec3/transformMat4')
const foxJSON = require('./fox.json')

const SVG_NS = 'http://www.w3.org/2000/svg'

function createNode (type) {
  return document.createElementNS(SVG_NS, type)
}

function setAttribute (node, attribute, value) {
  node.setAttributeNS(null, attribute, value)
}

module.exports = function createLogo (options_) {
  const options = options_ || {}

  let followCursor = Boolean(options.followMouse)
  let followMotion = Boolean(options.followMotion)
  const slowDrift = Boolean(options.slowDrift)
  let shouldRender = true

  const DISTANCE = 400
  const lookCurrent = [0, 0]
  const lookRate = 0.3

  let width = options.width || 400
  let height = options.height || 400
  const container = createNode('svg')
  const mouse = {
    x: 0,
    y: 0,
  }

  defineGradients()

  const NUM_VERTS = foxJSON.positions.length

  const positions = new Float32Array(3 * NUM_VERTS)
  const transformed = new Float32Array(3 * NUM_VERTS)

  const toDraw = []

  if (!options.pxNotRatio) {
    width = (window.innerWidth * (options.width || 0.25)) | 0
    height = ((window.innerHeight * options.height) || width) | 0

    if ('minWidth' in options && width < options.minWidth) {
      width = options.minWidth
      height = (options.minWidth * options.height / options.width) | 0
    }
  }

  setAttribute(container, 'width', `${width}px`)
  setAttribute(container, 'height', `${height}px`)

  function setLookAt (target) {
    const bounds = container.getBoundingClientRect()
    mouse.x = 1.0 - ((2.0 * (target.x - bounds.left)) / bounds.width)
    mouse.y = 1.0 - ((2.0 * (target.y - bounds.top)) / bounds.height)
  }

  document.body.appendChild(container);
  (function () {
    const pp = foxJSON.positions
    let ptr = 0
    for (let i = 0; i < pp.length; ++i) {
      const p = pp[i]
      for (let j = 0; j < 3; ++j) {
        positions[ptr] = p[j]
        ptr += 1
      }
    }
  })()

  function Polygon (svg, indices) {
    this.svg = svg
    this.indices = indices
    this.zIndex = 0
  }

  const polygons = (function () {
    const _polygons = []
    for (let i = 0; i < foxJSON.chunks.length; ++i) {
      const chunk = foxJSON.chunks[i]
      const { faces } = chunk
      for (let j = 0; j < faces.length; ++j) {
        const f = faces[j]
        const polygon = createNode('polygon')
        // <polygon style="stroke:none; fill: #ffffff" points="212.49258854612708,113.06104078888893 166.50741145387292,113.06104078888893 148.1171049848199,67.39842438697815"></polygon>

        setAttribute(
          polygon,
          'style',
          'stroke:none; fill: #ffffff',
        )
        // setAttribute(
        //   polygon,
        //   'stroke',
        //   color,
        // )
        setAttribute(
          polygon,
          'points',
          '0,0, 10,0, 0,10',
        )
        container.appendChild(polygon)
        _polygons.push(new Polygon(polygon, f))
      }
    }
    return _polygons
  })()

  const computeMatrix = (function () {
    const objectCenter = new Float32Array(3)
    const up = new Float32Array([0, 1, 0])
    const projection = new Float32Array(16)
    const model = new Float32Array(16)
    const view = lookAt(
      new Float32Array(16),
      new Float32Array([0, 0, DISTANCE]),
      objectCenter,
      up,
    )
    const invView = invert(new Float32Array(16), view)
    const invProjection = new Float32Array(16)
    const target = new Float32Array(3)
    const transformedMatrix = new Float32Array(16)

    const X = new Float32Array([1, 0, 0])
    const Y = new Float32Array([0, 1, 0])
    const Z = new Float32Array([0, 0, 1])

    return function () {
      const rect = container.getBoundingClientRect()
      const viewportWidth = rect.width
      const viewportHeight = rect.height
      perspective(
        projection,
        Math.PI / 4.0,
        viewportWidth / viewportHeight,
        100.0,
        1000.0,
      )
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
        up,
      )
      if (slowDrift) {
        const time = (Date.now() / 1000.0)
        rotate(model, model, 0.1 + (Math.sin(time / 3) * 0.2), X)
        rotate(model, model, -0.1 + (Math.sin(time / 2) * 0.03), Z)
        rotate(model, model, 0.5 + (Math.sin(time / 3) * 0.2), Y)
      }

      multiply(transformedMatrix, projection, view)
      multiply(transformedMatrix, transformedMatrix, model)

      return transformedMatrix
    }
  })()

  function defineGradients () {
    // <defs>
    //   <linearGradient id="grad">
    //       <stop offset="0" stop-color="#fbaee3"/>
    //       <stop offset="1" stop-color="#ffd982"/>
    //   </linearGradient>
    //   <mask id="mask1">
    //     <polygon style="stroke:none; fill: #ffffff" points="212.49258854612708,113.06104078888893 166.50741145387292,113.06104078888893 148.1171049848199,67.39842438697815"></polygon>
    //     ... 
    //   </mask>
    // </defs>
    const defsContainer = createNode('defs')
    container.appendChild(defsContainer)
    const linearGradient = createNode('linearGradient')
    defsContainer.appendChild(linearGradient)
    linearGradient.id = 'gradient1'
    // linearGradient.setAttribute('id', 'gradient1')
    const color1 = createNode('stop')
    color1.setAttribute('offset', '0')
    color1.setAttribute('stop-color', '#fbaee3')
    linearGradient.appendChild(color1)
    const color2 = createNode('stop')
    color2.setAttribute('offset', '1')
    color2.setAttribute('stop-color', '#ffd982')
    linearGradient.appendChild(color2)
    const mask1 = createNode('mask')
    mask1.id = 'mask1'
    defsContainer.appendChild(mask1)

    return { mask1 }
  }

  function updatePositions (M) {
    const m00 = M[0]
    const m01 = M[1]
    const m02 = M[2]
    const m03 = M[3]
    const m10 = M[4]
    const m11 = M[5]
    const m12 = M[6]
    const m13 = M[7]
    const m20 = M[8]
    const m21 = M[9]
    const m22 = M[10]
    const m23 = M[11]
    const m30 = M[12]
    const m31 = M[13]
    const m32 = M[14]
    const m33 = M[15]

    for (let i = 0; i < NUM_VERTS; ++i) {
      const x = positions[3 * i]
      const y = positions[(3 * i) + 1]
      const z = positions[(3 * i) + 2]

      const tw = (x * m03) + (y * m13) + (z * m23) + m33
      transformed[3 * i] =
        ((x * m00) + (y * m10) + (z * m20) + m30) / tw
      transformed[(3 * i) + 1] =
        ((x * m01) + (y * m11) + (z * m21) + m31) / tw
      transformed[(3 * i) + 2] =
        ((x * m02) + (y * m12) + (z * m22) + m32) / tw
    }
  }

  function compareZ (a, b) {
    return b.zIndex - a.zIndex
  }

  function updateFaces (faceContainer) {
    let i
    const rect = container.getBoundingClientRect()
    const w = rect.width
    const h = rect.height
    toDraw.length = 0
    for (i = 0; i < polygons.length; ++i) {
      const poly = polygons[i]
      const { indices } = poly

      const i0 = indices[0]
      const i1 = indices[1]
      const i2 = indices[2]
      const ax = transformed[3 * i0]
      const ay = transformed[(3 * i0) + 1]
      const bx = transformed[3 * i1]
      const by = transformed[(3 * i1) + 1]
      const cx = transformed[3 * i2]
      const cy = transformed[(3 * i2) + 1]
      const det = ((bx - ax) * (cy - ay)) - ((by - ay) * (cx - ax))
      if (det < 0) {
        continue
      }

      const points = []
      let zmax = -Infinity
      let zmin = Infinity
      const element = poly.svg
      for (let j = 0; j < 3; ++j) {
        const idx = indices[j]
        points.push(
          `${0.5 * w * (1.0 - transformed[3 * idx])},${
            0.5 * h * (1.0 - transformed[(3 * idx) + 1])}`,
        )
        const z = transformed[(3 * idx) + 2]
        zmax = Math.max(zmax, z)
        zmin = Math.min(zmin, z)
      }
      poly.zIndex = zmax + (0.25 * zmin)
      const joinedPoints = points.join(' ')

      if (joinedPoints.indexOf('NaN') === -1) {
        setAttribute(element, 'points', joinedPoints)
      }

      toDraw.push(poly)
    }
    toDraw.sort(compareZ)

    for (i = 0; i < toDraw.length; ++i) {
      faceContainer.appendChild(toDraw[i].svg)
    }
  }

  function stopAnimation () {
    shouldRender = false
  }
  function startAnimation () {
    shouldRender = true
  }
  function setFollowMouse (state) {
    followCursor = state
  }
  function setFollowMotion (state) {
    followMotion = state
  }

  window.addEventListener('mousemove', function (ev) {
    if (!shouldRender) {
      startAnimation()
    }
    if (followCursor) {
      setLookAt({
        x: ev.clientX,
        y: ev.clientY,
      })
      renderScene()
    }
  })

  window.addEventListener('deviceorientation', function (event) {
    if (!shouldRender) {
      startAnimation()
    }
    if (followMotion) {
      // gamma: left to right
      const leftToRight = event.gamma
      // beta: front back motion
      const frontToBack = event.beta
      // x offset: needed to correct the intial position
      const xOffset = 200
      // y offset: needed to correct the intial position
      const yOffset = -300
      // acceleration
      const acceleration = 10

      setLookAt({
        x: xOffset + (leftToRight * acceleration),
        y: yOffset + (frontToBack * acceleration),
      })
      renderScene()
    }
  })

  function lookAtAndRender (target) {
    setLookAt(target)

    lookCurrent[0] = mouse.x
    lookCurrent[1] = mouse.y + (0.085 / lookRate)

    const matrix = computeMatrix()
    updatePositions(matrix)

    container.innerHTML = ''
    const { mask1 } = defineGradients()
    updateFaces(mask1)
    drawMaskedFox()
    stopAnimation()
  }

  function drawMaskedFox () {
    // <rect width="400" height="400"
    // style="fill: url(#gradient1); mask: url(#mask1)"/>
    const maskedRect = createNode('rect')
    maskedRect.setAttribute('width', 400)
    maskedRect.setAttribute('height', 400)
    maskedRect.setAttribute('style', 'fill: url(#gradient1); mask: url(#mask1)')
    container.appendChild(maskedRect)
  }

  function renderScene () {
    if (!shouldRender) {
      return
    }
    window.requestAnimationFrame(renderScene)

    const li = (1.0 - lookRate)

    lookCurrent[0] = (li * lookCurrent[0]) + (lookRate * mouse.x)
    lookCurrent[1] = (li * lookCurrent[1]) + (lookRate * mouse.y) + 0.085

    const matrix = computeMatrix()
    updatePositions(matrix)

    container.innerHTML = ''
    const { mask1 } = defineGradients()
    updateFaces(mask1)
    drawMaskedFox()
    stopAnimation()
  }

  renderScene()

  return {
    container,
    lookAt: setLookAt,
    setFollowMouse,
    setFollowMotion,
    stopAnimation,
    startAnimation,
    lookAtAndRender,
  }
}
