# Global Settings - Global Colors

It allows users to create their own set of global color palette which
can be applied to Stackable and Native blocks.

## How Global Colors Works in the Editor

### ```editor-loader.js```
```editor-loader.js``` is responsible for generating global CSS variables. 

### ```editor-color-palette-change.js```
As of __WordPress v5.5.1__, changing the responsive preview mode and view mode resets the color palette. ```editor-color-palette-change.js``` is responsible for retrieving the global colors back to the editor.

## List of Action Hooks 
 
### ```stackable.global-colors.save-model-settings``` 
Action for saving/updating the global colors in ```stackable_global_colors```.

Doing this:
```js
const { colors } = useSelect( select => ( { colors: select('core/block-editor').getSettings().colors } ) )

useEffect( () => {
    doAction( 'stackable.global-colors.save-model-settings', colors )
}, [ colors ] )

```

will save the ```colors``` in ```stackable_global_colors``` and will update the block attributes with the most updated fallback values. We are constantly updating the fallback values since we don't want our color styles to break if Stackable is removed in list of plugins.

### ```stackable.global-settings.reset-compatibility```
Action for handling the reset button in the color picker. All added custom global colors will be removed.


## List of Filter Hooks

### ```stackable.global-settings.inspector```

This includes all the components rendered in the Global Settings sidebar.  

### ```stackable.util.hex-to-rgba```

Filter used in hexToRgba utility function. It serves as a compatibility filter for global colors.

### ```stackable.util.is-dark-color```

Filter used in isDarkColor utility function. It serves as a compatibility filter for global colors.
## How Global Colors Works in the Frontend

All global colors are saved in ```stackable_global_colors``` property in Gutenberg settings.
These are then accessed using PHP to generate CSS styles. The use of global css variables
allows us to apply these colors across the entire website.

The generated css style rules are divided into three parts:

- Standard Color Variables - these are the standard way of defining the global colors e.g. ```--stk-global-color-091820: #FFFFFF;```
- RGBA Color Variables - color variables in RGBA. These are mainly used by ```hexToRgba``` utility function. e.g. ```--stk-global-color-091820-rgba: 255, 255, 255;```
- Color Slug Classes - css rules mainly used by Native blocks e.g. ```.has-stk-global-color-091820 { color: #FFFFFF; }```

A sample generated global color styles:
```css
:root {
    --stk-global-color-2328: #2199c0;
    --stk-global-color-2328-rgba: 33, 153, 192;
    --stk-global-color-1544: #5a7d5c;
    --stk-global-color-1544-rgba: 90, 125, 92;
    --stk-global-color-47281: #4d8543;
    --stk-global-color-47281-rgba: 77, 133, 67;
    --stk-global-color-84891: #f9d6cf;
    --stk-global-color-84891-rgba: 249, 214, 207;
    --stk-global-color-63319: #86760d;
    --stk-global-color-63319-rgba: 134, 118, 13;
    --stk-global-color-39584: #7ed116;
    --stk-global-color-39584-rgba: 126, 209, 22
}

body .has-stk-global-color-2328-color {
     color: #2199c0 !important;
}
 body .has-stk-global-color-2328-background-color {
     background-color: #2199c0 !important;
}
 body .has-stk-global-color-1544-color {
     color: #5a7d5c !important;
}
 body .has-stk-global-color-1544-background-color {
     background-color: #5a7d5c !important;
}
 body .has-stk-global-color-47281-color {
     color: #4d8543 !important;
}
 body .has-stk-global-color-47281-background-color {
     background-color: #4d8543 !important;
}
 body .has-stk-global-color-84891-color {
     color: #f9d6cf !important;
}
 body .has-stk-global-color-84891-background-color {
     background-color: #f9d6cf !important;
}
```





