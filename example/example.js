const copy = require('copy-to-clipboard')

document.addEventListener('keypress', function (event) {
  if (event.keyCode === 99) { // the c key
    const svg = document.querySelector('svg')
    const inner = svg.innerHTML
    const head = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ' +
    '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> ' +
    '<svg width="521px" height="521px" version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events">'
    const foot = '</svg>'

    const full = head + inner + foot

    copy(full)
  }
})

const createViewer = require('..')

const viewer = createViewer({
  width: 0.4,
  height: 0.4,
  followMouse: true,
  followMotion: true,
})

document.body.appendChild(viewer.container)
