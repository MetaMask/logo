const foxJson = require('./fox.json');
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

/**
 * Create a MetaMask logo with specified options.
 *
 * This function generates an SVG MetaMask logo based on the provided options and mesh data. It handles the creation of the SVG container, the application of gradient and mask definitions, and the rendering of the logo.
 * @param {object} options - The options for creating the logo.
 * @param {number} [options.cameraDistance] - The distance of the camera from the logo.
 * @param {object} [options.meshJson] - The JSON object containing the mesh data for the logo.
 * @returns {object} The logo viewer object. This object contains the SVG container, the render scene function, and the options used to create the logo.
 */
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
