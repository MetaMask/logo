const foxJson = require('./fox.json');
const {
  calculateSizingOptions,
  createLogoViewer,
  loadModelFromJson,
  createModelRenderer,
  createNode,
  setAttribute,
  setGradientDefinitions,
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
  setMaskDefinitions(container, meshJson.masks, height, width);

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

function setMaskDefinitions(container, masks, height, width) {
  for (const [maskId, maskDefinition] of Object.entries(masks)) {
    const mask = createNode('mask');
    setAttribute(mask, 'id', maskId);

    const maskedRect = createNode('rect');

    // Extend mask beyond container to ensure it completely covers the model.
    // The model can extend beyond the container as well.
    setAttribute(maskedRect, 'width', width * 1.5);
    setAttribute(maskedRect, 'height', height * 1.5);
    setAttribute(maskedRect, 'x', `-${Math.floor(width / 4)}`);
    setAttribute(maskedRect, 'y', `-${Math.floor(height / 4)}`);

    setAttribute(maskedRect, 'fill', maskDefinition.maskColor);
    mask.appendChild(maskedRect);

    container.appendChild(mask);
  }
}
