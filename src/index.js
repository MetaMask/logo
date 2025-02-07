const foxJson = require('../data/fox.json');
const {
  calculateSizingOptions,
  createLogoViewer,
  defaultCameraDistance,
  loadModelFromJson,
  createModelRenderer,
  createNode,
  setAttribute,
  setGradientDefinitions,
  setMaskDefinitions,
} = require('./util');

module.exports = createLogo;

/**
 * Create an animated SVG logo.
 *
 * The size defaults to 25% of the screen size, or 400x400px if `pxNotRatio` is true.
 *
 * @param {object} [options] - Options.
 * @param {ModelJson} [options.meshJson] - The 3D model.
 * @param {boolean} [options.followMouse] - The model looks at the mouse.
 * @param {boolean} [options.followMotion] - The model moves in response to device movement.
 * @param {boolean} [options.slowDrift] - The model slowly rotates.
 * @param {boolean} [options.lazyRender] - Determines whether to render each animation frame, or
 * just when requested (e.g. by mouse/device movement).
 * @param {number} [options.cameraDistance] - The distance between the model and the camera.
 * @param {number} [options.width] - Width, either in pixels or as a ratio of window width.
 * @param {number} [options.height] - Height, either in pixels or as a ratio of window height.
 * @param {number} [options.minWidth] - Minimum width (in pixels), used as a lower bound if the
 * width is specified as a ratio.
 * @param {boolean} [options.pxNotRatio] - True indicates the width and height are in pixels, false
 * indicates they are a ratio.
 * @returns {LogoViewer} An animated SVG logo.
 */
function createLogo({
  meshJson = foxJson,
  // animation options
  followMouse = false,
  followMotion = false,
  slowDrift = false,
  // render options
  lazyRender = true,
  cameraDistance = defaultCameraDistance,
  // size options
  width: specifiedWidth,
  height: specifiedHeight,
  minWidth,
  pxNotRatio = false,
} = {}) {
  const { height, width } = calculateSizingOptions({
    width: specifiedWidth,
    height: specifiedHeight,
    minWidth,
    pxNotRatio,
  });

  const container = createNode('svg');
  setAttribute(container, 'width', `${width}px`);
  setAttribute(container, 'height', `${height}px`);
  document.body.appendChild(container);

  setGradientDefinitions(container, meshJson.gradients);
  setMaskDefinitions({ container, masks: meshJson.masks, height, width });

  const modelObj = loadModelFromJson(meshJson);
  const renderFox = createModelRenderer(container, cameraDistance, modelObj);
  const renderScene = (lookCurrent, _slowDrift) => {
    const rect = container.getBoundingClientRect();
    renderFox(rect, lookCurrent, _slowDrift);
  };

  return createLogoViewer(container, renderScene, {
    cameraDistance,
    followMouse,
    followMotion,
    lazyRender,
    slowDrift,
  });
}
