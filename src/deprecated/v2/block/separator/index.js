/**
 * BLOCK: Separator Block.
 */

/**
 * Internal dependencies
 */
import { default as deprecated } from './deprecated'
import { default as edit } from './edit'
import { default as save } from './save'
import schema from './schema'
import example from './example'
import _metadata from './block.json'

/**
 * External dependencies
 */
import { SeparatorIcon } from '~stackable/icons'

/**
 * WordPress dependencies
 */
import { disabledBlocks } from 'stackable'
import { applyFilters } from '@wordpress/hooks'

const {
	name,
	...metadata
} = _metadata

export { name }

export const settings = {
	...metadata,
	title: metadata.title + ' (v2)',
	icon: SeparatorIcon,
	attributes: schema,
	example,
	supports: {
		align: [ 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
		anchor: true,
	},
	deprecated,
	save,
	edit,

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-responsive': true,
		'advanced-block-spacing': {
			enableMarginRight: false,
			enableMarginLeft: false,
			enablePaddingRight: false,
			enablePaddingLeft: false,
			height: false,
			width: false,
			horizontalContentAlign: false,
			verticalContentAlign: false,
			modifyStyles: false,
			paddingUnits: [ 'px', 'em' ],
		},
		'advanced-custom-attributes': true,
		'custom-css': {
			default: applyFilters( 'stackable.separator.custom-css.default', '' ),
		},
	},
}
