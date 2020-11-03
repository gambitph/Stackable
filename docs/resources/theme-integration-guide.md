# Theme Integration Guide

Stackable should fit themes generally well, but here are a few things that you can do to ensure that Stackable blocks would fit your theme's content area.

## Theme's Content Width

Some functionality in Stackable uses your theme's content width. To ensure the width is easily detected, make sure you define it in the theme's functions.php file:

```php
global $content_width;
$content_width = 640;
```

## Block Background Widths

One of the unique features in Stackable are [Block Backgrounds](../stackable-guides/beginner-guides/column-backgrounds-and-block-backgrounds.md). When Block Backgrounds are turned on, the block will go full width and you can control the width of the content to be centered, wide and full.

The inner widths are assigned different class names and you can target them via CSS:

```css
.ugb-inner-block--center {
    --block-max-width: 600px;
}
.ugb-inner-block--wide {
    --block-max-width: 1100px;
}
.ugb-inner-block--full {
    --block-max-width: 1400px;
}
```

## Adding More Font Picker Entries

You can modify the options of the Stackable font picker control using the JavaScript filter below.

```javascript
wp.domReady( () => {
	wp.hooks.addFilter( 'stackable.font-family-control.options', 'my-theme', options => {
	  // Add our theme font options
		if ( ! options.some( option => option.id === 'theme-font' ) ) {
			options.unshift(
				{
					id: 'theme-font',
					title: __( 'Theme Fonts', i18n ),
					options: [
						{ label: __( 'My Value', i18n ), value: 'My CSS font family' },
					],
				}
			)
		}
		return options
	} )
} )
```

The `value` parameter will be used in the CSS generated to style parts of Stackable blocks:

```css
font-family: "My CSS font family", sans-serif;
```

## Disabling Google Font Enqueuing

Stackable automatically enqueues all detected Google Fonts in our blocks. If you want to opt to disable Google Font enqueuing, you can use this PHP snippet.

```php
// Disable all Google Font enqueuing
add_filter( 'stackable_enqueue_font', '__return_false' );
```

You can also choose to disable enqueuing only for specific fonts.

```php
// Disable Google Font enqueuing for these values only
add_filter( 'stackable_enqueue_font', function( $do_enqueue, $font_name ) {
	if ( $font_name === 'Roboto' ) {
		return false;
	}
	return $do_enqueue;
}, 10, 2 );
```

