const foxJson = require('./fox.json')
const {
  calculateSizingOptions,
  createLogoViewer,
  createModelRenderer,
  createStandardModelPolygon,
  createNode,
  setAttribute,
} = require('./util.js')

module.exports = createLogo

function createLogo (options = {}) {
  const cameraDistance = options.cameraDistance || 400
  const { height, width } = calculateSizingOptions(options)

  const container = createNode('svg')
  setAttribute(container, 'width', `${width}px`)
  setAttribute(container, 'height', `${height}px`)
  document.body.appendChild(container)

  const renderFox = createModelRenderer(container, foxJson, cameraDistance, createStandardModelPolygon)
  const renderScene = (lookCurrent, slowDrift) => {
    const rect = container.getBoundingClientRect()
    renderFox(rect, lookCurrent, slowDrift)
  }

  return createLogoViewer(container, renderScene, { cameraDistance, ...options })
}
