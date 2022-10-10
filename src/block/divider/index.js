/**
 * BLOCK: Divider Block
 */
/**
 * External dependencies
 */
import { DividerIcon } from '~stackable/icons'

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
	icon: DividerIcon,
	attributes: schema,
	supports: {
		align: [ 'center', 'wide', 'full' ],
		anchor: true,
	},
	example,

	edit,
	save,
}
