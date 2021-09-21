/**
 * BLOCK: Pricing Block
 */
/**
 * External dependencies
 */
import { PricingBoxIcon } from '~stackable/icons'

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
	icon: PricingBoxIcon,
	attributes: schema,
	supports: {
		anchor: true,
	},

	edit,
	save,
} )
