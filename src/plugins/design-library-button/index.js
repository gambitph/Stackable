/**
 * External dependencies
 */
import { isContentOnlyMode } from 'stackable'
import { throttle } from 'lodash'

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

	const createButton = toolbar => {
		const buttonDiv = document.createElement( 'div' )
		buttonDiv.classList.add( 'ugb-insert-library-button__wrapper' )

		createRoot( buttonDiv ).render( <DesignLibraryButton /> )
		toolbar.appendChild( buttonDiv )
	}

	// Just keep on checking because there are times when the toolbar gets
	// unmounted.
	subscribe( throttle( () => {
		const toolbar = document.querySelector( '.edit-post-header-toolbar' )
		if ( ! toolbar ) {
			return
		}

		if ( ! toolbar.querySelector( '.ugb-insert-library-button__wrapper' ) ) {
			createButton( toolbar )
		}
	}, 200, { trailing: true } ) )
}

domReady( mountDesignLibrary )
