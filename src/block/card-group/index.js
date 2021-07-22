/**
 * BLOCK: Card Block.
 */

/**
 * External dependencies
 */
import { CardIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import variations from './variations'
import metadata from './block.json'

export const name = 'stackable/card-group'

export const settings = {
	...metadata,
	icon: CardIcon,
	attributes: schema,
	supports: {
		// inserter: false,
		anchor: true,
		align: true,
	},

	variations,
	edit,
	save,
}
