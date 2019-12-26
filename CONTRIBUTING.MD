👋 Hello!
=========

> Hold up! This document is a work in progress. It's currently a mixture of an outline & dev notes. We'll [Tweet](https://twitter.com/wpstackable) when it's ready, [so follow us](https://twitter.com/wpstackable).

We're thrilled that you want to help out in Stackable. This document should help you get started with everything you need.

🙋‍ Ways You Can Contribute
==========================

There are lots of ways to contribute, you don't even have to know code to help out. Here's a few things we need help on:

- Answering Questions
- [Writing Documentation](#-writing-documentation)
- [Designing New Blocks](#-design-rules)
- [Suggesting New Features](#-design-rules)
- Contributing Code / Fixing Bugs
- Writing Tests
- Spreading the Word

📐 Design Rules
============

TBA.

> But use https://github.com/CocoaPods/CocoaPods/wiki/Communication-&-Design-Rules for inspiration

👨‍💻 Starting Development
=======================

Installation:

```
$ npm install
```

Start development:

```
$ npm run start
```

🏢 Building
===========

Increment the version number in the header of `plugin.php`, e.g. `1.12.2` (the other version numbers in other places will match this)

Then run:

`npm run build`

The built plugin will be placed in the **build** directory.

Zip the folder inside the **build** directory to get the plugin installable zip file.

### To build for WP.org distribution:

Build, then upload to Freemius, and let Freemius generate the build.

Download the FREE build and commit that to WP.org.

💻 Development
==============

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

📟 Internet Explorer 11
=======================

Support for IE 11 should be the bare minimum. Instead of revamping designs in order to fully support IE 11, just ignore it when designing and implementing designs, and just add fallbacks for IE 11 after-the-fact. This allows us not to be hindered by the capabilities of non-modern browsers.

🏚 DEPRECATING: Adding New Features / Attributes to Blocks
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

🚨 IMPORTANT NOTES
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

📝 Writing Tests
=============

### Block Testing

Block testing is done in 5 steps, and covers the entirety of a block's codebase.

#### 1. Block Validation Tests

The tests for this reside in `__test__/index.test.js` and covers the following tests:
- Snapshot of the block with default attributes
- Snapshot of the block with all modified attributes
- Adding a block ➡️ Saving ️➡️ Editing again
- Adding a block ➡️ Modifying attributes ➡️ Saving ➡️ Editing again
- Adding a deprecated block ➡️ Migrating to the latest version ➡️ Editing
- Adding a deprecated block with modified attributes ➡️ Migrating to the latest version ➡️ Editing

This is the easiest of the tests to implement since this will mostly be copying and pasting from other existing blocks.

#### 2. Frontend Tests

The tests for this reside in `__test__/frontend.test.js` and handles all the frontend JS code if the block has them.

If a block has a `frontend.js` script that runs when the post is loaded, then we'll need to test everything in that script.

Testing frontend code is done using Vanilla JS + [@testing-library/dom](https://github.com/testing-library/dom-testing-library).

No React / Enzyme here since the we assume here that the HTML code already exists and the frontend code simply attaches to the already present HTML - just like how it is in actual webpages.

#### 3. Edit Tests

The tests for this reside in `__test__/edit.test.js` and handles all the editing form `edit.js` of the block.

> This part is still incomplete

#### 4. Save Tests

The tests for this reside in `__test__/save.test.js` and ensures that the saved block HTML from `save.js` is correct. E.g. images always have `alt` attributes and bug fix tests.

> This part is still incomplete

#### 5. Frontend Visual Tests

> This part is still incomplete

> Purpose: streamlined visual testing of block frontend final renders.
>
> Produce a visual compilation of the different deprecated frontend saved HTML.
>
> Output an HTML containing the saved block HTMLs + Block frontend CSS + Block frontend JS + Stackable's general CSS. All blocks should be working, with default / filled in attribute values. For easy manual visual inspection.

### Component Testing

TBA

📑 Writing Documentation
========================

TBA
