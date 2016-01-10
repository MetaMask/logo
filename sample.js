var viewer = require('./');

// To render with fixed dimensions:
// viewer({
//   pxNotRatio: true, // Dictates whether width & height are px or multiplied
//   width: 500,
//   height: 400,
//   targetDivId: 'modelDivLarge'
// })
//

viewer({
  targetDivId: 'logo-container',
  followMouse: !detectMobile(),
  // Dictates whether width & height are px or multiplied
  pxNotRatio: false,
  width: 0.4,
  height: 0.4,
  // To render with fixed dimensions:
  // pxNotRatio: true,
  // width: 500,
  // height: 400,
})

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