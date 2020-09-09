# Global Settings - Global Colors

It allows users to create their own set of global color palette which
can be applied to all blocks.

## List of Action Hooks
### ```stackable.global-settings.global-styles``` 
Action for updating the global custom css variables in the editor.

Doing this:

```js
const colors = [ 
        { 
            name: 'Stackable Global Color 1',
            slug: 'stk-global-color-2532351235',
            color: 'var(--stk-global-color-aeb2rd, #ffffff)',
            colorVar: '--stk-global-color-aeb2rd',
            fallback: '#ffffff',
            rgb: '255, 255, 255',
        } 
    ]

doAction( 'stackable-global-settings.global-styles', colors )
```

will generate these css rules in the editor:
```html
<style id="stackable-global-colors">
:root: {
    --stk-global-color-aeb2rd: #ffffff;
    --stk-global-color-aeb2rd-rgba: 255, 255, 255;
}
</style>
```
 
### ```stackable.global-settings.save-model-settings``` 
Action for saving/updating the global colors in models settings and fallback values in existing blocks using the global color.

Doing this:
```js
const colors = [ 
        { 
            name: 'Stackable Global Color 1',
            slug: 'stk-global-color-2532351235',
            color: 'var(--stk-global-color-aeb2rd, #ffffff)',
            colorVar: '--stk-global-color-aeb2rd',
            fallback: '#ffffff',
            rgb: '255, 255, 255',
        } 
    ]

doAction( 'stackable-global-settings.save-model-settings', colors )
```

will save the ```colors``` in ```stackable_global_colors``` and will update the block attributes with the most updated fallback values. We are constantly updating the fallback values since we don't want their color styles to break if they removed Stackable in their list of plugins.

### ```stackable.global-settings.reset-compatibility```
Action for handling the reset button in the Stackable Global Colors Sidebar. Resetting the color palette will revert to its original colors.

All added custom global colors will be removed. And all block attributes using custom global colors will be updated.


## List of Filter Hooks

### ```stackable.global-settings.inspector```

This includes all the components rendered in the Global Settings sidebar.  





