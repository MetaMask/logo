module.exports = lookAtMouse;

function lookAtMouse (object, target, boundingBox) {
  var elOrigin = getOriginFrom(boundingBox);

  var softness = 30

  var x = (target.x - elOrigin.x) / softness
  var y = (target.y - elOrigin.y) / softness * -1
  var z = 10

  var target3d = new THREE.Vector3(x, y, z) 
  object.lookAt( target3d )
}

function getOriginFrom(boundingBox) {
  var x = boundingBox.left + (boundingBox.width / 2)
  var hThird = boundingBox.height / 3
  var y = boundingBox.top + (2 * hThird)
  return {x: x, y: y}
}
