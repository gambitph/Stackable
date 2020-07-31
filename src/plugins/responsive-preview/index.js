/**
 * Internal dependencies
 */
import './auto-change-responsive-preview'
import { cacheCssObject, updateMediaQuery } from './util'

/**
 * External dependencies
 */
import { throttle } from 'lodash'

/**
 * Wordpress dependencies
 */
import domReady from '@wordpress/dom-ready'
import { addAction } from '@wordpress/hooks'
import { select } from '@wordpress/data'

const query = '.edit-post-visual-editor'

/**
 * CSS files to cache
 *
 * It includes Stackable custom css files and inline styles for blocks.
 */
const matchingCSSFiles = [
	null, // Include style tags.
	'/dist/frontend_blocks__premium_only.css',
	'/dist/frontend_blocks.css',
	'/dist/editor_blocks__premium_only.css',
	'/dist/editor_blocks.css',
]

// Cache the cssObject
const cssObject = {}
// Cache the cssRules
const cssRulesCache = {}

// The previous mode.
let previousMode = 'Desktop'

// Cache the responsive widths of the preview.
const widthsDetected = {}

const observerCallback = () => {
	const {
		__experimentalGetPreviewDeviceType: getPreviewDeviceType,
	} = select( 'core/edit-post' )

	// Only call when getPreviewDeviceType is defined. Only in WP >= 5.5
	if ( ! getPreviewDeviceType ) {
		return
	}

	const mode = getPreviewDeviceType()

	// Only call when switching to desktop, or in responsive mode.
	if ( mode === 'Desktop' && previousMode === 'Desktop' ) {
		return
	}
	previousMode = mode

	// Gets the current width of the visual editor
	// Cache the width since it's expensive to perform getComputedStyle
	if ( ! widthsDetected[ mode ] ) {
		const visualEditorEl = document.querySelector( query )
		widthsDetected[ mode ] = parseInt( window.getComputedStyle( visualEditorEl ).width, 10 )
	}

	// Populate the cssObject with media queries and cache values if necessary.
	cacheCssObject( document, cssObject, cssRulesCache, matchingCSSFiles )

	// Update the media query
	updateMediaQuery( document, cssObject, mode, widthsDetected[ mode ] )
}

// Update the responsive preview when an attribute is changed.
addAction( 'stackable.setAttributes.after', 'stackable/responsive-preview', observerCallback )

const responsivePreview = () => {
	const visualEditorEl = document.querySelector( query )
	if ( ! visualEditorEl ) {
		return
	}

	// Observe all changes of the element
	const config = {
		attributes: true, childList: true, subtree: true,
	}

	// Listen to changes in the editor.
	const visualEditorElObserver = new MutationObserver( throttle( observerCallback, 500 ) )

	visualEditorElObserver.observe( visualEditorEl, config )
}

// Only do this when WP version is >=5.5
if ( select( 'core/edit-post' ).__experimentalGetPreviewDeviceType ) {
	domReady( responsivePreview )
}
