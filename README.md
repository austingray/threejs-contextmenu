# THREE.JS CONTEXTMENU

Demo: https://austingray.github.io/threex.contextmenu/

It's easy as pie. Just pass your scene, camera, a list of predefined items, and your action definitions.

Todo:

 - Resize contextmenu based on Text size
 - Add custom appearance options for font/color
 - Add fade in/out effect options

Usage: 

    // define your contextmenu items
    var actions = {
      actionAlert: function() {
        alert("this context menu creates an alert.");
      },
      action2: function() {
        console.log('trigger another action');
      }
    }
    var items = [
      { labelText: "Do Alert", action: "actionAlert" },
      { labelText: "Label 2", action: "action2" }
    ];
    window.addEventListener( 'contextmenu', function(e) {
      e.preventDefault();
      THREEx.ContextMenu.contextmenu( scene, camera, items, actions );
    });
    window.addEventListener( 'click', function(e) {
      THREEx.ContextMenu.clear();
    });

<blockquote class="twitter-video" data-lang="en"><p lang="en" dir="ltr">Three.js contextmenu proof of concept <a href="https://t.co/O3PT0jzcZY">https://t.co/O3PT0jzcZY</a> <a href="https://twitter.com/hashtag/threejs?src=hash">#threejs</a> <a href="https://twitter.com/hashtag/javascript?src=hash">#javascript</a> <a href="https://t.co/JAKKwsmzfP">pic.twitter.com/JAKKwsmzfP</a></p>&mdash; Austin Gray (@AustinGray) <a href="https://twitter.com/AustinGray/status/814704649064349697">December 30, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>