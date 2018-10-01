/*
 * IntersectObject extension
 * adapted from: https://threejs.org/docs/api/core/Raycaster.html
 */

function IntersectObject() {
  this.raycaster = new THREE.Raycaster();
  this.mouse = new THREE.Vector2();
}

Object.assign(IntersectObject.prototype, {
  intersects(event, scene, camera) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    this.mouse.x = ((event.clientX / window.innerWidth) * 2) - 1;
    this.mouse.y = -((event.clientY / window.innerHeight) * 2) + 1;

    // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, camera);

    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(scene.children);

    return intersects;
  },
});

export { IntersectObject };
