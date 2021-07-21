/**
 * BLOCK: Design Library
 */
/**
 * External dependencies
 */
import { StackableIcon } from '~stackable/icons'
import {
	disabledBlocks, isContentOnlyMode,
} from 'stackable'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import InsertLibraryButton from './insert-library-button'
import _metadata from './block.json'

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'
import { render } from '@wordpress/element'
import { subscribe } from '@wordpress/data'

export const schema = {
	previewMode: {
		type: 'boolean',
		default: false,
	},
}

const {
	name,
	...metadata
} = _metadata

export { name }

export const settings = {
	...metadata,
	icon: StackableIcon,
	attributes: schema,
	example: {
		attributes: {
			previewMode: true,
		},
	},

	supports: {
		customClassName: false,
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	edit,
	save,
}

const mountDesignLibrary = () => {
	// Content only editing mode shouldn't have a button.
	if ( isContentOnlyMode ) {
		return
	}

	if ( disabledBlocks.includes( name ) ) {
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
			render( <InsertLibraryButton />, buttonDiv )
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
