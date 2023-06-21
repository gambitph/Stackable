/**
 * BLOCK: New Block.
 */
/**
 * External dependencies
 */
import { TabsLabelIcon } from '~stackable/icons'

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

	icon: TabsLabelIcon,
	attributes: schema,
	supports: {
		anchor: true,
		reusable: false,
		stkSaveBlockStyle: false,
	},
	edit,
	save,
}
