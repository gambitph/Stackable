Help Tooltips
=============

These are video tooltips that can be added to any control / component in the Inspector.

Development
===========

## Adding new entries

Pick a name unique to the help tooltip: e.g. "General Shadow". Keep note of the following slugs derived from the name:
* `general-shadow` kebabCase
* generalShadow camelCase

To add new entrie, you'll need to do 2 things in `videos.js`:

1. Import the video,

Make sure you add a video in **.mp4** format with the dimensions `600 x 450`, give it the **kebabCase** name, place it in the `videos` folder

```js
import generalBorderRadius from './videos/general-border-radius.mp4'
```

2. Add an entry to the `VIDEOS` object

Use the **camelCase** version as the key

```js
const VIDEOS = {
	// ...other entries
	generalBorderRadius: {
		video: generalBorderRadius,
		title: __( 'Border Radius', i18n ),
		description: __( 'Adjusts the radius of block corners to make them more rounded', i18n ),
		learnMore: 'https://wpstackable.com/blog',
	},
}
```

The `learnMore` property is optional. If not present, no learn more link will be displayed.

Usage
=====

You can use the entry by adding the corresponding `className` to the inspector control / component you want the tooltip to appear.

Use a className of `ugb--help-tip-kebabCase` where `kebabCase` is the **kebabCase** name.

For example:

```js
<AdvancedRangeControl
	label={ __( 'Shadow / Outline', i18n ) }
	value={ shadow }
	onChange={ shadow => setAttributes( { shadow } ) }
	className="ugb--help-tip-general-shadows"
/>
```

Deployment
==========

Be sure to deploy the video files in the CDN prior to plugin distribution.
