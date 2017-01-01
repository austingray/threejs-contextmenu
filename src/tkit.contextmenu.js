var TKIT = TKIT || {};
TKIT.ContextMenu = {};

TKIT.ContextMenu.create = function(items, actions, centerX, centerY) {

  // clear any existing menus before displaying again
  if ( TKIT.ContextMenu.active ) {
    TKIT.ContextMenu.destroy();
  }

  TKIT.ContextMenu.active = true;

  // make variables available
  TKIT.ContextMenu.centerX = centerX || 0;
  TKIT.ContextMenu.centerY = centerY || 0;
  TKIT.ContextMenu.items = items;
  TKIT.ContextMenu.actions = actions;
  // array that holds our three.js meshes
  TKIT.ContextMenu.objects = [];

  document.addEventListener( 'mousemove', TKIT.ContextMenu.Events.mousemove, false );
  document.addEventListener( 'click', TKIT.ContextMenu.Events.click, false );

  TKIT.ContextMenu.createMenu();

}

TKIT.ContextMenu.createMenu = function() {
  for (var i = 0; i < TKIT.ContextMenu.items.length; i++) {
    (function(i) {
      var item = TKIT.ContextMenu.items[i];
      setTimeout(function() {
        TKIT.ContextMenu.createItem(item, i);
      }, i * 100);
    })(i);
  }
};

TKIT.ContextMenu.createItem = function(item, offset) {

  // get our current click event
  var event = TKIT.ContextMenu.event;

  // get our item label and action
  var labelText = item.labelText;
  var action = item.action;
  var itemHeight = 64;
  var itemWidth = 256;

  // create canvas
  var el = document.createElement('canvas');
  el.id = 'TKITContextMenuCanvas';
  document.body.appendChild(el);
  var c = document.getElementById('TKITContextMenuCanvas');
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
  vector.set( ( TKIT.ContextMenu.centerX / window.innerWidth ) * 2 - 1, - ( TKIT.ContextMenu.centerY / window.innerHeight ) * 2 + 1, 0.5 );
  vector.unproject( TKIT.camera );
  var dir = vector.sub( TKIT.camera.position ).normalize();
  var distance = - TKIT.camera.position.z / dir.z;
  var pos = TKIT.camera.position.clone().add( dir.multiplyScalar( distance ) );

  // create and add our menu items
  var texture = new THREE.Texture( image );
  texture.needsUpdate = true;
  var geometry = new THREE.BoxGeometry( 256, itemHeight, 100 );
  var material = new THREE.MeshPhongMaterial({ map: texture, color: 0xCDE0FE, specular: 0x111111, shininess: 30, shading: THREE.SmoothShading });
  var cube = new THREE.Mesh( geometry, material );
  cube.position.set( pos.x, pos.y - offset * itemHeight, -1000 );
  cube.contextmenuaction = action;
  var index = TKIT.ContextMenu.objects.push(cube);
  TKIT.scene.add( TKIT.ContextMenu.objects[index - 1] );
  setInterval(function() {
    if ( cube.position.z < 0 ) {
      cube.position.z = cube.position.z + 100
    }
  }, 16);

};

TKIT.ContextMenu.destroy = function() {
  // only needs to run if active
  if ( TKIT.ContextMenu.active ) {
    // set to inactive
    TKIT.ContextMenu.active = false;
    // remove event handlers
    document.removeEventListener('mousemove', TKIT.ContextMenu.Events.mousemove );
    document.removeEventListener( 'click', TKIT.ContextMenu.Events.click );
    // clear three.js meshes from the scene
    for (var i = 0; i < TKIT.ContextMenu.objects.length; i++) {
      TKIT.scene.remove( TKIT.ContextMenu.objects[i] );
    }
    // empty our reference array
    TKIT.ContextMenu.objects = [];
  }
}

TKIT.ContextMenu.Events = {};
TKIT.ContextMenu.Events.mousemove = function(event) {
  var intersects = TKIT.IntersectObject.intersects(event, TKIT.scene, TKIT.camera);
  for ( var i = 0; i < TKIT.ContextMenu.objects.length; i++ ) {
    TKIT.ContextMenu.objects[i].material.color.setHex( 0xCDE0FE );
  }
  if ( intersects.length > 0 ) {
    intersects[ 0 ].object.material.color.setHex( 0xffffff );
  }
}
TKIT.ContextMenu.Events.click = function(event) {
  var intersects = TKIT.IntersectObject.intersects(event, TKIT.scene, TKIT.camera);
  if ( intersects.length > 0 ) {
    TKIT.ContextMenu.actions[intersects[ 0 ].object.contextmenuaction]();
  }
  TKIT.ContextMenu.destroy();
}