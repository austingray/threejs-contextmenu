(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.TKIT = {})));
}(this, (function (exports) { 'use strict';

	/*
	 * IntersectObject extension
	 * adapted from: https://threejs.org/docs/api/core/Raycaster.html
	 */

	function IntersectObject() {
	  this.raycaster = new THREE.Raycaster();
	  this.mouse = new THREE.Vector2();
	}

	Object.assign(IntersectObject, {
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

	function ContextMenu() {
	  this.active = false;

	  this.Events = {};
	  this.Events.mousemove = (event) => {
	    const intersects = TKIT.IntersectObject.intersects(event, TKIT.scene, TKIT.camera);
	    for (let i = 0; i < this.objects.length; i += 1) {
	      this.objects[i].material.color.setHex(0xCDE0FE);
	    }
	    if (intersects.length > 0) {
	      intersects[0].object.material.color.setHex(0xffffff);
	    }
	  };
	  this.Events.click = (event) => {
	    const intersects = TKIT.IntersectObject.intersects(event, TKIT.scene, TKIT.camera);
	    if (intersects.length > 0) {
	      this.actions[intersects[0].object.contextmenuaction]();
	    }
	    this.destroy();
	  };
	}

	Object.assign(ContextMenu.prototype, {
	  create(items, actions, centerX, centerY) {
	    // clear any existing menus before displaying again
	    if (this.active) {
	      this.destroy();
	    }

	    this.active = true;

	    // make variables available
	    this.centerX = centerX || 0;
	    this.centerY = centerY || 0;
	    this.items = items;
	    this.actions = actions;
	    // array that holds our three.js meshes
	    this.objects = [];

	    document.addEventListener('mousemove', this.Events.mousemove, false);
	    document.addEventListener('click', this.Events.click, false);

	    this.createMenu();
	  },
	  createMenu() {
	    for (let i = 0; i < TKIT.ContextMenu.items.length; i += 1) {
	      ((iter) => {
	        const item = this.items[iter];
	        setTimeout(() => {
	          this.createItem(item, iter);
	        }, iter * 100);
	      })(i);
	    }
	  },
	  createItem(item, offset) {
	    // get our current click event
	    // var event = TKIT.ContextMenu.event;

	    // get our item label and action
	    const labelText = item.labelText;
	    const action = item.action;
	    const itemHeight = 64;

	    // create canvas
	    const el = document.createElement('canvas');
	    el.id = 'TKITContextMenuCanvas';
	    document.body.appendChild(el);
	    const c = document.getElementById('TKITContextMenuCanvas');
	    c.width = 1024;
	    c.height = 256;
	    // draw menu text
	    const ctx = c.getContext('2d');
	    ctx.fillStyle = 'white';
	    ctx.fillRect(0, 0, c.width, c.height);
	    ctx.font = '112px Arial';
	    ctx.fillStyle = 'black';
	    ctx.fillText(labelText, 32, 164);
	    // create image from canvas
	    const d = c.toDataURL('image/png');
	    const image = new Image();
	    image.src = d;
	    document.body.appendChild(image);

	    // get click event position in scene
	    const vector = new THREE.Vector3();
	    vector.set(
	      ((this.centerX / window.innerWidth) * 2) - 1,
	      -((this.centerY / window.innerHeight) * 2) + 1,
	      0.5,
	    );
	    vector.unproject(TKIT.camera);
	    const dir = vector.sub(TKIT.camera.position).normalize();
	    const distance = -TKIT.camera.position.z / dir.z;
	    const pos = TKIT.camera.position.clone().add(dir.multiplyScalar(distance));

	    // create and add our menu items
	    const texture = new THREE.Texture(image);
	    texture.needsUpdate = true;
	    const geometry = new THREE.BoxGeometry(256, itemHeight, 100);
	    const material = new THREE.MeshPhongMaterial({
	      map: texture,
	      color: 0xCDE0FE,
	      specular: 0x111111,
	      shininess: 30,
	      shading: THREE.SmoothShading,
	    });
	    const cube = new THREE.Mesh(geometry, material);
	    cube.position.set(pos.x, pos.y - (offset * itemHeight), -1000);
	    cube.contextmenuaction = action;
	    const index = this.objects.push(cube);
	    TKIT.scene.add(this.objects[index - 1]);
	    setInterval(() => {
	      if (cube.position.z < 0) {
	        cube.position.z += 100;
	      }
	    }, 16);
	  },
	  destroy() {
	    // only needs to run if active
	    if (this.active) {
	      // set to inactive
	      this.active = false;
	      // remove event handlers
	      document.removeEventListener('mousemove', this.Events.mousemove);
	      document.removeEventListener('click', this.Events.click);
	      // clear three.js meshes from the scene
	      for (let i = 0; i < this.objects.length; i += 1) {
	        TKIT.scene.remove(this.objects[i]);
	      }
	      // empty our reference array
	      this.objects = [];
	    }
	  },
	});

	function init(scene, camera) {
	  this.scene = scene;
	  this.camera = camera;
	}

	exports.IntersectObject = IntersectObject;
	exports.ContextMenu = ContextMenu;
	exports.init = init;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
