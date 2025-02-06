const foxJson = require('../data/fox.json');
const {
  calculateSizingOptions,
  createLogoViewer,
  loadModelFromJson,
  createModelRenderer,
  createNode,
  setAttribute,
  setGradientDefinitions,
  setMaskDefinitions,
} = require('./util');

module.exports = createLogo;

function createLogo(options = {}) {
  const cameraDistance = options.cameraDistance || 400;
  const { height, width } = calculateSizingOptions(options);
  const meshJson = options.meshJson || foxJson;

  const container = createNode('svg');
  setAttribute(container, 'width', `${width}px`);
  setAttribute(container, 'height', `${height}px`);
  document.body.appendChild(container);

  setGradientDefinitions(container, meshJson.gradients);
  setMaskDefinitions({ container, masks: meshJson.masks, height, width });

  const modelObj = loadModelFromJson(meshJson);
  const renderFox = createModelRenderer(container, cameraDistance, modelObj);
  const renderScene = (lookCurrent, slowDrift) => {
    const rect = container.getBoundingClientRect();
    renderFox(rect, lookCurrent, slowDrift);
  };

  return createLogoViewer(
    container,
    renderScene,
    Object.assign({ cameraDistance }, options),
  );
}
