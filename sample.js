var viewer = require('./');

// To render with fixed dimensions:
// viewer({
//   pxNotRatio: true, // Dictates whether width & height are px or multiplied
//   width: 500,
//   height: 400,
//   targetDivId: 'modelDivLarge'
// })
//

function detectMobile() {
  return (
      navigator.userAgent.match(/Android/i)
   || navigator.userAgent.match(/webOS/i)
   || navigator.userAgent.match(/iPhone/i)
   || navigator.userAgent.match(/iPad/i)
   || navigator.userAgent.match(/iPod/i)
   || navigator.userAgent.match(/BlackBerry/i)
   || navigator.userAgent.match(/Windows Phone/i)
  )
}

// To render as a ratio of the screen's width:
if (detectMobile()) { // Mobile devices with no mouse to follow
  viewer({
    pxNotRatio: false, // Dictates whether width & height are px or multiplied
    width: 0.9,
    height: 0.9,
    targetDivId: 'modelDivLarge',
    followMouse: false
  })
} else {  // Desktop devices with a mouse to follow
  viewer({
    pxNotRatio: false, // Dictates whether width & height are px or multiplied
    width: 0.9,
    height: 0.9,
    targetDivId: 'modelDivLarge',
    followMouse: true
  })
}

