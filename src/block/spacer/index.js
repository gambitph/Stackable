/**
 * BLOCK: Spacer Block
 */
/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'

/**
 * External dependencies
 */
import { SpacerIcon } from '~stackable/icons'
import { applyFilters } from '@wordpress/hooks'

export const settings = applyFilters( 'stackable.block.metadata', {
	...metadata,
	icon: SpacerIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ],
	},

	edit,
	save,
} )
