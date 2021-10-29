/**
 * BLOCK: Card Block.
 */

/**
 * External dependencies
 */
import { FeatureIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import example from './example'
import deprecated from './deprecated'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

export const settings = applyFilters( 'stackable.block.metadata', {
	...metadata,
	icon: FeatureIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ],
		stkBlockLinking: false, // Disable linking on the columns in this block.
		stkAlign: true,
	},
	example,
	deprecated,
	//  styles: blockStyles,

	// deprecated,
	edit,
	save,
} )
