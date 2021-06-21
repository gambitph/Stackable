/**
 * Internal dependencies
 */
import './auto-change-responsive-preview'
import { updateMediaQueries } from './util'

/**
 * External dependencies
 */
import { throttle } from 'lodash'

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'
import { addAction } from '@wordpress/hooks'
import { select, subscribe } from '@wordpress/data'

const query = '.edit-post-visual-editor > .editor-styles-wrapper' +
	', .edit-post-visual-editor.editor-styles-wrapper' + // Fallback for < WP 5.6
	', .edit-post-visual-editor__content-area > div'

// The previous mode.
let previousMode = 'Desktop'

const viewportWidths = {
	Desktop: 2000,
	Tablet: 768,
	Mobile: 360,
}

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

	updateMediaQueries( mode, viewportWidths[ mode ] )
}

// Update the responsive preview when an attribute is changed.
addAction( 'stackable.setAttributes.after', 'stackable/responsive-preview', observerCallback )

const responsivePreview = () => {
	const unsubscribe = subscribe( () => {
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
		unsubscribe()
	} )
}

// Only do this when WP version is >=5.5
if ( select( 'core/edit-post' ).__experimentalGetPreviewDeviceType ) {
	domReady( responsivePreview )
}
