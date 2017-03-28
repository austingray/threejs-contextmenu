/*
 * IntersectObject extension
 * adapted from: https://threejs.org/docs/api/core/Raycaster.html
 */
var TKIT = TKIT || {};
TKIT.IntersectObject = {};
TKIT.IntersectObject.raycaster = new THREE.Raycaster();
TKIT.IntersectObject.mouse = new THREE.Vector2();

TKIT.IntersectObject.intersects = function(event, scene, camera) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  TKIT.IntersectObject.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  TKIT.IntersectObject.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  // update the picking ray with the camera and mouse position
  TKIT.IntersectObject.raycaster.setFromCamera( TKIT.IntersectObject.mouse, camera );

  // calculate objects intersecting the picking ray
  var intersects = TKIT.IntersectObject.raycaster.intersectObjects( scene.children );

  return intersects;
}
