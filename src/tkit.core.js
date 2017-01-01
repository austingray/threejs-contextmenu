var TKIT = TKIT || {};
TKIT.init = function(scene, camera) {
  TKIT.scene = scene;
  TKIT.camera = camera;
}

TKIT.generateBasicScene = function() {

  TKIT.scene = new THREE.Scene();
  TKIT.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
  TKIT.camera.position.z = 600;
  TKIT.light = new THREE.PointLight( 0xffffff, 1, 0 );
  TKIT.light.position.set( 0, 0, 1000 );
  TKIT.scene.add( TKIT.light );
  TKIT.renderer = new THREE.WebGLRenderer({ antialias: true });
  TKIT.renderer.setClearColor( 0xf0f0f0 );
  TKIT.renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( TKIT.renderer.domElement );
  TKIT.render = function() {
    requestAnimationFrame( TKIT.render );
    TKIT.renderer.render( TKIT.scene, TKIT.camera );
  }
  
  TKIT.render();

  window.addEventListener( 'resize', function() {
    TKIT.camera.aspect = window.innerWidth / window.innerHeight;
    TKIT.camera.updateProjectionMatrix();
    TKIT.renderer.setSize( window.innerWidth, window.innerHeight );
  });
    
}