/**
 * BLOCK: Count Up Block.
 */
/**
 * External dependencies
 */
import { NumberBoxIcon } from '~stackable/icons'

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
	icon: NumberBoxIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: true,
		spacing: true,
	},
	example,
	deprecated,
	edit,
	save,
}
