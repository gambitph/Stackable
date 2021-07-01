/**
 * BLOCK: Card Block.
 */

/**
 * External dependencies
 */
import { NumberBoxIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
// import './design'
// import deprecated from './deprecated'
import edit from './edit'
import save from './save'
import schema from './schema'

/**
 * WordPress dependencies
 */
import { disabledBlocks, i18n } from 'stackable'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'

export const name = 'stackable/number-box'

export const settings = {
	title: __( 'Number Box', i18n ),
	description: __( 'Describe a single subject in a small card. You can use this to describe your product, service or a person.', i18n ),
	icon: NumberBoxIcon,
	category: 'layout',
	keywords: [
		__( 'Number Box', i18n ),
		__( 'Stackable', i18n ),
	],
	// parent: [ 'stackable/card-group' ],
	attributes: schema,
	supports: {
		inserter: false,
		anchor: true,
	},

	// deprecated,
	edit,
	save,

	// Stackable modules.
	// modules: {
	// 	'advanced-general': true,
	// 	'advanced-block-spacing': true,
	// 	'advanced-column-spacing': {
	// 		paddings: false,
	// 		verticalColumnAlign: true,
	// 	},
	// 	'advanced-responsive': true,
	// 	'block-background': true,
	// 	'block-separators': true,
	// 	'block-title': true,
	// 	'content-align': true,
	// 	'block-designs': true,
	// 	'custom-css': {
	// 		default: applyFilters( 'stackable.card.custom-css.default', '' ),
	// 	},
	// },
}

// For column spacings, use advanced paddings & vertical align on the content area only.
// addFilter( 'stackable.card.advanced-column-spacing.vertical-align.selector', 'stackable/card', () => '.ugb-card__content' )
