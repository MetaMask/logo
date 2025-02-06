const MersenneTwister = require('mersenne-twister');
const {
  calculateSizingOptions,
  createLogoViewer,
  defaultCameraDistance,
  loadModelFromJson,
  createModelRenderer,
  createNode,
  setAttribute,
  svgElementToSvgImageContent,
} = require('../../../src/util');
const foxJson = require('../../../data/fox.json');

let colorSeed = pickColorSeed();
const colors = [
  '#01888C', // teal
  '#FC7500', // bright orange
  '#034F5D', // dark teal
  '#F73F01', // orangered
  '#FC1960', // magenta
  '#C7144C', // raspberry
  '#F3C100', // goldenrod
  '#1598F2', // lightning blue
  '#2465E1', // sail blue
  '#F19E02', // gold
];

let cycling = false;
let cycleInterval;
function toggleCycle(modelObj) {
  if (cycling && cycleInterval) {
    console.dir(cycleInterval);
    clearInterval(cycleInterval);
    cycling = false;
  } else if (!cycling) {
    cycleInterval = setInterval(() => recolor(modelObj), 500);
    cycling = true;
  }
}

document.addEventListener('keypress', (event) => {
  if (event.keyCode === 99) {
    // the C key
    saveImage();
  }
});

function saveImage() {
  const svg = document.querySelector('svg');
  const content = svgElementToSvgImageContent(svg);
  download(content, `custom-fox-${colorSeed}.svg`, 'image/svg+xml');
}

const viewer = createRecolorLogo({
  width: 0.4,
  height: 0.4,
  followMouse: true,
  followMotion: true,
});

const foxDiv = document.querySelector('body div.fox');
foxDiv.appendChild(viewer.container);

function createRecolorLogo(options) {
  const cameraDistance = options.cameraDistance || defaultCameraDistance;
  const { height, width } = calculateSizingOptions(options);

  const container = createNode('svg');
  setAttribute(container, 'width', `${width}px`);
  setAttribute(container, 'height', `${height}px`);
  document.body.appendChild(container);

  const modelObj = loadModelFromJson(foxJson);
  const renderFox = createModelRenderer(container, cameraDistance, modelObj);
  const renderScene = (lookCurrent, slowDrift) => {
    const rect = container.getBoundingClientRect();
    renderFox(rect, lookCurrent, slowDrift);
  };

  const saveButton = document.querySelector('button.save');
  saveButton.addEventListener('click', saveImage);
  const recolorButton = document.querySelector('button.recolor');
  recolorButton.addEventListener('click', () => recolor(modelObj));
  const cycleButton = document.querySelector('button.cycle');
  cycleButton.addEventListener('click', () => toggleCycle(modelObj));

  return createLogoViewer(
    container,
    renderScene,
    Object.assign({ cameraDistance }, options),
  );
}

function recolor(modelObj) {
  colorSeed = pickColorSeed();
  const twister = new MersenneTwister(colorSeed);
  const { polygonsByChunk } = modelObj;
  for (const polygons of polygonsByChunk) {
    const randomIndex = Math.floor(twister.random() * colors.length);
    const color = colors[randomIndex];
    for (const polygon of polygons) {
      setAttribute(polygon.svg, 'fill', color);
      setAttribute(polygon.svg, 'stroke', color);
    }
  }
  viewer.renderCurrentScene();
}

function pickColorSeed() {
  return Math.floor(Math.random() * 10000000);
}

// Function to download data to a file
function download(data, filename, type) {
  const file = new Blob([data], { type });
  // IE10+
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(file, filename);
  } else {
    // Others
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}
