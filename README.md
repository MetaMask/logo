# Metamask Logo

A browserifyable 3d metamask logo.

This repo can both be included as a browserifiable module, and includes a sample app.

The sample app address is `index.html`.
The sample app javascript is `bundle.js`, which is built from `sample.js` using the `build` task (see the `package.json`).

## API
```javascript
var viewer = require('metamask-logo');

// To render with fixed dimensions:
viewer({
   pxNotRatio: true, // Dictates whether width & height are px or multiplied
   width: 500,
   height: 400,
   targetDivId: 'modelDivLarge'
})

// To render as a ratio of the screen's width:
viewer({
  pxNotRatio: false, // Dictates whether width & height are px or multiplied
  width: 0.9,
  height: 0.9,
  targetDivId: 'modelDivLarge',
  followMouse: true  // To make the face follow the mouse.
})
```
