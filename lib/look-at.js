var scratchMatrix = new THREE.Matrix4()
var scratchQuat = new THREE.Quaternion()

module.exports = Looker

function Looker(object){
  this.object = object
  this.target = object.position.clone()
}

Looker.prototype.setTarget = function(x,y,z){
  this.target = new THREE.Vector3(x,y,z)
}

Looker.prototype.setPageTarget = function(target, boundingBox){
  var origin = getOriginFrom(boundingBox)
  var softness = 30
  var x = (target.x - origin.x) / softness
  var y = (target.y - origin.y) / softness * -1
  var z = 10
  this.target = new THREE.Vector3(x,y,z)
  // console.log('new target', this.target.toArray(), 'from', target)
}

Looker.prototype.update = function() {
  var object = this.object
  var target = this.target
  // console.log('target:',target.toArray())
  scratchMatrix.lookAt( target, object.position, object.up )
  // console.log('mat:',scratchMatrix.toArray())
  scratchQuat.setFromRotationMatrix( scratchMatrix )
  object.quaternion.slerp(scratchQuat, 0.3)
  // console.log('quat:',scratchQuat.toArray())
}

// util

function getOriginFrom(boundingBox) {
  var x = boundingBox.left + (boundingBox.width / 2)
  var hThird = boundingBox.height / 3
  var y = boundingBox.top + (2 * hThird)
  return {x: x, y: y}
}
