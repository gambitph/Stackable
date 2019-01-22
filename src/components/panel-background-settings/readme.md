# Panel Background Settings

A set of inspector settings to modify the block's background

## Usage

```jsx
<PanelBackgroundSettings
    backgroundColor={ backgroundColor }
    backgroundImageID={ backgroundImageID }
    backgroundImageURL={ backgroundImageURL }
    backgroundOpacity={ backgroundOpacity }
    fixedBackground={ fixedBackground }
    onChangeBackgroundColor={ backgroundColor => setAttributes( { backgroundColor } ) }
    onChangeBackgroundImage={ ( { url, id } ) => setAttributes( { backgroundImageURL: url, backgroundImageID: id } ) }
    onRemoveBackgroundImage={ () => { setAttributes( { backgroundImageURL: '', backgroundImageID: 0 } ) } }
    onChangeBackgroundOpacity={ backgroundOpacity => setAttributes( { backgroundOpacity } ) }
    onChangeFixedBackground={ value => setAttributes( { fixedBackground: !! value } ) }
/>
```

To implement the background settings to the block's main container:

- Add the class `ugb-has-background` if there's a background color or background image
- Add the class `ugb-has-background-image` if there a background image
- Add the style `--ugb-background-color` with the chosen background color
- Add the class `ugb-has-background-opacity-#` with the number 0-10

```js
import classnames from 'classnames'

export const save = ( props ) => {
    const { className } = props
    const { 
        backgroundOpacity, 
        backgroundColor, 
        backgroundImageID, 
        backgroundImageURL,
        fixedBackground,
    } = props.attributes

	const mainClasses = classnames( [
		className,
        'ugb-has-background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], {
		'ugb-has-background': backgroundColor || backgroundImageURL,
		'ugb-has-background-image': backgroundImageURL,
	} )

	const mainStyle = {
		'backgroundColor': backgroundColor ? backgroundColor : undefined,
		'backgroundImage': backgroundImageURL ? `url(${backgroundImageURL})` : undefined,
		'backgroundAttachment': fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': backgroundImageURL ? backgroundColor : undefined,
    }

    return (
        <div className={ mainClasses } style={ mainStyle }>
            // ...
        </div>
    )
}
```