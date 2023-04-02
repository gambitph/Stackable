/**
 * BLOCK: Image Box Block.
 */

/**
 * External dependencies
 */
import { ImageBoxIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import variations from './variations'
import metadata from './block.json'
import example from './example'

export const settings = {
	...metadata,
	icon: ImageBoxIcon,
	supports: {
		anchor: true,
		align: true,
		stkAlign: true,
		stkColumnResize: false,
	},
	attributes: schema,
	example,

	variations,
	edit,
	save,
}
