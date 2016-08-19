window.THREE = require('three.js')
const Looker = require('./lib/look-at')
const objMtlLoader = require('./lib/loader')

module.exports = function(opts){

  // check for webgl compatibility
  try {
    var canvas = document.createElement('canvas')
    var context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!context) {
      var staticLogo = document.createElement('img')
      staticLogo.src = './icon-512.png'
      staticLogo.width = opts.width
      staticLogo.height = opts.height
      return {webGLSupport: false,
              staticLogo: staticLogo}
    }
  } catch (err) {
    console.error('MetamaskLogo - encountered a WebGL error: '+err.stack)
    return
  }

  // parse options
  var followMouse = opts.followMouse
  var slowDrift = opts.slowDrift

  // SCENE
  var scene = new THREE.Scene()

  // MODEL
  var object = objMtlLoader()
  var looker = new Looker(object)
  object.position = scene.position
  object.rotation.x = 0
  object.rotation.y = 0
  object.rotation.z = 0

  // LIGHT
  var ambiColor = '#FFFFFF'
  var ambientLight = new THREE.AmbientLight(ambiColor)
  scene.add( ambientLight )

  // CAMERA
  window.camera = new THREE.PerspectiveCamera( 45, opts.width / opts.height, 1, 2000 )
  camera.position.z = 400
  camera.lookAt(scene.position)

  // RENDERER
  var renderer = new THREE.WebGLRenderer( {
    antialias: true,
    alpha: true,
  })

  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.gammaInput = true
  renderer.gammaOutput = true
  renderer.shadowMap.enabled = true
  renderer.shadowMap.cullFace = THREE.CullFaceBack

  // DOM STUFF
  var renderCanvas = renderer.domElement
  var boundingBox = null

  // handle screen resize
  setSize(opts)
  window.addEventListener('resize', setSize.bind(null, opts))

  // track mouse movements
  var mousePos = {
    x: window.innerWidth/2,
    y: window.innerHeight/2,
  }
  window.addEventListener('mousemove', function(event){
    mousePos.x = event.clientX
    mousePos.y = event.clientY
  })


  animate()

  // wait until dom reflow
  setTimeout(function(){
    updateBoundingBox()
    // finally add object
    scene.add( object )
  })

  return {
    // proeprties
    canvas: renderCanvas,
    renderer: renderer,
    scene: scene,
    object: object,
    // methods
    lookAt: lookAt,
    setFollowMouse: setFollowMouse,
    updateBoundingBox: updateBoundingBox,
    // flags
    webGLSupport: true,
  }


  function setFollowMouse(state) {
    followMouse = state
  }

  function lookAt(target) {
    updateBoundingBox()
    looker.setPageTarget(target, boundingBox)
  }

  function updateBoundingBox(){
    boundingBox = renderCanvas.getBoundingClientRect()
  }

  function animate() {

    looker.update()

    if (followMouse) {
      // look at mouse left-right
      lookAt(mousePos)
    } else if (slowDrift) {
      // drift left-right
      var time = Date.now()
      object.rotation.y = 0.5 + (Math.sin(time/3000) * 0.2)
      object.rotation.x = 0.1 + (Math.sin(time/3000) * 0.2)
      object.rotation.z = -0.1 + (Math.sin(time/2000) * 0.03)
    }

    // loop
    requestAnimationFrame( animate )
    render()
  }

  function render() {
    renderer.render( scene, camera )
  }

  function setSize(){
    if (!opts.pxNotRatio) {
      var width = window.innerWidth * opts.width
      if ('minWidth' in opts && width < opts.minWidth) {
        width = opts.minWidth
      }

      width = Math.max(width, opts.minWidth || width)
      var height = width
      camera.aspect = height / width
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    } else {
      renderer.setSize(opts.width, opts.height)
    }

    updateBoundingBox()
  }
}
