# Metamask Logo

A browserifyable 3d metamask logo. [Live demo](http://metamask.github.io/metamask-logo/).

This repo can both be included as a browserifiable module, and includes a sample app.

The sample app address is `index.html`.
The sample app javascript is `bundle.js`, which is built from `sample.js` using the `build` task (see the `package.json`).

## API
```javascript
var ModelViewer = require('metamask-logo')

// To render with fixed dimensions:
var viewer = ModelViewer({

  // Dictates whether width & height are px or multiplied
  pxNotRatio: true,
  width: 500,
  height: 400,
  // pxNotRatio: false,
  // width: 0.9,
  // height: 0.9,

  // To make the face follow the mouse.
  followMouse: false,

  // head should slowly drift (overrides lookAt)
  slowDrift: false,

})

// add viewer to DOM
var container = document.getElementById('logo-container')
container.appendChild(viewer.container)

// look at something on the page
viewer.lookAt({
  x: 100,
  y: 100,
})

// enable mouse follow
viewer.setFollowMouse(true)

// deallocate nicely
viewer.stopAnimation()
```
