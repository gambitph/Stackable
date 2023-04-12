/**
 * BLOCK: New Block.
 */
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
	// TODO: Change the icon to match the block.
	icon: TextIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ], // Only select alignments.
		stkAlign: true,
		stkSaveBlockStyle: false,
		stkDefaultTab: 'layout',
		stkColumnResize: false,
		stkBlockLinking: true,
	},
	example,
	edit,
	save,
}