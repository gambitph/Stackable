/**
 * BLOCK: Spacer Block.
 */

import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { createResponsiveAttributes } from '@stackable/util'
import deprecated from './deprecated'
import { disabledBlocks } from 'stackable'
import edit from './edit'
import save from './save'
import { SpacerIcon } from '@stackable/icons'

export const schema = {
	...createResponsiveAttributes( '%sHeight', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( '%sHeightUnit', {
		type: 'string',
		default: 'px',
	} ),
}

export const name = 'ugb/spacer'

export const settings = {
	title: __( 'Spacer' ),
	description: __( 'Sometimes you just need some space.' ),
	icon: SpacerIcon,
	category: 'stackable',
	keywords: [
		__( 'Spacer' ),
		__( 'Stackable' ),
	],
	attributes: schema,
	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	deprecated,
	edit,
	save,

	// Stackable modules.
	modules: {
		'advanced-responsive': true,
		'custom-css': {
			default: applyFilters( 'stackable.spacer.custom-css.default', '' ),
		},
	},
}
