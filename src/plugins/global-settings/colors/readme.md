# Global Settings - Global Colors

It allows users to create their own set of global color palette which
can be applied to all blocks.

## List of Action Hooks / Functions
### ```renderGlobalStyles``` 
Function for updating the global custom css variables in the editor.

Doing this:

```js
const { colors } = useSelect( select => ( { colors: select('core/block-editor').getSettings().colors } ) )
const [ styles, setStyles ] = useState( '' )

useEffect( () => {
    renderGlobalStyles( colors )
}, [ colors ] )

return <style>{ styles }</style>
```

will generate these css rules in the editor:
```html
<style>
:root: {
    --stk-global-color-aeb2rd: #ffffff;
    --stk-global-color-aeb2rd-rgba: 255, 255, 255;
}
</style>
```
 
### ```saveModelSettings``` 
Function for saving/updating the global colors in models settings and fallback values in existing blocks using the global color.

Doing this:
```js
const { colors } = useSelect( select => ( { colors: select('core/block-editor').getSettings().colors } ) )
const [ styles, setStyles ] = useState( '' )

useEffect( () => {
    saveModelSettings( colors )
}, [ colors ] )

return <style>{ styles }</style>
```

will save the ```colors``` in ```stackable_global_colors``` and will update the block attributes with the most updated fallback values. We are constantly updating the fallback values since we don't want their color styles to break if they removed Stackable in their list of plugins.

### ```stackable.global-settings.reset-compatibility```
Action for handling the reset button in the Stackable Global Colors Sidebar. Resetting the color palette will revert to its original colors.

All added custom global colors will be removed. And all block attributes using custom global colors will be updated.


## List of Filter Hooks

### ```stackable.global-settings.inspector```

This includes all the components rendered in the Global Settings sidebar.  





