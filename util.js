const perspective = require('gl-mat4/perspective');
const multiply = require('gl-mat4/multiply');
const lookAt = require('gl-mat4/lookAt');
const invert = require('gl-mat4/invert');
const rotate = require('gl-mat4/rotate');
const transform = require('gl-vec3/transformMat4');

const SVG_NS = 'http://www.w3.org/2000/svg';

// Taken from https://github.com/yuzhe-han/ParentNode-replaceChildren
// This is to support browsers that do not yet support `replaceChildren`
const replaceChildrenPonyfill = function (...addNodes) {
  while (this.lastChild) {
    this.removeChild(this.lastChild);
  }

  if (addNodes.length > 0) {
    this.append(...addNodes);
  }
};

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
  setGradientDefinitions,
  setMaskDefinitions,
  svgElementToSvgImageContent,
  Polygon,
};

/**
 * A distance measurement used for SVG attributes. A length is specified as a number followed by a
 * unit identifier.
 *
 * See {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Content_type#length} for further
 * information.
 *
 * @typedef {`${number}${'em' | 'ex' | 'px' | 'in' | 'cm' | 'mm' | 'pt' | 'pc' | '%'}`} SvgLength
 */

/**
 * A definition for a `<stop>` SVG element, which defines a color and the position for that color
 * on a gradient. This element is always a child of either a `<linearGradient>` or
 * `<radialGradient>` element.
 *
 * See {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Element/stop} for more information
 * about the `<stop>` element.
 *
 * @typedef {object} StopDefinition
 * @property {number | `${number}%`} [offset] - The location of the gradient stop along the
 * gradient vector.
 * @property {string} [stop-color] - The color of the gradient stop. See {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Element/stop}.
 * @property {number} [stop-opacity] - The opacity of the gradient stop. See {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stop-opacity}.
 */

/**
 * A definition for a `<linearGradient>` SVG element. This definition includes all supported
 * `<linearGradient>` attributes, and it includes a `stops` property which is an array of
 * definitions for each `<stop>` child node.
 *
 * See {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Element/linearGradient} for more
 * information about the `<linearGradient>` element.
 *
 * @typedef {object} LinearGradientDefinition
 * @property {string} [gradientTransform] - A transform from the gradient coordinate system to the
 * target coordinate system. See {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/gradientTransform}.
 * @property {'userSpaceOnUse' | 'objectBoundingBox'} [gradientUnits] - The coordinate system used.
 * for the coordinate attributes. See {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/gradientUnits}.
 * @property {'pad' | 'reflect' | 'repeat'} [spreadMethod] - The method used to fill a shape beyond
 * the defined edges of a gradient. See {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/spreadMethod}.
 * @property {StopDefinition[]} [stops] - The colors of the gradient, and the position of each
 * color along the gradient vector.
 * @property {'linear'} type - The type of the gradient.
 * @property {SvgLength} [x1] - The x coordinate of the starting point of the vector gradient.
 * @property {SvgLength} [x2] - The x coordinate of the ending point of the vector gradient.
 * @property {SvgLength} [y1] - The y coordinate of the starting point of the vector gradient.
 * @property {SvgLength} [y2] - The y coordinate of the ending point of the vector gradient.
 */

/**
 * A definition for a `<radialGradient>` SVG element. This definition includes all supported
 * `<radialGradient>` attributes, and it includes a `stops` property which is an array of
 * definitions for each `<stop>` child node.
 *
 * See {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Element/radialGradient} for more
 * information about the `<radialGradient>` element.
 *
 * @typedef {object} RadialGradientDefinition
 * @property {SvgLength} [cx] - The x coordinate of the end circle of the radial gradiant.
 * @property {SvgLength} [cy] - The y coordinate of the end circle of the radial gradient.
 * @property {SvgLength} [fr] - The radius of the start circle of the radial gradient.
 * @property {SvgLength} [fx] - The x coordinate of the start circle of the radial gradient.
 * @property {SvgLength} [fy] - The y coordinate of the start circle of the radial gradient.
 * @property {string} [gradientTransform] - A transform from the gradient coordinate system to the
 * target coordinate system. See {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/gradientTransform}.
 * @property {'userSpaceOnUse' | 'objectBoundingBox'} [gradientUnits] - The coordinate system used
 * for the coordinate attributes. See {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/gradientUnits}.
 * @property {SvgLength} [r] - The radius of the end circle of the radial gradient.
 * @property {'pad' | 'reflect' | 'repeat'} [spreadMethod] - The method used to fill a shape beyond
 * the defined edges of a gradient. See {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/spreadMethod}.
 * @property {StopDefinition[]} [stops] - The colors of the gradient, and the position of each
 * color along the gradient vector.
 * @property {'radial'} type - The type of the gradient.
 */

function createLogoViewer(
  container,
  renderScene,
  {
    followMouse = false,
    followMotion = false,
    slowDrift = false,
    lazyRender = true,
  } = {},
) {
  let shouldRender = true;
  const mouse = {
    x: 0,
    y: 0,
  };
  const lookCurrent = [0, 0];
  const lookRate = 0.3;

  // closes over scene state
  const renderCurrentScene = () => {
    updateLookCurrent();
    renderScene(lookCurrent, slowDrift);
  };

  function setLookAtTarget(target) {
    const bounds = container.getBoundingClientRect();
    mouse.x = 1.0 - (2.0 * (target.x - bounds.left)) / bounds.width;
    mouse.y = 1.0 - (2.0 * (target.y - bounds.top)) / bounds.height;
  }

  function stopAnimation() {
    shouldRender = false;
  }

  function startAnimation() {
    shouldRender = true;
  }

  function setFollowMouse(state) {
    // eslint-disable-next-line no-param-reassign
    followMouse = state;
  }

  function setFollowMotion(state) {
    // eslint-disable-next-line no-param-reassign
    followMotion = state;
  }

  window.addEventListener('mousemove', function (ev) {
    if (!shouldRender) {
      startAnimation();
    }

    if (followMouse) {
      setLookAtTarget({
        x: ev.clientX,
        y: ev.clientY,
      });
      renderCurrentScene();
    }
  });

  window.addEventListener('deviceorientation', function (event) {
    if (!shouldRender) {
      startAnimation();
    }

    if (followMotion) {
      // gamma: left to right
      const leftToRight = event.gamma;
      // beta: front back motion
      const frontToBack = event.beta;
      // x offset: needed to correct the intial position
      const xOffset = 200;
      // y offset: needed to correct the intial position
      const yOffset = -300;
      // acceleration
      const acceleration = 10;

      setLookAtTarget({
        x: xOffset + leftToRight * acceleration,
        y: yOffset + frontToBack * acceleration,
      });
      renderCurrentScene();
    }
  });

  function lookAtAndRender(target) {
    // update look target
    setLookAtTarget(target);
    // this should prolly just call updateLookCurrent or set lookCurrent values to eaxactly lookTarget
    // but im not really sure why its different, so im leaving it alone
    lookCurrent[0] = mouse.x;
    lookCurrent[1] = mouse.y + 0.085 / lookRate;
    renderCurrentScene();
  }

  function renderLoop() {
    if (!shouldRender) {
      return;
    }
    window.requestAnimationFrame(renderLoop);
    renderCurrentScene();
  }

  function updateLookCurrent() {
    const li = 1.0 - lookRate;
    lookCurrent[0] = li * lookCurrent[0] + lookRate * mouse.x;
    lookCurrent[1] = li * lookCurrent[1] + lookRate * mouse.y + 0.085;
  }

  if (lazyRender) {
    renderCurrentScene();
  } else {
    renderLoop();
  }

  return {
    container,
    lookAt: setLookAtTarget,
    setFollowMouse,
    setFollowMotion,
    stopAnimation,
    startAnimation,
    lookAtAndRender,
    renderCurrentScene,
  };
}

function loadModelFromJson(
  modelJson,
  createSvgPolygon = createStandardModelPolygon,
) {
  const vertCount = modelJson.positions.length;
  const positions = new Float32Array(3 * vertCount);
  const transformed = new Float32Array(3 * vertCount);
  const { polygons, polygonsByChunk } = createPolygonsFromModelJson(
    modelJson,
    createSvgPolygon,
  );
  positionsFromModel(positions, modelJson);
  const updatePositions = createPositionUpdater(
    positions,
    transformed,
    vertCount,
  );
  const modelObj = {
    updatePositions,
    positions,
    transformed,
    polygons,
    polygonsByChunk,
  };
  return modelObj;
}

function createModelRenderer(container, cameraDistance, modelObj) {
  const { updatePositions, transformed, polygons } = modelObj;

  for (const polygon of polygons) {
    container.appendChild(polygon.svg);
  }

  const computeMatrix = createMatrixComputer(cameraDistance);
  const updateFaces = createFaceUpdater(container, polygons, transformed);

  return (rect, lookPos, slowDrift) => {
    const matrix = computeMatrix(rect, lookPos, slowDrift);
    updatePositions(matrix);
    updateFaces(rect, container, polygons, transformed);
  };
}

function positionsFromModel(positions, modelJson) {
  const pp = modelJson.positions;
  let ptr = 0;
  for (let i = 0; i < pp.length; ++i) {
    const p = pp[i];
    for (let j = 0; j < 3; ++j) {
      positions[ptr] = p[j];
      ptr += 1;
    }
  }
}

function createPolygonsFromModelJson(modelJson, createSvgPolygon) {
  const polygons = [];
  const polygonsByChunk = modelJson.chunks.map((chunk, index) => {
    const { faces } = chunk;
    return faces.map((face) => {
      const svgPolygon = createSvgPolygon(chunk, {
        gradients: modelJson.gradients,
        index,
        masks: modelJson.masks,
      });
      const polygon = new Polygon(svgPolygon, face);
      polygons.push(polygon);
      return polygon;
    });
  });
  return { polygons, polygonsByChunk };
}

/**
 * Create an SVG `<polygon> element.
 *
 * This polygon is assigned the correct `fill` and `stroke` attributes, according to the chunk
 * definition provided. But the `points` attribute is always set to a dummy value, as it gets reset
 * later to the correct position during each render loop.
 *
 * @param {object} chunk - The definition for the chunk of the model this polygon is a part of.
 * This includes the color or gradient to apply to the polygon.
 * @param {object} options - Polygon options.
 * @param {(LinearGradientDefinition | RadialGradientDefinition)[]} [options.gradients] - The set of
 * all gradient definitions used in this model.
 * @param options.index - The index for the chunk this polygon is found in.
 * @returns {Element} The `<polygon>` SVG element.
 */
function createStandardModelPolygon(chunk, { gradients = {}, index, masks }) {
  const svgPolygon = createNode('polygon');

  if (chunk.gradient && chunk.color) {
    throw new Error(
      `Both gradient and color for chunk '${index}'. These options are mutually exclusive.`,
    );
  } else if (chunk.gradient) {
    const gradientId = chunk.gradient;
    if (!gradients[gradientId]) {
      throw new Error(`Gradient ID not found: '${gradientId}'`);
    }

    setAttribute(svgPolygon, 'fill', `url('#${gradientId}')`);
    setAttribute(svgPolygon, 'stroke', `url('#${gradientId}')`);
  } else {
    const fill =
      typeof chunk.color === 'string' ? chunk.color : `rgb(${chunk.color})`;
    setAttribute(svgPolygon, 'fill', fill);
    setAttribute(svgPolygon, 'stroke', fill);
  }

  if (chunk.mask) {
    if (!masks[chunk.mask]) {
      throw new Error(`Mask ID not found: '${chunk.mask}'`);
    }
    setAttribute(svgPolygon, 'mask', `url('#${chunk.mask}')`);
  }

  setAttribute(svgPolygon, 'points', '0,0, 10,0, 0,10');
  return svgPolygon;
}

function createMatrixComputer(distance) {
  const objectCenter = new Float32Array(3);
  const up = new Float32Array([0, 1, 0]);
  const projection = new Float32Array(16);
  const model = new Float32Array(16);
  const view = lookAt(
    new Float32Array(16),
    new Float32Array([0, 0, distance]),
    objectCenter,
    up,
  );
  const invView = invert(new Float32Array(16), view);
  const invProjection = new Float32Array(16);
  const target = new Float32Array(3);
  const transformedMatrix = new Float32Array(16);

  const X = new Float32Array([1, 0, 0]);
  const Y = new Float32Array([0, 1, 0]);
  const Z = new Float32Array([0, 0, 1]);

  return (rect, lookPos, slowDrift) => {
    const viewportWidth = rect.width;
    const viewportHeight = rect.height;
    perspective(
      projection,
      Math.PI / 4.0,
      viewportWidth / viewportHeight,
      100.0,
      1000.0,
    );
    invert(invProjection, projection);
    target[0] = lookPos[0];
    target[1] = lookPos[1];
    target[2] = 1.2;
    transform(target, target, invProjection);
    transform(target, target, invView);
    lookAt(model, objectCenter, target, up);

    // this shouldnt operate directly on the matrix/model,
    // it should likely operate on the lookPos
    // if we do want to operate on the matrix/model, it shouldnt happen here
    if (slowDrift) {
      const time = Date.now() / 1000.0;
      rotate(model, model, 0.1 + Math.sin(time / 3) * 0.2, X);
      rotate(model, model, -0.1 + Math.sin(time / 2) * 0.03, Z);
      rotate(model, model, 0.5 + Math.sin(time / 3) * 0.2, Y);
    }

    multiply(transformedMatrix, projection, view);
    multiply(transformedMatrix, transformedMatrix, model);

    return transformedMatrix;
  };
}

function createPositionUpdater(positions, transformed, vertCount) {
  return (M) => {
    const m00 = M[0];
    const m01 = M[1];
    const m02 = M[2];
    const m03 = M[3];
    const m10 = M[4];
    const m11 = M[5];
    const m12 = M[6];
    const m13 = M[7];
    const m20 = M[8];
    const m21 = M[9];
    const m22 = M[10];
    const m23 = M[11];
    const m30 = M[12];
    const m31 = M[13];
    const m32 = M[14];
    const m33 = M[15];

    for (let i = 0; i < vertCount; ++i) {
      const x = positions[3 * i];
      const y = positions[3 * i + 1];
      const z = positions[3 * i + 2];

      const tw = x * m03 + y * m13 + z * m23 + m33;
      transformed[3 * i] = (x * m00 + y * m10 + z * m20 + m30) / tw;
      transformed[3 * i + 1] = (x * m01 + y * m11 + z * m21 + m31) / tw;
      transformed[3 * i + 2] = (x * m02 + y * m12 + z * m22 + m32) / tw;
    }
  };
}

function compareZ(a, b) {
  return b.zIndex - a.zIndex;
}

function createFaceUpdater(container, polygons, transformed) {
  const toDraw = [];
  return (rect) => {
    let i;
    const w = rect.width;
    const h = rect.height;
    toDraw.length = 0;
    for (i = 0; i < polygons.length; ++i) {
      const poly = polygons[i];
      const { indices } = poly;

      const i0 = indices[0];
      const i1 = indices[1];
      const i2 = indices[2];
      const ax = transformed[3 * i0];
      const ay = transformed[3 * i0 + 1];
      const bx = transformed[3 * i1];
      const by = transformed[3 * i1 + 1];
      const cx = transformed[3 * i2];
      const cy = transformed[3 * i2 + 1];
      const det = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
      if (det < 0) {
        continue;
      }

      const points = [];
      let zmax = -Infinity;
      let zmin = Infinity;
      const element = poly.svg;
      for (let j = 0; j < 3; ++j) {
        const idx = indices[j];
        points.push(
          `${0.5 * w * (1.0 - transformed[3 * idx])},${
            0.5 * h * (1.0 - transformed[3 * idx + 1])
          }`,
        );
        const z = transformed[3 * idx + 2];
        zmax = Math.max(zmax, z);
        zmin = Math.min(zmin, z);
      }
      poly.zIndex = zmax + 0.25 * zmin;
      const joinedPoints = points.join(' ');

      if (joinedPoints.indexOf('NaN') === -1) {
        setAttribute(element, 'points', joinedPoints);
      }

      toDraw.push(poly);
    }
    toDraw.sort(compareZ);

    const newPolygons = toDraw.map((poly) => poly.svg);
    const defs = container.getElementsByTagName('defs');
    const maskChildren = container.getElementsByTagName('mask');
    if (container.replaceChildren) {
      container.replaceChildren(...defs, ...maskChildren, ...newPolygons);
    } else {
      replaceChildrenPonyfill.bind(container)(
        ...defs,
        ...maskChildren,
        ...newPolygons,
      );
    }
  };
}

function calculateSizingOptions(options = {}) {
  let width = options.width || 400;
  let height = options.height || 400;

  if (!options.pxNotRatio) {
    width = Math.floor(window.innerWidth * (options.width || 0.25));
    height = Math.floor(window.innerHeight * options.height || width);

    if ('minWidth' in options && width < options.minWidth) {
      width = options.minWidth;
      height = Math.floor((options.minWidth * options.height) / options.width);
    }
  }
  return { width, height };
}

function createNode(type) {
  return document.createElementNS(SVG_NS, type);
}

function setAttribute(node, attribute, value) {
  node.setAttributeNS(null, attribute, value);
}

function svgElementToSvgImageContent(svgElement) {
  const inner = svgElement.innerHTML;
  const head =
    `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> ` +
    `<svg width="521px" height="521px" version="1.1" baseProfile="full" xmlns="${SVG_NS}" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events">`;
  const foot = '</svg>';
  const content = head + inner + foot;
  return content;
}

function Polygon(svg, indices) {
  this.svg = svg;
  this.indices = indices;
  this.zIndex = 0;
}

/**
 * Parse gradient definitions and construct them in the DOM.
 *
 * Both `<linearGradient>` and `<radialGradient>` are supported. All gradients get added to a
 * `<defs>` element that is added as a direct child of the container element.
 *
 * @param {Element} container - The `<svg>` HTML element that the definitions should be added to.
 * @param {(LinearGradientDefinition | RadialGradientDefinition)[]} [gradients] - The gradient definitions.
 */
function setGradientDefinitions(container, gradients) {
  if (!gradients || Object.keys(gradients).length === 0) {
    return;
  }

  const defsContainer = createNode('defs');

  const linearCoordinateAttributes = ['x1', 'x2', 'y1', 'y2'];
  const radialCoordinateAttributes = ['cx', 'cy', 'fr', 'fx', 'fy', 'r'];
  const commonAttributes = [
    'gradientTransform',
    'gradientUnits',
    'spreadMethod',
    'stops',
    'type',
  ];
  const allLinearAttributes = [
    ...linearCoordinateAttributes,
    ...commonAttributes,
  ];
  const allRadialAttributes = [
    ...radialCoordinateAttributes,
    ...commonAttributes,
  ];

  for (const [gradientId, gradientDefinition] of Object.entries(gradients)) {
    let gradient;
    if (gradientDefinition.type === 'linear') {
      gradient = createNode('linearGradient');

      const unsupportedLinearAttribute = Object.keys(gradientDefinition).find(
        (attribute) => !allLinearAttributes.includes(attribute),
      );
      if (unsupportedLinearAttribute) {
        throw new Error(
          `Unsupported linear gradient attribute: '${unsupportedLinearAttribute}'`,
        );
      } else if (
        linearCoordinateAttributes.some(
          (attributeName) => gradientDefinition[attributeName] !== undefined,
        )
      ) {
        const missingAttributes = linearCoordinateAttributes.filter(
          (attributeName) => gradientDefinition[attributeName] === undefined,
        );
        if (missingAttributes.length > 0) {
          throw new Error(
            `Missing coordinate attributes: '${missingAttributes.join(', ')}'`,
          );
        }

        for (const attribute of linearCoordinateAttributes) {
          if (typeof gradientDefinition[attribute] !== 'string') {
            throw new Error(
              `Type of '${attribute}' option expected to be 'string'. Instead received type '${typeof gradientDefinition[
                attribute
              ]}'`,
            );
          }
          setAttribute(gradient, attribute, gradientDefinition[attribute]);
        }
      }
    } else if (gradientDefinition.type === 'radial') {
      gradient = createNode('radialGradient');

      const presentCoordinateAttributes = radialCoordinateAttributes.filter(
        (attributeName) => gradientDefinition[attributeName] !== undefined,
      );
      const unsupportedRadialAttribute = Object.keys(gradientDefinition).find(
        (attribute) => !allRadialAttributes.includes(attribute),
      );
      if (unsupportedRadialAttribute) {
        throw new Error(
          `Unsupported radial gradient attribute: '${unsupportedRadialAttribute}'`,
        );
      } else if (presentCoordinateAttributes.length > 0) {
        for (const attribute of presentCoordinateAttributes) {
          if (typeof gradientDefinition[attribute] !== 'string') {
            throw new Error(
              `Type of '${attribute}' option expected to be 'string'. Instead received type '${typeof gradientDefinition[
                attribute
              ]}'`,
            );
          }
          setAttribute(gradient, attribute, gradientDefinition[attribute]);
        }
      }
    } else {
      throw new Error(
        `Unsupported gradient type: '${gradientDefinition.type}'`,
      );
    }

    // Set common attributes
    setAttribute(gradient, 'id', gradientId);
    if (gradientDefinition.gradientUnits !== undefined) {
      if (
        !['userSpaceOnUse', 'objectBoundingBox'].includes(
          gradientDefinition.gradientUnits,
        )
      ) {
        throw new Error(
          `Unrecognized value for 'gradientUnits' attribute: '${gradientDefinition.gradientUnits}'`,
        );
      }
      setAttribute(gradient, 'gradientUnits', gradientDefinition.gradientUnits);
    }

    if (gradientDefinition.gradientTransform !== undefined) {
      if (typeof gradientDefinition.gradientTransform !== 'string') {
        throw new Error(
          `Type of 'gradientTransform' option expected to be 'string'. Instead received type '${typeof gradientDefinition.gradientTransform}'`,
        );
      }

      setAttribute(
        gradient,
        'gradientTransform',
        gradientDefinition.gradientTransform,
      );
    }

    if (gradientDefinition.spreadMethod !== undefined) {
      if (
        !['pad', 'reflect', 'repeat'].includes(gradientDefinition.spreadMethod)
      ) {
        throw new Error(
          `Unrecognized value for 'spreadMethod' attribute: '${gradientDefinition.spreadMethod}'`,
        );
      }
      setAttribute(gradient, 'spreadMethod', gradientDefinition.spreadMethod);
    }

    if (gradientDefinition.stops !== undefined) {
      if (!Array.isArray(gradientDefinition.stops)) {
        throw new Error(`The 'stop' attribute must be an array`);
      }

      for (const stopDefinition of gradientDefinition.stops) {
        if (typeof stopDefinition !== 'object') {
          throw new Error(
            `Each entry in the 'stop' attribute must be an object. Instead received type '${typeof stopDefinition}'`,
          );
        }
        const stop = createNode('stop');

        if (stopDefinition.offset !== undefined) {
          setAttribute(stop, 'offset', stopDefinition.offset);
        }

        if (stopDefinition['stop-color'] !== undefined) {
          setAttribute(stop, 'stop-color', stopDefinition['stop-color']);
        }

        if (stopDefinition['stop-opacity'] !== undefined) {
          setAttribute(stop, 'stop-opacity', stopDefinition['stop-opacity']);
        }

        gradient.appendChild(stop);
      }
    }

    defsContainer.appendChild(gradient);
  }

  container.appendChild(defsContainer);
}

/**
 * The properties of a single SVG mask.
 *
 * @typedef MaskDefinition
 * @property {string} color - The color or gradient to apply to the mask.
 */

/**
 * Parse mask definitions and construct them in the DOM.
 *
 * The `<mask>` element contains a single rectangle that should cover the full extent of the SVG
 * model. The color of this rectangle can be set to single color or a gradient. Anything the mask
 * is applied to will be invisible if under a black pixel, visible if under a white pixel, and
 * partially translucent if under a pixel that is between white and black.
 *
 * Later this could be extended to include custom paths and other shapes, rather than just a single
 * rectangle.
 *
 * @param options - The mask options.
 * @param {Element} options.container - The `<svg>` HTML element that the mask should be added to.
 * @param {Record<string, MaskDefinition>} [options.masks] - The gradient definitions.
 * @param {number} options.height - The height of the SVG container.
 * @param {number} options.width - The width of the SVG container.
 */
function setMaskDefinitions({ container, masks, height, width }) {
  if (!masks || Object.keys(masks).length === 0) {
    return;
  }

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

    setAttribute(maskedRect, 'fill', maskDefinition.color);
    mask.appendChild(maskedRect);

    container.appendChild(mask);
  }
}
