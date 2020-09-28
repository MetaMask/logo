# Metamask Logo

A browserifyable 3d metamask logo. [Live demo](https://metamask.github.io/MetaMask/logo/).

This repo can both be included as a browserifiable module, and includes a sample app.

The sample app address is `index.html`.
The sample app javascript is `bundle.js`, which is built from `sample.js` using the `build` task (see the `package.json`).

## API

```javascript
const ModelViewer = require('@metamask/logo')

// To render with fixed dimensions:
const viewer = ModelViewer({

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
const container = document.getElementById('logo-container')
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

## Running Example

First, rebuild `browserify example/example.js -o bundle.js`.
Then, run a local server in this folder and visit it. For example, `http-server`.
