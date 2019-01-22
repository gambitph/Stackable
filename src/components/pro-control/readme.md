# ProControl

Displays a "Go Pro" notice. To be used in the inspector.

## Props

#### `size`

`normal` or `small`. If `small`, the title will not be displayed.

#### `title`

#### `description`

#### `button`


## Usage

```
<PanelBody initialOpen={ false } title={ __( 'Design' ) }>
    <ProControl />
</PanelBody>
```

```
<PanelBody>
    // ...other stuff.
    <ProControl 
        size='small' 
        description={ __( 'Get more designs on Stackable Pro' ) } 
        />
</PanelBody>
```