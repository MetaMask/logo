(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/danielfinlay/Documents/Development/eth/metamask-logo/index.js":[function(require,module,exports){
module.exports = function(opts){
	window.scene = new THREE.Scene();

	// CAMERA SETUP
	window.camera = new THREE.PerspectiveCamera( 45, opts.width / opts.height, 1, 2000 );
	camera.position.z = 400;
	camera.lookAt(scene.position);

  // RENDERER OPTIONS
  window.renderer = new THREE.WebGLRenderer( {
    antialias: true,
    alpha: true,
  });
  setSize(opts)
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.cullFace = THREE.CullFaceBack;

  // DOM STUFF
  var container = document.getElementById(opts.targetDivId);
  container.appendChild( renderer.domElement );

  // MODEL LOADING:
	var loader = new THREE.OBJMTLLoader();
	loader.load( './fox.obj', './fox.mtl', function ( object ) {
		window.object = object;
		object.position = scene.position;

		object.rotation.x = 0;
		object.rotation.y = 0;
		object.rotation.z = 0;

		scene.add( object );

		var ambiColor = "#FFFFFF";
    var ambientLight = new THREE.AmbientLight(ambiColor);
		scene.add( ambientLight );
		animate();
	});

  // handle screen resize
	window.addEventListener('resize', setSize.bind(null, opts))

  // track mouse movements
  var mouseX = window.innerWidth/2, mouseY = window.innerHeight/2
  window.addEventListener('mousemove', function(event){
    mouseX = event.clientX
    mouseY = event.clientY
  })

	function animate() {
    var time = Date.now()

    if (opts.followMouse) {
      // look at mouse left-right
      lookAtMouse(object)
    } else {
      // drift left-right
      object.rotation.y = 0.5 + (Math.sin(time/3000) * 0.1);
      object.rotation.x = 0.1 + (Math.sin(time/3000) * 0.1);
      object.rotation.z = -0.1 + (Math.sin(time/2000) * 0.03);
    }

    // add other drift
		requestAnimationFrame( animate );
		render();
	}

  function lookAtMouse(object) {
    var halfWidth = window.innerWidth/2;
    var halfHeight = window.innerHeight/2;
    var softness = 30;

    var x = (mouseX - halfWidth) / softness;
    var y = (mouseY - halfHeight) / softness * -1;
    var z = 10;

    var mousePos = new THREE.Vector3(x, y, z); 

    object.lookAt( mousePos )
  }

	function render() {
		// setSize(opts);
		renderer.render( scene, camera );
	}
}

function setSize(opts){
  if (!opts.pxNotRatio) {
    var width = window.innerWidth * opts.width;
    width = Math.min(width, 800)
    var height = width;
    camera.aspect = height / width;
    camera.updateProjectionMatrix();
    console.log("SETTING SIZE:", width, height)
    renderer.setSize(width, height);
  } else {
    renderer.setSize(opts.width, opts.height);
  }
}

},{}],"/Users/danielfinlay/Documents/Development/eth/metamask-logo/sample.js":[function(require,module,exports){
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
  targetDivId: 'modelDivLarge',
  followMouse: true
})

},{"./":"/Users/danielfinlay/Documents/Development/eth/metamask-logo/index.js"}]},{},["/Users/danielfinlay/Documents/Development/eth/metamask-logo/sample.js"]);
