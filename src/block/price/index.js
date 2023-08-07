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
import example from './example'
import deprecated from './deprecated'

export const settings = {
	...metadata,
	icon: PricingBoxIcon,
	attributes: schema,
	supports: {
		anchor: true,
		spacing: true,
	},
	example,
	deprecated,
	edit,
	save,
}
