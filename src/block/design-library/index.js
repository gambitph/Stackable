/**
 * BLOCK: Design Library Block.
 */
/**
 * External dependencies
 */
import { StackableIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import metadata from './block.json'

export const settings = {
	...metadata,
	icon: StackableIcon,
	attributes: {
		previewMode: {
			type: 'boolean',
			default: false,
		},
	},
	supports: {
		stkSaveBlockStyle: false,
	},
	example: {
		attributes: {
			previewMode: true,
		},
	},
	edit,
	save,
}
