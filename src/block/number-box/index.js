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
import metadata from './block.json'

/**
 * WordPress dependencies
 */
// import { disabledBlocks } from 'stackable'
// import { addFilter, applyFilters } from '@wordpress/hooks'

export const name = 'stackable/number-box'

export const settings = {
	...metadata,
	icon: NumberBoxIcon,
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
