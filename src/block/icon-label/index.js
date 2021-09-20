/**
 * BLOCK: Icon Label Block
 */
/**
 * External dependencies
 */
import { IconLabelIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import { applyFilters } from '@wordpress/hooks'

export const settings = applyFilters( 'stackable.block.metadata', {
	...metadata,
	icon: IconLabelIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ],
		stkBlockLinking: false, // Disable linking on the columns in this block.
	},

	edit,
	save,
} )
