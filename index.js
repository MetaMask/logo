window.THREE = require('three.js')
const mousePointer = require('./lib/mouse-pointer')
const objMtlLoader = require('./lib/loader')

module.exports = function(opts){

  // parse options
  var followMouse = opts.followMouse

  // SCENE
  window.scene = new THREE.Scene()

  // MODEL
  var object = objMtlLoader()
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
  window.renderer = new THREE.WebGLRenderer( {
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
    object: object,
    renderer: renderer,
    canvas: renderCanvas,
    lookAt: lookAt,
    setFollowMouse: setFollowMouse,
  }


  function animate() {

    if (followMouse) {
      // look at mouse left-right
      lookAt(mousePos)
    } else {
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

  function setFollowMouse(state) {
    followMouse = state
  }

  function lookAt(target) {
    if (!boundingBox) updateBoundingBox()
    mousePointer(object, target, boundingBox)
  }

  function updateBoundingBox(){
    boundingBox = renderCanvas.getBoundingClientRect()
  }

  function render() {
    renderer.render( scene, camera )
  }

  function setSize(){
    if (!opts.pxNotRatio) {
      var width = window.innerWidth * opts.width
      width = Math.min(width, 800)
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