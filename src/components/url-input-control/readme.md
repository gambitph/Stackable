# URLInputControl

Displays a URL input field with a new tab option.

Meant to be used inside the editor.

## Props

#### `value`

The URL

#### `newTab`

Boolean. Open in new tab.

#### `onChange`

#### `onChangeNewTab`

If not given, the new tab option is not displayed.

## Usage

```
{ isSelected && (
	<URLInputControl
		value={ link }
		newTab={ newTab }
		onChange={ link => setAttributes( { link } ) }
		onChangeNewTab={ newTab => setAttributes( { newTab } ) }
	/>
) }
```
