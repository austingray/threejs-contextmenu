var TKIT = TKIT || {};
TKIT.ContextMenu = {};

TKIT.ContextMenu.create = (items, actions, centerX, centerY) => {
  // clear any existing menus before displaying again
  if (TKIT.ContextMenu.active) {
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

  document.addEventListener('mousemove', TKIT.ContextMenu.Events.mousemove, false);
  document.addEventListener('click', TKIT.ContextMenu.Events.click, false);

  TKIT.ContextMenu.createMenu();
};

TKIT.ContextMenu.createMenu = () => {
  for (let i = 0; i < TKIT.ContextMenu.items.length; i += 1) {
    ((iter) => {
      const item = TKIT.ContextMenu.items[iter];
      setTimeout(() => {
        TKIT.ContextMenu.createItem(item, iter);
      }, iter * 100);
    })(i);
  }
};

TKIT.ContextMenu.createItem = (item, offset) => {
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
    ((TKIT.ContextMenu.centerX / window.innerWidth) * 2) - 1,
    -((TKIT.ContextMenu.centerY / window.innerHeight) * 2) + 1,
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
  const index = TKIT.ContextMenu.objects.push(cube);
  TKIT.scene.add(TKIT.ContextMenu.objects[index - 1]);
  setInterval(() => {
    if (cube.position.z < 0) {
      cube.position.z += 100;
    }
  }, 16);
};

TKIT.ContextMenu.destroy = () => {
  // only needs to run if active
  if (TKIT.ContextMenu.active) {
    // set to inactive
    TKIT.ContextMenu.active = false;
    // remove event handlers
    document.removeEventListener('mousemove', TKIT.ContextMenu.Events.mousemove);
    document.removeEventListener('click', TKIT.ContextMenu.Events.click);
    // clear three.js meshes from the scene
    for (let i = 0; i < TKIT.ContextMenu.objects.length; i += 1) {
      TKIT.scene.remove(TKIT.ContextMenu.objects[i]);
    }
    // empty our reference array
    TKIT.ContextMenu.objects = [];
  }
};

TKIT.ContextMenu.Events = {};
TKIT.ContextMenu.Events.mousemove = (event) => {
  const intersects = TKIT.IntersectObject.intersects(event, TKIT.scene, TKIT.camera);
  for (let i = 0; i < TKIT.ContextMenu.objects.length; i += 1) {
    TKIT.ContextMenu.objects[i].material.color.setHex(0xCDE0FE);
  }
  if (intersects.length > 0) {
    intersects[0].object.material.color.setHex(0xffffff);
  }
};
TKIT.ContextMenu.Events.click = (event) => {
  const intersects = TKIT.IntersectObject.intersects(event, TKIT.scene, TKIT.camera);
  if (intersects.length > 0) {
    TKIT.ContextMenu.actions[intersects[0].object.contextmenuaction]();
  }
  TKIT.ContextMenu.destroy();
};
