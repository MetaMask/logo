var viewer = require('./');

// To render with fixed dimensions:
// viewer({
//   pxNotRatio: true, // Dictates whether width & height are px or multiplied
//   width: 500,
//   height: 400,
//   targetDivId: 'modelDivLarge'
// })

// To render as a ratio of the screen's width:
viewer({
  pxNotRatio: false, // Dictates whether width & height are px or multiplied
  width: 0.9,
  height: 0.9,
  targetDivId: 'modelDivLarge'
})
