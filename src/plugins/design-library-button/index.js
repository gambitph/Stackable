/**
 * External dependencies
 */
import { isContentOnlyMode } from 'stackable'

/**
 * Internal dependencies
 */
import DesignLibraryButton from './design-library-button'

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'
import { createRoot } from '@wordpress/element'
import { subscribe } from '@wordpress/data'

const mountDesignLibrary = () => {
	// Content only editing mode shouldn't have a button.
	if ( isContentOnlyMode ) {
		return
	}

	// Render our button.
	const buttonDiv = document.createElement( 'div' )
	buttonDiv.classList.add( 'ugb-insert-library-button__wrapper' )
	createRoot( buttonDiv ).render( <DesignLibraryButton /> )

	// Just keep on checking because there are times when the toolbar gets
	// unmounted.
	subscribe( () => {
		setTimeout( () => {
			const toolbar = document.querySelector( '.edit-post-header-toolbar' )
			if ( toolbar ) {
				// If the button gets lost, just attach it again.
				if ( ! toolbar.querySelector( '.ugb-insert-library-button__wrapper' ) ) {
					toolbar.appendChild( buttonDiv )
				}
			}
		}, 1 )
	} )
}

domReady( mountDesignLibrary )
