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
import transforms from './transforms'
import deprecated from './deprecated'

/**
 * External dependencies
 */
import { IconButtonIcon } from '~stackable/icons'

export const settings = {
	...metadata,
	icon: IconButtonIcon,
	attributes: schema,
	supports: {
		anchor: true,
	},
	transforms,
	deprecated,
	edit,
	save,
}
