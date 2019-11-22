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
import { applyFilters } from '@wordpress/hooks'

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
