/**
 * BLOCK: New Block.
 */

/**
 * External dependencies
 */
import { disabledBlocks, i18n } from 'stackable'
import { TextIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import './design'
import edit from './edit'
import save from './save'
import deprecated from './deprecated'
import schema from './schema'
import example from './example'

/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'

export const name = 'ugb/text'

export const settings = {
	title: __( 'Advanced Text', i18n ),
	description: __( 'Start with the building block of all page layouts.', i18n ),
	icon: TextIcon,
	category: 'common',
	keywords: [
		__( 'Text', i18n ),
		__( 'Pargraph', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	example,
	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
		anchor: true,
	},

	edit,
	save,
	deprecated,

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
		'advanced-column-spacing': {
			paddings: false,
		},
		'advanced-custom-attributes': true,
		'advanced-responsive': true,
		'advanced-conditional-display': true,
		'block-background': true,
		'block-separators': true,
		'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.text.custom-css.default', '' ),
		},
	},
}

// If the design was changed, force turn on the title.
addFilter( 'stackable.text.setAttributes', 'stackable/text/design', ( attributes, blockProps ) => {
	if ( typeof attributes.design === 'undefined' ) {
		return attributes
	}

	const blockAttributes = blockProps.attributes

	if ( attributes.design === 'side-title-1' || attributes.design === 'side-title-2' ) {
		if ( blockAttributes.design !== 'side-title-1' && blockAttributes.design !== 'side-title-2' ) {
			attributes.showTitle = true
		}
	}

	return attributes
} )
