var THREEx = THREEx || {};
THREEx.ContextMenu = {};

THREEx.ContextMenu.contextmenu = function(event, scene, camera, items, actions) {

  // clear any existing menus before displaying again
  if ( THREEx.ContextMenu.active ) {
    THREEx.ContextMenu.destroy();
  }

  THREEx.ContextMenu.active = true;

  // make variables available
  THREEx.ContextMenu.event = event;
  THREEx.ContextMenu.items = items;
  THREEx.ContextMenu.actions = actions;
  THREEx.ContextMenu.scene = scene;
  THREEx.ContextMenu.camera = camera;
  // array that holds our three.js meshes
  THREEx.ContextMenu.objects = [];

  document.addEventListener( 'mousemove', THREEx.ContextMenu.Events.mousemove, false );
  document.addEventListener( 'click', THREEx.ContextMenu.Events.click, false );

  THREEx.ContextMenu.create();

}

THREEx.ContextMenu.create = function() {
  for (var i = 0; i < THREEx.ContextMenu.items.length; i++) {
    (function(i) {
      var item = THREEx.ContextMenu.items[i];
      setTimeout(function() {
        THREEx.ContextMenu.createItem(item, i);
      }, i * 100);
    })(i);
  }
};

THREEx.ContextMenu.createItem = function(item, offset) {

  // get our current click event
  var event = THREEx.ContextMenu.event;

  // get our item label and action
  var labelText = item.labelText;
  var action = item.action;
  var itemHeight = 64;
  var itemWidth = 256;

  // create canvas
  var el = document.createElement('canvas');
  el.id = 'THREExContextMenuCanvas';
  document.body.appendChild(el);
  var c = document.getElementById('THREExContextMenuCanvas');
  c.width = 1024;
  c.height = 256;
  // draw menu text
  var ctx = c.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.font="112px Arial";
  ctx.fillStyle = 'black';
  ctx.fillText(labelText, 32, 164);
  // create image from canvas
  var d = c.toDataURL("image/png");
  var image = new Image();
  image.src = d;
  document.body.appendChild(image);

  // get click event position in scene
  var vector = new THREE.Vector3();
  vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
  vector.unproject( THREEx.ContextMenu.camera );
  var dir = vector.sub( THREEx.ContextMenu.camera.position ).normalize();
  var distance = - THREEx.ContextMenu.camera.position.z / dir.z;
  var pos = THREEx.ContextMenu.camera.position.clone().add( dir.multiplyScalar( distance ) );

  // create and add our menu items
  var texture = new THREE.Texture( image );
  texture.needsUpdate = true;
  var geometry = new THREE.BoxGeometry( 256, itemHeight, 100 );
  var material = new THREE.MeshPhongMaterial({ map: texture, color: 0xCDE0FE, specular: 0x111111, shininess: 30, shading: THREE.SmoothShading });
  var cube = new THREE.Mesh( geometry, material );
  cube.position.set( pos.x, pos.y - offset * itemHeight, -1000 );
  cube.contextmenuaction = action;
  var index = THREEx.ContextMenu.objects.push(cube);
  THREEx.ContextMenu.scene.add( THREEx.ContextMenu.objects[index - 1] );
  setInterval(function() {
    if ( cube.position.z < 0 ) {
      cube.position.z = cube.position.z + 100
    }
  }, 16);

};

THREEx.ContextMenu.destroy = function() {
  // only needs to run if active
  if ( THREEx.ContextMenu.active ) {
    // set to inactive
    THREEx.ContextMenu.active = false;
    // remove event handlers
    document.removeEventListener('mousemove', THREEx.ContextMenu.Events.mousemove );
    document.removeEventListener( 'click', THREEx.ContextMenu.Events.click );
    // clear three.js meshes from the scene
    for (var i = 0; i < THREEx.ContextMenu.objects.length; i++) {
      THREEx.ContextMenu.scene.remove( THREEx.ContextMenu.objects[i] );
    }
    // empty our reference array
    THREEx.ContextMenu.objects = [];
  }
}

THREEx.ContextMenu.Events = {};
THREEx.ContextMenu.Events.mousemove = function(event) {
  var intersects = THREEx.IntersectObject.intersects(event, THREEx.ContextMenu.scene, THREEx.ContextMenu.camera);
  for ( var i = 0; i < THREEx.ContextMenu.objects.length; i++ ) {
    THREEx.ContextMenu.objects[i].material.color.setHex( 0xCDE0FE );
  }
  if ( intersects.length > 0 ) {
    intersects[ 0 ].object.material.color.setHex( 0xffffff );
  }
}
THREEx.ContextMenu.Events.click = function(event) {
  var intersects = THREEx.IntersectObject.intersects(event, THREEx.ContextMenu.scene, THREEx.ContextMenu.camera);
  if ( intersects.length > 0 ) {
    THREEx.ContextMenu.actions[intersects[ 0 ].object.contextmenuaction]();
  }
  THREEx.ContextMenu.destroy();
}

if ( typeof THREEx.IntersectObject === 'undefined' ) {
  
  /*
   * IntersectObject extension
   * adapted from: https://threejs.org/docs/api/core/Raycaster.html
   * source: https://github.com/austingray/threex.intersectobject
   */

  THREEx.IntersectObject = {};
  THREEx.IntersectObject.raycaster = new THREE.Raycaster();
  THREEx.IntersectObject.mouse = new THREE.Vector2();

  THREEx.IntersectObject.intersects = function(event, scene, camera) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    THREEx.IntersectObject.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    THREEx.IntersectObject.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    // update the picking ray with the camera and mouse position
    THREEx.IntersectObject.raycaster.setFromCamera( THREEx.IntersectObject.mouse, camera );

    // calculate objects intersecting the picking ray
    var intersects = THREEx.IntersectObject.raycaster.intersectObjects( scene.children );

    return intersects;
  }
}