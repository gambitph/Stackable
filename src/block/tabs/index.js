/**
 * BLOCK: New Block.
 */
/**
 * External dependencies
 */
import { TabsIcon } from '~stackable/icons'

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

	icon: TabsIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ], // Only select alignments.

		// For blocks that can go full-width, this option shows another
		// option to change the alignment of the block's content, usually used
		// by containers.
		stkAlign: true,

		// By default, the Style tab is opened. Uncomment if you want to
		// change the default open tab. For container blocks, set this to
		// 'layout'.
		stkDefaultTab: 'layout',

		// If this block contains inner columns, uncomment this if you
		// want to disable the resize handlers of the inner columns.
		stkColumnResize: false,
		spacing: true,
	},
	example,
	edit,
	save,
}
