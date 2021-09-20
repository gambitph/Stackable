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
import { render } from '@wordpress/element'
import { subscribe } from '@wordpress/data'

const mountDesignLibrary = () => {
	// Content only editing mode shouldn't have a button.
	if ( isContentOnlyMode ) {
		return
	}

	let timeout = null
	const unsubscribe = subscribe( () => {
		const toolbar = document.querySelector( '.edit-post-header-toolbar' )
		if ( ! toolbar ) {
			return
		}

		const buttonDiv = document.createElement( 'div' )
		buttonDiv.classList.add( 'ugb-insert-library-button__wrapper' )

		if ( ! toolbar.querySelector( '.ugb-insert-library-button__wrapper' ) ) {
			render( <DesignLibraryButton />, buttonDiv )
			toolbar.appendChild( buttonDiv )
		}

		if ( timeout ) {
			clearTimeout( timeout )
		}

		timeout = setTimeout( () => {
			if ( document.querySelector( '.ugb-insert-library-button__wrapper' ) ) {
				unsubscribe()
			}
		}, 0 )
	} )
}

domReady( mountDesignLibrary )
