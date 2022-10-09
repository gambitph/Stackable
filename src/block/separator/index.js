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
import example from './example'

/**
 * External dependencies
 */
import { SeparatorIcon } from '~stackable/icons'

export const settings = {
	...metadata,
	icon: SeparatorIcon,
	supports: {
		align: [ 'full' ],
		anchor: true,
	},
	example,

	attributes: schema,
	edit,
	save,
}
