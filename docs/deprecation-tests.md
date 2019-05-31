# Deprecation Tests

As of v2.0.0, deprecation tests are done in the editor instead of cli. This is so that the block migration tests can be done in the actual environment where they will be used on.

> Previously, deprecation tests were done in cli and there were differences with how the parsing was performed. In some instances, that resulted in tests that passed, but actually failed in the block editor.

Block deprecation test files are placed located in:

`src/block/<block-name>/__test__/deprecated/<version-number>.js` 

Each file should contain a set of different block codes of the block created using different versions of Stackable.

> For example, `number-box/__test__/deprecated/1.15.1.js` should contain **Number Box** block codes created with **version 1.15.1**.

# What to Tests to Add

1. Default added block
2. Block with custom CSS added
3. Block code that was previously reported to have an error (to prevent any future reoccurence)
4. Blocks with a few settings changed
5. Blocks with a lot of settings changed

# Test File Template

A deprecation test file should have this format. This was taken off the 1.15.1 test for the Number Box:

```js
/**
 * This file contains saved block HTML from older versions.
 * These will be tested if they pass migration.
 * This will be built into the dist folder as `deprecation-tests.json`
 */

module.exports = [
	{
		block: 'Number Box',
		version: '1.15.1',
		description: 'Default block',
		html: `<!-- wp:ugb/number-box -->
		<div class="wp-block-ugb-number-box ugb-number-box ugb-number-box--v2 ugb-number-box--columns-3"><div class="ugb-number-box__item"><span class="ugb-number-box__number">01</span><div class="ugb-number-box__content"><h4 class="ugb-number-box__title">Title</h4><p class="ugb-number-box__description">Description for this block. Use this space for describing your block. Any text will do.</p></div></div><div class="ugb-number-box__item"><span class="ugb-number-box__number">02</span><div class="ugb-number-box__content"><h4 class="ugb-number-box__title">Title</h4><p class="ugb-number-box__description">Description for this block. Use this space for describing your block. Any text will do.</p></div></div><div class="ugb-number-box__item"><span class="ugb-number-box__number">03</span><div class="ugb-number-box__content"><h4 class="ugb-number-box__title">Title</h4><p class="ugb-number-box__description">Description for this block. Use this space for describing your block. Any text will do.</p></div></div></div>
		<!-- /wp:ugb/number-box -->`,
		// skip: 'Some reason for skipping the test' // If provided, this test will still be displayed, but will not be run.
	},
	// ...other tests.
]
```
