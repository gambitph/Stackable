/**
 * BLOCK: New Block.
 */
/**
 * External dependencies
 */
// import { TextIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
// import transforms from './transforms'
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'

export const settings = {
	...metadata,

	// TODO: Change the icon to match the block.
	// icon: TextIcon,
	attributes: schema,
	supports: {
		anchor: true,
		reusable: false,
		stkSaveBlockStyle: false,
	},
	edit,
	save,
}
