var THREEx = THREEx || {};
THREEx.ContextMenu = {};
THREEx.ContextMenu.init = function(scene, camera, items, actions) {
  THREEx.ContextMenu.active = false;
  THREEx.ContextMenu.items = items;
  THREEx.ContextMenu.actions = actions;
  // create scene reference
  THREEx.ContextMenu.Three.init(scene, camera);
  // override default contextmenu
  document.addEventListener( "contextmenu", function(event) {
    event.preventDefault();
    if ( THREEx.ContextMenu.active ) {
      THREEx.ContextMenu.clear();
    }
    document.addEventListener('mousemove', function(e) {
      THREEx.ContextMenu.Events.mousemove(e); 
    } );
    THREEx.ContextMenu.active = true;
    THREEx.ContextMenu.event = event;
    THREEx.ContextMenu.create(event);
  });
  // clear contextmenu on left click
  document.addEventListener( "click", function(event) {
    THREEx.ContextMenu.Events.click(event);
  });
};

THREEx.ContextMenu.Three = {};
THREEx.ContextMenu.Three.init = function(scene, camera) {
  THREEx.ContextMenu.Three.objects = [];
  THREEx.ContextMenu.Three.scene = scene;
  THREEx.ContextMenu.Three.camera = camera;
};
THREEx.ContextMenu.Three.getIntersectedObject = function(event) {
  var mouse3D = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );     
  var raycaster =  new THREE.Raycaster();                                        
  raycaster.setFromCamera( mouse3D, THREEx.ContextMenu.Three.camera );
  var intersects = raycaster.intersectObjects( THREEx.ContextMenu.Three.objects );
  return intersects;
}

THREEx.ContextMenu.create = function() {
  for (var i = 0; i < THREEx.ContextMenu.items.length; i++) {
    (function(i) {
      var item = THREEx.ContextMenu.items[i];
      setTimeout(function() {
        THREEx.ContextMenu.createSingleItem(item, i);
      }, i * 100);
    })(i);
  }
};

THREEx.ContextMenu.createSingleItem = function(item, offset) {

  var event = THREEx.ContextMenu.event;

  var action = item.action;

  // text to image
  var el = document.createElement('canvas');
  el.id = 'textCanvas'+offset;
  document.body.appendChild(el);
  var labelText = item.labelText;
  var c=document.getElementById('textCanvas'+offset);
  c.width = 1024;
  c.height = 256;
  var ctx=c.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,1024,256);
  ctx.font="112px Arial";
  ctx.fillStyle = 'black';
  ctx.fillText(labelText,32,164);
  var d = c.toDataURL("image/png");
  image = new Image(256, 128);
  image.src = d;
  document.body.appendChild(image);

  // mouse position
  var vector = new THREE.Vector3();
  vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
  vector.unproject( THREEx.ContextMenu.Three.camera );
  var dir = vector.sub( THREEx.ContextMenu.Three.camera.position ).normalize();
  var distance = - THREEx.ContextMenu.Three.camera.position.z / dir.z;
  var pos = THREEx.ContextMenu.Three.camera.position.clone().add( dir.multiplyScalar( distance ) );

  // three
  var itemHeight = 64;
  var texture = new THREE.Texture( image );
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  var geometry = new THREE.BoxGeometry( 256, itemHeight, 100 );
  var material = new THREE.MeshPhongMaterial({ map: texture, color: 0xCDE0FE, specular: 0x111111, shininess: 30, shading: THREE.SmoothShading });
  var cube = new THREE.Mesh( geometry, material );
  cube.position.set( pos.x, pos.y - offset * itemHeight, -1000 );
  cube.contextmenuaction = action;
  var index = THREEx.ContextMenu.Three.objects.push(cube);
  THREEx.ContextMenu.Three.scene.add( THREEx.ContextMenu.Three.objects[index - 1] );
  setInterval(function() {
    if ( cube.position.z < 0 ) {
      cube.position.z = cube.position.z + 100
    }
  }, 16);

}

THREEx.ContextMenu.clear = function() {
  document.removeEventListener('mousemove', THREEx.ContextMenu.Events.MouseMove)
  for (var i = 0; i < THREEx.ContextMenu.Three.objects.length; i++) {
    THREEx.ContextMenu.Three.scene.remove( THREEx.ContextMenu.Three.objects[i] );
  }
  THREEx.ContextMenu.Three.objects = [];
}

THREEx.ContextMenu.Events = {};
THREEx.ContextMenu.Events.mousemove = function(event) {
  var intersects = THREEx.ContextMenu.Three.getIntersectedObject(event);
  for ( var i = 0; i < THREEx.ContextMenu.Three.objects.length; i++ ) {
    THREEx.ContextMenu.Three.objects[i].material.color.setHex( 0xCDE0FE );
  }
  if ( intersects.length > 0 ) {
    intersects[ 0 ].object.material.color.setHex( 0xffffff );
  }
}

THREEx.ContextMenu.Events.click = function(event) {
  var intersects = THREEx.ContextMenu.Three.getIntersectedObject(event);
  if ( intersects.length > 0 ) {
    THREEx.ContextMenu.actions[intersects[ 0 ].object.contextmenuaction]();
  }
  THREEx.ContextMenu.active = false;
  THREEx.ContextMenu.clear();
}