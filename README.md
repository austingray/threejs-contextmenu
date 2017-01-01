# THREE.JS CONTEXTMENU

Demo: https://austingray.github.io/threex.contextmenu/

Pass your click event, scene, camera, a list of predefined items, and your action definitions.

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
      THREEx.ContextMenu.contextmenu( event, scene, camera, items, actions );
    });
    window.addEventListener( 'click', function(e) {
      THREEx.ContextMenu.destroy();
    });

Todo:

 - Make menu startX, startY passable params for non click events
 - Resize contextmenu based on Text size
 - Add custom appearance options for font/color
 - Add fade in/out effect options