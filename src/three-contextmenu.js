var A = A || {};
A.init = function() {
  A.Three.init();
}

A.Three = {};
A.Three.init = function() {
  // scene
  A.Three.scene = new THREE.Scene();
  // camera
  A.Three.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
  A.Three.camera.position.z = 600;
  // light
  var lights = [];
  lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
  lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
  lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

  lights[ 0 ].position.set( 0, 0, 1000 );
  // lights[ 1 ].position.set( 100, 200, 100 );
  // lights[ 2 ].position.set( - 100, - 200, - 100 );

  A.Three.scene.add( lights[ 0 ] );
  // A.Three.scene.add( lights[ 1 ] );
  // A.Three.scene.add( lights[ 2 ] );
  // renderer
  A.Three.renderer = new THREE.WebGLRenderer({ antialias: true });
  A.Three.renderer.setClearColor( 0xf0f0f0 );
  A.Three.setRendererSize();
  document.body.appendChild( A.Three.renderer.domElement );
  A.Three.render();
}

A.Three.setRendererSize = function() {
  A.Three.renderer.setSize( window.innerWidth, window.innerHeight );
}

// render
A.Three.render = function() {
  requestAnimationFrame( A.Three.render );
  A.Three.renderer.render( A.Three.scene, A.Three.camera );
}

// resize
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){
  // camera
  A.Three.camera.aspect = window.innerWidth / window.innerHeight;
  A.Three.camera.updateProjectionMatrix();
  // renderer 
  A.Three.renderer.setSize( window.innerWidth, window.innerHeight );
}

// contextmenu
document.addEventListener( "contextmenu", function(event) {
  event.preventDefault();
  A.ContextMenu.clear();
  A.ContextMenu.create( event );
});

document.addEventListener( "click", function(e) {
  A.ContextMenu.clear();
})

A.ContextMenu = {};
A.ContextMenu.active = false;
A.ContextMenu.threeObjects = [];

A.ContextMenu.actions = {};
A.ContextMenu.actions['createTable'] = function() {

        

}

A.ContextMenu.items = [
  { labelText: "Create New Table", action: "createTable" },
  { labelText: "Test Item 2" },
  { labelText: "Auger was here" },
  { labelText: "Oh Another One" }
];

A.ContextMenu.clear = function() {
  for (var i = 0; i < A.ContextMenu.threeObjects.length; i++) {
    A.Three.scene.remove( A.ContextMenu.threeObjects[i] );
  }
  A.ContextMenu.threeObjects = [];
}

A.ContextMenu.create = function(event) {
  A.ContextMenu.active = true;
  for (var i = 0; i < A.ContextMenu.items.length; i++) {
    (function(i, event) {
      var item = A.ContextMenu.items[i];
      setTimeout(function() {
        A.ContextMenu.createSingleMenuItem(item, i, event);
      }, i * 100);
    })(i, event)
  }
}

A.ContextMenu.createSingleMenuItem = function(item, offset, event) {

  // text to image
  var el = document.createElement('canvas');
  el.style.backgroundColor = 'white';
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
  vector.unproject( A.Three.camera );
  var dir = vector.sub( A.Three.camera.position ).normalize();
  var distance = - A.Three.camera.position.z / dir.z;
  var pos = A.Three.camera.position.clone().add( dir.multiplyScalar( distance ) );

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
  var index = A.ContextMenu.threeObjects.push(cube);
  A.Three.scene.add( A.ContextMenu.threeObjects[index - 1] );
  setInterval(function() {
    if ( cube.position.z < 0 ) {
      cube.position.z = cube.position.z + 100
    }
  }, 16);

}

document.addEventListener( 'mousemove', function(event) {
  event.preventDefault();
  var mouse3D = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );     
  var raycaster =  new THREE.Raycaster();                                        
  raycaster.setFromCamera( mouse3D, A.Three.camera );
  var intersects = raycaster.intersectObjects( A.ContextMenu.threeObjects );
  console.log(intersects)
  for ( var i = 0; i < A.ContextMenu.threeObjects.length; i++ ) {
    A.ContextMenu.threeObjects[i].material.color.setHex( 0xCDE0FE );
  }
  if ( intersects.length > 0 ) {
      intersects[ 0 ].object.material.color.setHex( 0xffffff );
  }
});

A.init();