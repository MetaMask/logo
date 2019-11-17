var createViewer = require('../index')

const colorSeed = Math.floor(Math.random() * 100000)

window.addEventListener('load', () => {
  const saveButton = document.querySelector('button.save')
  saveButton.addEventListener('click', saveImage)

  const recolorButton = document.querySelector('button.recolor')
  recolorButton.addEventListener('click', startRecolor)
})

document.addEventListener('keypress', (event) => {
  if (event.keyCode === 99) { // the C key
    saveImage()
  }
})

function saveImage () {
    var svg = document.querySelector('svg')
    var inner = svg.innerHTML
    var head = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" '
    + '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> '
    + '<svg width="521px" height="521px" version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events">'
   var foot = '</svg>'

   var full = head + inner + foot;
   download(full, `custom-fox-${colorSeed}.svg`, 'image/svg+xml')
}

var viewer = createViewer({
  width: 0.4,
  height: 0.4,
  followMouse: true,
  followMotion: true,
  // colorSeed,
})

const recolorDuration = 20000
let recolorStartTime = 0
let recolorRemaining = 0
function startRecolor () {
  recolorStartTime = Date.now()
  recolorRemaining = recolorDuration
  const colorSeed = Math.floor(Math.random() * 10000000)
  recolor(colorSeed)
}
function recolor(colorSeed) {
  const recolorCompleted = Date.now() - recolorStartTime
  recolorRemaining = recolorDuration - recolorCompleted

  if (recolorRemaining <= 0) {
    return viewer.recolor({
      colorSeed,
    })
  }

  const endTime = recolorDuration + recolorStartTime;

  const fractionComplete = (recolorDuration-recolorRemaining) / recolorDuration

  const oddsOfPolygonVisibility = ((Math.cos(fractionComplete * 2) / -2) + 0.5)

  viewer.recolor({
    colorSeed,
    oddsOfPolygonVisibility,
    colorByBlock: fractionComplete > 0.5,
    randomness: recolorRemaining / recolorDuration,
  })

  const delay = (Math.cos(fractionComplete * 2)/2 + 0.5) * 100
  setTimeout(() => {
    window.requestAnimationFrame(() => recolor(colorSeed))
  }, delay)
}

const foxDiv = document.querySelector('body div.fox')
foxDiv.appendChild(viewer.container)

// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

