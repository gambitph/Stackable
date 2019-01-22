Starting Development
====================

Installation:

```
$ npm install
```

Start development:

```
$ npm run start
```

BUILDING
========

When building, the plugin will be placed in the **build** directory afterwards.

You can zip the folder inside the **build** directory and it will be ready for distribution.

#### To build for PRO distribution:

`npm run build`

Then upload to Freemius.

#### To build for FREE WP.org distribution:

Perform the PRO distribution above, and let Freemius generate the FREE build.

Download the FREE build and commit that to WP.org.

Note: There is no direct build process for FREE.

Development
===========

`init.php`

This is loaded by the plugin, add PHP functions here.

`src/blocks.js`

All main block scripts (index.js) should be added in this file. It should not
contain anything else.

`src/block/<blockname>`

Each block should have it's own directory and should have the following files:

`src/block/<blockname>/index.js`

The main block script component.

`src/block/<blockname>/editor.scss`

Styles for the block for use in the backend editor only.

`src/block/<blockname>/frontend.js`

Scripts for the block in the frontend.

`src/block/<blockname>/style.scss`

Styles for the block in the frontend.

DEPRECATING: Adding New Features / Attributes to Blocks
=======================================================

Gutenberg has a block [deprecation system](https://wordpress.org/gutenberg/handbook/block-api/deprecated-blocks/) in place that we use. We also have a few steps that we need to perform in order to maintain a clean code structure.

A block gets *deprecated* when something is changed in its `save` function or `attriubte` list (e.g. when you add a feature or rename an attribute). When the content editor starts up, these 2 are checked, and if the `save` output doesn't match the block in the editor, an error shows up and there will be no way to edit the block.

Deprecating a block means that we tell the editor that the block will encounter an error (since we changed its `save` & `attributes`) and how it should deal with the changes.

When deprecating a block, we're basically saving the block's old `save` function and `attribute` list. We're also telling the editor how to migrate the old `attribute` list to the new `attribute` list via a `migrate` function.

Deprecation steps:
1. Create a `deprecated.js` file in the block's folder, we will keep all deprecated code there.
2. Copy the entire `save` function and add it to the `deprecated.js` file, export it as `deprecatedSave_#_#` The `#_#` represents the *version* number when the code was deprecated (this is the current version of the plugin when you're doing the deprecation).

For example:
```js
const save = ( props ) => {
    // ...
}
```

Becomes for v1.5 in `deprecated.js`:
```js
export const deprecatedSave_1_5 = ( props ) => {
    // ...
}
```

3. Copy the entire `attributes` object and add it to the `deprecated.js` file, export it as `deprecatedSchema_#_#`. The `#_#` is for the version as well.

For example:
```js
const schema = {
    // ...
}
```

Becomes for v1.5 in `deprecated.js`:
```js
export const deprecatedSchema_1_5 = {
    // ...
}
```

4. Import the deprecated items in the block's `registerBlockType` call.

Note that any functions created and used in the deprecated `save` function and `attributes` list should be copied into `deprecated.js` and follow the `deprecatedName_#_#` convention as well. This is to ensure that all deprecated code will continue to work.

IMPORTANT NOTES
===============

* When creating new files, be sure to re-run `npm run start`
* NEVER use `<RichText tagName="span">` or any [inline tags](https://github.com/WordPress/gutenberg/issues/7311#issuecomment-452684385), ONLY use block tags like `div`

* ALWAYS sanitize user inputted attributes with `striptags`:

  ```js
  import striptags from 'striptags'

  // ...
  const title = `<strong>User inputted text</strong>`
  <img alt={ striptags( title ) } />

  // Output:
  <img alt="User inputted text" />
  ```

* FOLLOW the deprecating standard above.
* ALWAYS add an `align` attribute if the block supports align:

  ```js
  align: {
	  type: 'string',
  }
  ```

* ALWAYS add a new deprecation entry when adding new attributes, and add a default value in its `migrate` method:

  ```js
  // New attribute
  // ...
  shadow: {
	  type: 'number',
	  default: 3,
  },

  // deprecated.js
  // New entry...
  migrate: attributes => {
	  return {
		  ...attributes,
		  shadow: 3,
	  }
  },

* ALWAYS add default values when using block attributes in `edit()` and `save()` methods.
This is to prevent errors when upgrading Stackable.
