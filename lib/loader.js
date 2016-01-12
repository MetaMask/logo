require('./three-mtl')
require('./three-objmtl')
const fs = require('fs')
const MTL_SRC = fs.readFileSync(__dirname+'/../fox.mtl', 'utf8')
const OBJ_SRC = fs.readFileSync(__dirname+'/../fox.obj', 'utf8')

module.exports = loadObjMtl


function loadObjMtl() {

  // load materials
  var mtlLoader = new THREE.MTLLoader()
  var materialsCreator = mtlLoader.parse( MTL_SRC )
  materialsCreator.preload()

  // load object
  var objMtlLoader = new THREE.OBJMTLLoader()
  var object = objMtlLoader.parse( OBJ_SRC )

  // set materials on object
  object.traverse( function ( object ) {
    if ( object instanceof THREE.Mesh ) {
      if ( object.material.name ) {
        var material = materialsCreator.create( object.material.name )
        if ( material ) object.material = material
      }
    }
  })

  return object 

}