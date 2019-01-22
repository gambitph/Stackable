/**
 * Setup Jest + React + Enzyme testing.
 *
 * This setup comes from: https://hackernoon.com/testing-react-components-with-jest-and-enzyme-41d592c174f
 */

// Fixes Warning: React depends on requestAnimationFrame. Make sure that you load a polyfill in older browsers. http://fb.me/react-polyfills
// https://github.com/facebook/create-react-app/issues/3199#issuecomment-332842582
import 'raf/polyfill'

import {
	addAction, addFilter, applyFilters, doAction,
} from '@wordpress/hooks'
import Enzyme, {
	mount, render, shallow,
} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import lodash from 'lodash'
import React from 'react'

// React 16 Enzyme adapter
Enzyme.configure( { adapter: new Adapter() } )

// Make Enzyme functions available in all test files without importing
global.shallow = shallow
global.render = render
global.mount = mount

// We don't have access to wp.*, mimick it.
global.wp = {
	blocks: {
		registerBlockType: s => s,
	},
	i18n: {
		__: s => s,
	},
	components: {
		RangeControl: c => c,
		SelectControl: c => c,
		TextControl: c => c,
		ToggleControl: c => c,
		Dashicon: c => c,
		IconButton: c => c,
		Button: c => c,
		Toolbar: c => c,
		PanelBody: c => c,
		RadioControl: c => c,
		BaseControl: c => c,
	},
	editor: {
		InspectorControls: c => c,
		BlockControls: c => c,
		AlignmentToolbar: c => c,
		RichText: c => c,
		URLInput: c => c,
		MediaUpload: c => c,

		PanelColorSettings: c => c,
		BlockAlignmentToolbar: c => c,
	},
	hooks: {
		doAction, addAction, applyFilters, addFilter,
	},
	element: {
		Fragment: c => c,
		renderToString: () => 'dummy-string',
	},
}
global.wp.editor.RichText.isEmpty = cond => !! cond
global.wp.editor.RichText.Content = c => c
global.React = React
global.lodash = lodash
global.stackable = {}
