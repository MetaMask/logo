const {
  calculateSizingOptions,
  createLogoViewer,
  defaultCameraDistance,
  loadModelFromJson,
  createModelRenderer,
  createNode,
  setAttribute,
} = require('../../../src/util');
const foxJson = require('../../../data/fox.json');

createDistortedLogo({
  width: 0.4,
  height: 0.4,
  followMouse: true,
  followMotion: true,
  lazyRender: false,
});

function createDistortedLogo(options) {
  const cameraDistance = options.cameraDistance || defaultCameraDistance;
  const { height, width } = calculateSizingOptions(options);

  const container = createNode('svg');
  setAttribute(container, 'width', `${width}px`);
  setAttribute(container, 'height', `${height}px`);
  document.body.appendChild(container);

  const modelObj = loadModelFromJson(foxJson);
  const { positions } = modelObj;
  //  store a copy of positions
  const origPositions = positions.slice();

  const distortionMethods = {
    Glitch: distortGlitch,
    Fold: distortFold,
    Grow: distortGrow,
  };
  let applyDistortion = Object.values(distortionMethods)[0];

  Object.entries(distortionMethods).forEach(([description, distortionFn]) => {
    const button = document.createElement('button');
    button.innerText = description;
    button.addEventListener('click', () => {
      applyDistortion = distortionFn;
    });
    document.body.appendChild(button);
  });

  const renderFox = createModelRenderer(container, cameraDistance, modelObj);
  const renderScene = (lookCurrent, slowDrift) => {
    const rect = container.getBoundingClientRect();
    applyDistortion(positions, origPositions);
    renderFox(rect, lookCurrent, slowDrift);
  };

  return createLogoViewer(
    container,
    renderScene,
    Object.assign({ cameraDistance }, options),
  );
}

// glitch up and down
function distortGlitch(positions, origPositions) {
  const pointCount = positions.length / 3;
  for (let polygonIndex = 0; polygonIndex < pointCount; polygonIndex++) {
    const x = polygonIndex * 3 + 0;
    const y = polygonIndex * 3 + 1;
    const z = polygonIndex * 3 + 2;
    // strong along x
    positions[x] = origPositions[x] + 20 * getSinIntensity() * Math.random();
    positions[y] = origPositions[y] + 20 * getSinIntensity() * Math.random();
    positions[z] = origPositions[z] + 20 * getSinIntensity() * Math.random();
  }
}

// bug: grow head slowly?
function distortGrow(positions, origPositions) {
  const progress = getSinIntensity();
  const pointCount = positions.length / 3;
  const polygonProgressWidth = 1 / pointCount;
  for (let polygonIndex = 0; polygonIndex < pointCount; polygonIndex++) {
    // calculate the current progress for each polygon
    const polygonProgressStart = polygonIndex * polygonProgressWidth;
    const polygonProgressEnd = polygonProgressStart + polygonProgressWidth;
    const polygonProgressUncapped =
      (progress - polygonProgressStart) /
      (polygonProgressEnd - polygonProgressStart);
    const polygonProgress = Math.min(Math.max(polygonProgressUncapped, 0), 1);
    // the previous polygon (self referential for the first one)
    const prevPolygonIndex = Math.max(polygonIndex, polygonIndex - 1);
    const prevX = origPositions[prevPolygonIndex * (3 + 0)];
    const prevY = origPositions[prevPolygonIndex * (3 + 1)];
    const prevZ = origPositions[prevPolygonIndex * (3 + 2)];
    const x = polygonIndex * (3 + 0);
    const y = polygonIndex * (3 + 1);
    const z = polygonIndex * (3 + 2);
    // strong along x
    positions[x] = prevX + polygonProgress * origPositions[x];
    positions[y] = prevY + polygonProgress * origPositions[y];
    positions[z] = prevZ + polygonProgress * origPositions[z];
  }
}

// bug: grow head slowly?
function distortFold(positions, origPositions) {
  const progress = getSinIntensity(5000);
  const pointCount = positions.length / 3;
  const polygonProgressWidth = 1 / pointCount;
  // reset positions
  Object.assign(positions, origPositions);
  for (let polygonIndex = 0; polygonIndex < pointCount; polygonIndex++) {
    // calculate the current progress for each polygon
    const polygonProgressStart = polygonIndex * polygonProgressWidth;
    const polygonProgressEnd = polygonProgressStart + polygonProgressWidth;
    const polygonProgressUncapped =
      (progress - polygonProgressStart) /
      (polygonProgressEnd - polygonProgressStart);
    const polygonProgress = Math.min(Math.max(polygonProgressUncapped, 0), 1);
    // the previous polygon (self referential for the first one)
    const prevPolygonIndex = Math.max(0, polygonIndex - 1);
    const prevX = positions[prevPolygonIndex * (3 + 0)];
    const prevY = positions[prevPolygonIndex * (3 + 1)];
    const prevZ = positions[prevPolygonIndex * (3 + 2)];
    const x = polygonIndex * (3 + 0);
    const y = polygonIndex * (3 + 1);
    const z = polygonIndex * (3 + 2);
    // console.log(polygonIndex, polygonProgress)
    positions[x] = prevX + polygonProgress * (origPositions[x] - prevX);
    positions[y] = prevY + polygonProgress * (origPositions[y] - prevY);
    positions[z] = prevZ + polygonProgress * (origPositions[z] - prevZ);
  }
}

// sin between 0-1
function getSinIntensity(speed = 1000) {
  return (Math.sin(Date.now() / speed) + 1) / 2;
}
