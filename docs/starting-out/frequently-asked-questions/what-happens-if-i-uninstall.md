# What Happens If I Uninstall?

If you’re using Stackable in your site and decided to stop using the plugin, the following things would happen:

**1. The blocks would show an error**

In the block editor, the Stackable blocks would show an error since the plugin that supplied the blocks aren’t available anymore.

This is the normal behavior across any block that gets uninstalled, but it just means that they become uneditable in the block editor.

The blocks themselves would still remain in your page’s content though, and if needed you can still edit them manually via Code Editor.

**2. Some blocks would lose their styles in the frontend**

Since Stackable was removed, the main stylesheet that supplies all the styles for our blocks won’t be loaded anymore. Some Stackable blocks would look a bit wonky since they’re going to be missing some essential styling.

Some Stackable blocks would somewhat continue to look fine though, like Button blocks and Icon List blocks. And your buttons should still jump to the link they’re pointing at.

**3. Some blocks would stop working in the frontend**

In the frontend, for some functional Stackable blocks such as the Accordion block, Video Popup block or the Expand block, they would stop working.

The accordions would remain open, the video popup won’t pop up anymore and the expand block won’t show the expanded text.

This would happen because the scripts that contain the functionality for those blocks won’t be loaded anymore.

