/**
 * BLOCK: Design Library
 */
/**
 * External dependencies
 */
import { StackableIcon } from '~stackable/icons'
import {
	disabledBlocks, i18n, isContentOnlyMode,
} from 'stackable'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import InsertLibraryButton from './insert-library-button'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import domReady from '@wordpress/dom-ready'
import { render } from '@wordpress/element'

export const schema = {}

export const name = 'ugb/design-library'

export const settings = {
	title: __( 'Design Library', i18n ),
	description: __( 'Choose a layout or block from the Stackable Design Library.', i18n ),
	icon: StackableIcon,
	category: 'layout',
	keywords: [
		__( 'Design Library', i18n ),
		__( 'Element Layouts', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,

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

	const toolbar = document.querySelector( '.edit-post-header__toolbar' )
	if ( ! toolbar ) {
		return
	}

	const buttonDiv = document.createElement( 'div' )
	buttonDiv.classList.add( 'ugb-insert-library-button__wrapper' )

	if ( ! toolbar.querySelector( '.ugb-insert-library-button__wrapper' ) ) {
		render( <InsertLibraryButton />, buttonDiv )
		toolbar.appendChild( buttonDiv )
	}
}

domReady( mountDesignLibrary )
