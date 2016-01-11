module.exports = lookAtMouse;

function lookAtMouse (object, mouse, elBox) {
  var elOrigin = getOriginFrom(elBox);

  var softness = 30

  var x = (mouse.x - elOrigin.x) / softness
  var y = (mouse.y - elOrigin.y) / softness * -1
  var z = 10

  var mousePos = new THREE.Vector3(x, y, z) 
  object.lookAt( mousePos )
}

function getOriginFrom(elBox) {
  var x = elBox.left + (elBox.width / 2)
  var hThird = elBox.height / 3
  var y = elBox.top + (2 * hThird)
  return {x: x, y: y}
}
