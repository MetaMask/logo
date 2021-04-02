const perspective = require('gl-mat4/perspective')
const multiply = require('gl-mat4/multiply')
const lookAt = require('gl-mat4/lookAt')
const invert = require('gl-mat4/invert')
const rotate = require('gl-mat4/rotate')
const transform = require('gl-vec3/transformMat4')

const SVG_NS = 'http://www.w3.org/2000/svg'

module.exports = {
  calculateSizingOptions,
  createLogoViewer,
  createModelRenderer,
  loadModelFromJson,
  positionsFromModel,
  createPolygonsFromModelJson,
  createStandardModelPolygon,
  createMatrixComputer,
  compareZ,
  createFaceUpdater,
  createNode,
  setAttribute,
  svgElementToSvgImageContent,
  Polygon,
}

function createLogoViewer (container, renderScene, options = {}) {
  let followCursor = Boolean(options.followMouse)
  let followMotion = Boolean(options.followMotion)
  const slowDrift = Boolean(options.slowDrift)
  let shouldRender = true

  const mouse = {
    x: 0,
    y: 0,
  }
  const lookCurrent = [0, 0]
  const lookRate = 0.3

  // closes over scene state
  const renderCurrentScene = () => renderScene(lookCurrent, slowDrift)

  function setLookAtTarget (target) {
    const bounds = container.getBoundingClientRect()
    mouse.x = 1.0 - ((2.0 * (target.x - bounds.left)) / bounds.width)
    mouse.y = 1.0 - ((2.0 * (target.y - bounds.top)) / bounds.height)
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
      setLookAtTarget({
        x: ev.clientX,
        y: ev.clientY,
      })
      updateLookCurrent()
      renderCurrentScene()
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

      setLookAtTarget({
        x: xOffset + (leftToRight * acceleration),
        y: yOffset + (frontToBack * acceleration),
      })
      updateLookCurrent()
      renderCurrentScene()
    }
  })

  function lookAtAndRender (target) {
    // update look target
    setLookAtTarget(target)
    // this should prolly just call updateLookCurrent or set lookCurrent values to eaxactly lookTarget
    // but im not really sure why its different, so im leaving it alone
    lookCurrent[0] = mouse.x
    lookCurrent[1] = mouse.y + (0.085 / lookRate)
    renderCurrentScene()
  }

  function renderLoop () {
    if (!shouldRender) {
      return
    }
    // we set up a rerender, and then immediately cancel it via stopAnimation
    // this seems like a mistake. likely because we change it to only animate
    // on mousemove / device orienation as a perf gain, but didnt clean up
    window.requestAnimationFrame(renderLoop)
    updateLookCurrent()
    renderCurrentScene()
    stopAnimation()
  }

  function updateLookCurrent () {
    const li = (1.0 - lookRate)
    lookCurrent[0] = (li * lookCurrent[0]) + (lookRate * mouse.x)
    lookCurrent[1] = (li * lookCurrent[1]) + (lookRate * mouse.y) + 0.085
  }

  renderLoop()

  return {
    container,
    lookAt: setLookAtTarget,
    setFollowMouse,
    setFollowMotion,
    stopAnimation,
    startAnimation,
    lookAtAndRender,
    renderCurrentScene,
  }
}

function loadModelFromJson (modelJson, createSvgPolygon = createStandardModelPolygon) {
  const vertCount = modelJson.positions.length
  const positions = new Float32Array(3 * vertCount)
  const transformed = new Float32Array(3 * vertCount)
  const { polygons, polygonsByChunk } = createPolygonsFromModelJson(modelJson, createSvgPolygon)
  positionsFromModel(positions, modelJson)
  const updatePositions = createPositionUpdater(positions, transformed, vertCount)
  const modelObj = { updatePositions, positions, transformed, polygons, polygonsByChunk }
  return modelObj
}

function createModelRenderer (container, cameraDistance, modelObj) {
  const { updatePositions, transformed, polygons } = modelObj

  for (const polygon of polygons) {
    container.appendChild(polygon.svg)
  }

  const computeMatrix = createMatrixComputer(cameraDistance)
  const updateFaces = createFaceUpdater(container, polygons, transformed)

  return (rect, lookPos, slowDrift) => {
    const matrix = computeMatrix(rect, lookPos, slowDrift)
    updatePositions(matrix)
    updateFaces(rect, container, polygons, transformed)
  }
}

function positionsFromModel (positions, modelJson) {
  const pp = modelJson.positions
  let ptr = 0
  for (let i = 0; i < pp.length; ++i) {
    const p = pp[i]
    for (let j = 0; j < 3; ++j) {
      positions[ptr] = p[j]
      ptr += 1
    }
  }
}

function createPolygonsFromModelJson (modelJson, createSvgPolygon) {
  const polygons = []
  const polygonsByChunk = modelJson.chunks.map((chunk) => {
    const { faces } = chunk
    return faces.map((face) => {
      const svgPolygon = createSvgPolygon(chunk)
      const polygon = new Polygon(svgPolygon, face)
      polygons.push(polygon)
      return polygon
    })
  })
  return { polygons, polygonsByChunk }
}

function createStandardModelPolygon (chunk) {
  const color = `rgb(${chunk.color})`
  const svgPolygon = createNode('polygon')
  setAttribute(
    svgPolygon,
    'fill',
    color,
  )
  setAttribute(
    svgPolygon,
    'stroke',
    color,
  )
  setAttribute(
    svgPolygon,
    'points',
    '0,0, 10,0, 0,10',
  )
  return svgPolygon
}

function createMatrixComputer (distance) {
  const objectCenter = new Float32Array(3)
  const up = new Float32Array([0, 1, 0])
  const projection = new Float32Array(16)
  const model = new Float32Array(16)
  const view = lookAt(
    new Float32Array(16),
    new Float32Array([0, 0, distance]),
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

  return (rect, lookPos, slowDrift) => {
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
    target[0] = lookPos[0]
    target[1] = lookPos[1]
    target[2] = 1.2
    transform(target, target, invProjection)
    transform(target, target, invView)
    lookAt(
      model,
      objectCenter,
      target,
      up,
    )

    // this shouldnt operate directly on the matrix/model,
    // it should likely operate on the lookPos
    // if we do want to operate on the matrix/model, it shouldnt happen here
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
}

function createPositionUpdater (positions, transformed, vertCount) {
  return (M) => {
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

    for (let i = 0; i < vertCount; ++i) {
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
}

function compareZ (a, b) {
  return b.zIndex - a.zIndex
}

function createFaceUpdater (container, polygons, transformed) {
  const toDraw = []
  return (rect) => {
    let i
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
    container.innerHTML = ''
    for (i = 0; i < toDraw.length; ++i) {
      container.appendChild(toDraw[i].svg)
    }
  }
}

function calculateSizingOptions (options = {}) {
  let width = options.width || 400
  let height = options.height || 400

  if (!options.pxNotRatio) {
    width = (window.innerWidth * (options.width || 0.25)) | 0
    height = ((window.innerHeight * options.height) || width) | 0

    if ('minWidth' in options && width < options.minWidth) {
      width = options.minWidth
      height = (options.minWidth * options.height / options.width) | 0
    }
  }
  return { width, height }
}

function createNode (type) {
  return document.createElementNS(SVG_NS, type)
}

function setAttribute (node, attribute, value) {
  node.setAttributeNS(null, attribute, value)
}

function svgElementToSvgImageContent (svgElement) {
  const inner = svgElement.innerHTML
  const head = `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> ` +
  `<svg width="521px" height="521px" version="1.1" baseProfile="full" xmlns="${SVG_NS}" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events">`
  const foot = '</svg>'
  const content = head + inner + foot
  return content
}

function Polygon (svg, indices) {
  this.svg = svg
  this.indices = indices
  this.zIndex = 0
}
