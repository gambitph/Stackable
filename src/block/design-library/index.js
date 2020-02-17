/**
 * BLOCK: Design Library
 */
/**
 * External dependencies
 */
import { StackableIcon } from '~stackable/icons'
import { disabledBlocks, i18n } from 'stackable'

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
	category: 'stackable',
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

domReady( () => {
	const toolbar = document.querySelector( '.edit-post-header-toolbar' )
	if ( ! toolbar ) {
		return
	}
	const buttonDiv = document.createElement( 'div' )
	toolbar.appendChild( buttonDiv )

	render( <InsertLibraryButton />, buttonDiv )
} )
