# Global Settings - Global Colors

It allows users to create their own set of global color palette which
can be applied to Stackable blocks.

As of v3.11.0, Global Colors are no longer applied to the Native color palette and are only available for Stackable blocks - this is to prevent conflicts and to keep Stackable functionality to our blocks only.

## How Global Colors Works in the Editor

### ```editor-loader.js```
```editor-loader.js``` is responsible for generating global CSS variables. 


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

**DEPRECATED**

**(We will keep this here for now, but since Global Colors will no longer be available for Native blocks, this will no longer have any purpose except for backward compatibility. Consider only generating this code only when it's detected the website updated from a Stackable version < 3.11.0)**

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





