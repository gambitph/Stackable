/**
 * External dependencies
 */
import '@babel/polyfill' // Fixes: ReferenceError: regeneratorRuntime is not defined

import React from 'react'
import '@testing-library/jest-dom'
import fetch from 'node-fetch'

global.React = React

jest.mock( '@wordpress/element', () => ( {
	...global.React,
	render: jest.fn(),
} ) )

// Some may refer to wp.*, just prevent errors.
global.wp = {}

global.window.requestAnimationFrame = setTimeout
global.window.cancelAnimationFrame = clearTimeout

global.window.matchMedia = () => ( {
	matches: false,
	addListener: () => {},
	removeListener: () => {},
} )

// Setup fake localStorage
const storage = {}
global.window.localStorage = {
	getItem: key => key in storage ? storage[ key ] : null,
	setItem: ( key, value ) => storage[ key ] = value,
}

// Fix for Error: Not implemented: HTMLMediaElement.prototype.play
// @see https://github.com/jsdom/jsdom/issues/2155
global.window.HTMLMediaElement.prototype.play = () => { /* do nothing */ }

// Fix for window.fetch not available
global.fetch = fetch
