window.THREE = require('three.js')
const mousePointer = require('./lib/mouse-pointer')
const objMtlLoader = require('./lib/loader')
var el, elBox

module.exports = function(opts){
  window.scene = new THREE.Scene()

  // CAMERA SETUP
  window.camera = new THREE.PerspectiveCamera( 45, opts.width / opts.height, 1, 2000 )
  camera.position.z = 400
  camera.lookAt(scene.position)

  // RENDERER OPTIONS
  window.renderer = new THREE.WebGLRenderer( {
    antialias: true,
    alpha: true,
  })

  setSize(opts)
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.gammaInput = true
  renderer.gammaOutput = true
  renderer.shadowMap.enabled = true
  renderer.shadowMap.cullFace = THREE.CullFaceBack

  // DOM STUFF
  var container = document.getElementById(opts.targetDivId)
  el = container.querySelector('canvas')
  if (el) elBox = el.getBoundingClientRect()
  container.appendChild( renderer.domElement )

  // handle screen resize
  window.addEventListener('resize', setSize.bind(null, opts))

  // track mouse movements
  var mouseX = window.innerWidth/2, mouseY = window.innerHeight/2
  window.addEventListener('mousemove', function(event){
    mouseX = event.clientX
    mouseY = event.clientY
  })

  // MODEL LOADING:
  var object = objMtlLoader()
  window.object = object
  object.position = scene.position

  object.rotation.x = 0
  object.rotation.y = 0
  object.rotation.z = 0

  scene.add( object )

  var ambiColor = '#FFFFFF'
  var ambientLight = new THREE.AmbientLight(ambiColor)
  scene.add( ambientLight )

  animate()


  function animate() {
    var time = Date.now()

    if (opts.followMouse) {
      // look at mouse left-right
      lookAtMouse(object)
    } else {
      // drift left-right
      object.rotation.y = 0.5 + (Math.sin(time/3000) * 0.2)
      object.rotation.x = 0.1 + (Math.sin(time/3000) * 0.2)
      object.rotation.z = -0.1 + (Math.sin(time/2000) * 0.03)
    }

    // add other drift
    requestAnimationFrame( animate )
    render()
  }

  function lookAtMouse(object) {
    var mouse = {
      x: mouseX,
      y: mouseY,
    }

    if (elBox) {
      mousePointer(object, mouse, elBox);
    } else {
      el = container.querySelector('canvas')
      if (el) elBox = el.getBoundingClientRect()
    }
  }

  function render() {
    // setSize(opts)
    renderer.render( scene, camera )
  }
}

function setSize(opts){
  if (el) elBox = el.getBoundingClientRect()

  if (!opts.pxNotRatio) {
    var width = window.innerWidth * opts.width
    width = Math.min(width, 800)
    var height = width
    camera.aspect = height / width
    camera.updateProjectionMatrix()
    console.log('SETTING SIZE:', width, height)
    renderer.setSize(width, height)
  } else {
    renderer.setSize(opts.width, opts.height)
  }
}
