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

export const settings = {
	...metadata,
	icon: SpacerIcon,
	attributes: schema,
	supports: {
		anchor: true,
	},

	edit,
	save,
}
