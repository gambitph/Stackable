/**
 * BLOCK: Icon Label Block
 */
/**
 * External dependencies
 */
import { IconLabelIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import example from './example'
import deprecated from './deprecated'
import substitute from './substitute'

export const settings = {
	...metadata,
	icon: IconLabelIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ],
		stkBlockLinking: false, // Disable linking on the columns in this block.
		spacing: true,
	},
	example,
	deprecated,
	edit,
	save,
	substitute,
}
