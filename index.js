const {
  calculateSizingOptions,
  createLogoViewer,
  loadModelFromJson,
  createModelRenderer,
  createNode,
  setAttribute,
} = require('./util.js')

module.exports = createLogo

function createLogo (options = {}) {
  if (!options.meshJson) {
    throw new Error('The meshJson parameter is required')
  }

  const cameraDistance = options.cameraDistance || 400
  const { height, width } = calculateSizingOptions(options)

  const container = createNode('svg')
  setAttribute(container, 'width', `${width}px`)
  setAttribute(container, 'height', `${height}px`)
  document.body.appendChild(container)

  const modelObj = loadModelFromJson(options.meshJson)
  const renderFox = createModelRenderer(container, cameraDistance, modelObj)
  const renderScene = (lookCurrent, slowDrift) => {
    const rect = container.getBoundingClientRect()
    renderFox(rect, lookCurrent, slowDrift)
  }

  return createLogoViewer(container, renderScene, { cameraDistance, ...options })
}
