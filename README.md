# THREE.JS TOOLKIT

A collection of Three.js extensions.

Build:

    npm install && npm run build

### Core

To use this library, you need to initialize it with your Three.js scene and camera:

    TKIT.init( scene, camera );

Alternatively, for rapid prototyping you can use the basic scene generator:

    TKIT.generateBasicScene();

### ContextMenu

Usage: 

    // items to display in your menu
    var items = [
      { labelText: "Do Alert", action: "actionAlert" },
      { labelText: "Console Log", action: "action2" },
      { labelText: "Random BG Color", action: "backgroundColor" }
    ];

    // action definitions
    var actions = {
      actionAlert: function() {
        alert('this context menu creates an alert.');
      },
      action2: function() {
        console.log('console log action');
      },
      backgroundColor: function() {
        renderer.setClearColor( Math.random() * 0xffffff | 0x80000000 );
      }
    }

    // event listeners
    window.addEventListener( 'contextmenu', function(e) {
      e.preventDefault();
      THREEx.ContextMenu.contextmenu( event, items, actions );
    });
    window.addEventListener( 'click', function(e) {
      THREEx.ContextMenu.destroy();
    });

Todo:

 - Make menu startX, startY passable params for non click events
 - Resize contextmenu based on Text size
 - Add custom appearance options for font/color
 - Add fade in/out effect options

### IntersectObject

Utility for getting objects intersected by the mouse

Usage: 

    var intersects = TKIT.IntersectObject.intersects(event, TKIT.ContextMenu.scene, TKIT.ContextMenu.camera);