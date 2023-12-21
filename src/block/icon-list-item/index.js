/**
 * External dependencies
 */
import { TextIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import example from './example'

export const settings = {
	...metadata,
	icon: TextIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: true,
	},
	example,
	edit,
	save,
}
