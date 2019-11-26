/**
 * BLOCK: Spacer Block.
 */

/**
 * External dependencies
 */
import { createResponsiveAttributes, createBackgroundAttributes } from '~stackable/util'

/**
 * Internal dependencies
 */
import deprecated from './deprecated'
import edit from './edit'
import save from './save'
import { SpacerIcon } from '~stackable/icons'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { disabledBlocks, i18n } from 'stackable'
import { addFilter, applyFilters } from '@wordpress/hooks'

export const schema = {
	...createResponsiveAttributes( '%sHeight', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( '%sHeightUnit', {
		type: 'string',
		default: 'px',
	} ),

	// Background.
	...createBackgroundAttributes( '%s' ),
}

export const name = 'ugb/spacer'

export const settings = {
	title: __( 'Spacer', i18n ),
	description: __( 'Sometimes you just need some space.', i18n ),
	icon: SpacerIcon,
	category: 'stackable',
	keywords: [
		__( 'Spacer', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	supports: {
		align: [ 'center', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	deprecated,
	edit,
	save,

	// Stackable modules.
	modules: {
		'block-separators': {
			enableBringToFront: false,
		},
		'advanced-responsive': true,
		'custom-css': {
			default: applyFilters( 'stackable.spacer.custom-css.default', '' ),
		},
	},
}

// Change the spacer height if a separator is turned on and the height is small.
addFilter( 'stackable.spacer.setAttributes', 'stackable/spacer/separator-padding', ( attributes, blockProps ) => {
	const {
		showTopSeparator = false,
		showBottomSeparator = false,
		height = '',
	} = blockProps.attributes
	const numSeparatorsBefore = ( showTopSeparator ? 1 : 0 ) + ( showBottomSeparator ? 1 : 0 )

	let turnedOnSeparator = false
	if ( typeof attributes.showTopSeparator !== 'undefined' ) {
		if ( attributes.showTopSeparator ) {
			turnedOnSeparator = true
		}
	}
	if ( typeof attributes.showBottomSeparator !== 'undefined' ) {
		if ( attributes.showBottomSeparator ) {
			turnedOnSeparator = true
		}
	}
	if ( turnedOnSeparator ) {
		const currentHeight = ! height ? 0 : height
		if ( numSeparatorsBefore === 0 && currentHeight < 200 ) {
			attributes.height = 200
			attributes.heightUnit = 'px'
		} else if ( numSeparatorsBefore === 1 && currentHeight < 400 ) {
			attributes.height = 400
			attributes.heightUnit = 'px'
		}
	}
	return attributes
} )
