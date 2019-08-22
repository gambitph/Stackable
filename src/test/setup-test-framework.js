/**
 * WordPress dependencies
 */
import '@wordpress/jest-preset-default'

/**
 * External dependencies
 */
import '@babel/polyfill' // Fixes: ReferenceError: regeneratorRuntime is not defined

import {
	mount, render, shallow,
} from 'enzyme'
import React from 'react'

global.React = React

// Some may refer to wp.*, just prevent errors.
global.wp = {}

// Make Enzyme functions available in all test files without importing
global.shallow = shallow
global.render = render
global.mount = mount
