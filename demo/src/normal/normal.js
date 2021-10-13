const copy = require('copy-to-clipboard');
const createViewer = require('../../..');
const { svgElementToSvgImageContent } = require('../../../util');

document.addEventListener('keypress', function (event) {
  if (event.keyCode === 99) {
    // the c key
    const svg = document.querySelector('svg');
    const content = svgElementToSvgImageContent(svg);
    copy(content);
  }
});

createViewer({
  width: 0.4,
  height: 0.4,
  followMouse: true,
  followMotion: true,
});
