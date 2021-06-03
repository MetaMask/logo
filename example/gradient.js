const copy = require('copy-to-clipboard')
const {
  calculateSizingOptions,
  createLogoViewer,
  loadModelFromJson,
  createModelRenderer,
  createNode,
  setAttribute,
  svgElementToSvgImageContent,
} = require('../util')
const foxJson = require('../fox.json')

document.addEventListener('keypress', function (event) {
  if (event.keyCode === 99) { // the c key
    const svg = document.querySelector('svg')
    const content = svgElementToSvgImageContent(svg)
    copy(content)
  }
})

createGradientLogo({
  width: 0.4,
  height: 0.4,
  followMouse: true,
  followMotion: true,
})

function createGradientLogo (options) {
  const cameraDistance = options.cameraDistance || 400
  const { height, width } = calculateSizingOptions(options)

  const container = createNode('svg')
  setAttribute(container, 'width', `${width}px`)
  setAttribute(container, 'height', `${height}px`)
  document.body.appendChild(container)
  const { mask1 } = createSvgDefs(container)
  createMaskedGradientRect(container, height, width)

  const modelObj = loadModelFromJson(foxJson, createMaskPolygon)
  const renderFox = createModelRenderer(mask1, cameraDistance, modelObj)
  const renderScene = (lookCurrent, slowDrift) => {
    const rect = container.getBoundingClientRect()
    renderFox(rect, lookCurrent, slowDrift)
  }

  return createLogoViewer(container, renderScene, { cameraDistance, ...options })
}

function createMaskedGradientRect (container, height, width) {
  // <rect width="400" height="400"
  // style="fill: url(#gradient1); mask: url(#mask1)"/>
  const maskedRect = createNode('rect')
  maskedRect.setAttribute('width', width)
  maskedRect.setAttribute('height', height)
  maskedRect.setAttribute('style', 'fill: url(#gradient1); mask: url(#mask1)')
  container.appendChild(maskedRect)
}

function createSvgDefs (container) {
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

  return { defsContainer, linearGradient, mask1 }
}

function createMaskPolygon () {
  // <polygon
  //   style="stroke:none; fill: #ffffff"
  //   points="212.49258854612708,113.06104078888893 166.50741145387292,113.06104078888893 148.1171049848199,67.39842438697815"
  // ></polygon>
  const svgPolygon = createNode('polygon')
  setAttribute(
    svgPolygon,
    'style',
    'stroke:#ffffff; fill: #ffffff',
  )
  setAttribute(
    svgPolygon,
    'points',
    '0,0, 10,0, 0,10',
  )
  return svgPolygon
}
