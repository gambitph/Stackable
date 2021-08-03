/**
 * BLOCK: Icon Button Block
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
import { ButtonIcon } from '~stackable/icons'

export const settings = {
	...metadata,
	icon: ButtonIcon,
	attributes: schema,
	supports: {
		anchor: true,
		stkBlockLinking: true,
	},

	edit,
	save,
}
