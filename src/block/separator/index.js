/**
 * BLOCK: Separator Block.
 */
/**
 * Internal dependencies
 */
import save from './save'
import edit from './edit'
import schema from './schema'
import metadata from './block.json'

/**
 * External dependencies
 */
import { SeparatorIcon } from '~stackable/icons'
import { applyFilters } from '@wordpress/hooks'

export const settings = applyFilters( 'stackable.block.metadata', {
	...metadata,
	icon: SeparatorIcon,
	supports: {
		align: [ 'full' ],
		anchor: true,
	},

	attributes: schema,
	edit,
	save,
} )
