/**
 * BLOCK: Divider Block
 */
/**
 * External dependencies
 */
import { DividerIcon } from '~stackable/icons'

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
	icon: DividerIcon,
	attributes: schema,
	supports: {
		align: [ 'center', 'wide', 'full' ],
		anchor: true,
	},

	edit,
	save,
} )

