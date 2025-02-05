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
// import transforms from './transforms'
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import example from './example'
import substitute from './substitute'

export const settings = {
	/**
	 * TODO: Adjust the metadata for this block. See the guide as to what the settings mean here:
	 *
	 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/
	 */
	...metadata,

	// TODO: Change the icon to match the block.
	icon: TextIcon,
	attributes: schema,
	supports: {
		anchor: true,

		// TODO: Remove this if we don't want to allow alignment. e.g. if this
		// is a smaller unit block.
		align: true, // This allows all alignments.
		// align: [ 'center', 'wide', 'full' ], // Only select alignments.

		// TODO: For blocks that can go full-width, this option shows another
		// option to change the alignment of the block's content, usually used
		// by containers.
		// stkAlign: true,

		// TODO: If the block has variations, it will have a reset button to
		// reset the layout. Set this to false to remove the reset button.
		// stkLayoutReset: false,

		// TODO: Blocks can be saved as the default block. Set this to false to
		// prevent blocks from being saved as the default block. e.g. if this is
		// a block that can't stand on its own like a column block, or blocks
		// that can't have a modified default block like a Columns block.
		// stkSaveBlockStyle: false,

		// TODO: By default, the Style tab is opened. Uncomment if you want to
		// change the default open tab. For container blocks, set this to
		// 'layout'.
		// stkDefaultTab: 'layout',

		// TODO: If this block contains inner columns, uncomment this if you
		// want to disable the resize handlers of the inner columns.
		// stkColumnResize: false,

		// TODO: If this block contains inner columns, uncomment this if you
		// want it to support block linking. accross the inner columns.
		// stkBlockLinking: true,
	},
	example,
	edit,
	save,
	substitute,

	// TODO: Uncomment this if we will allow transformation from other blocks to this block.
	// transforms,
}
