/**
 * BLOCK: Design Library
 */
/**
 * External dependencies
 */
import { StackableIcon } from '~stackable/icons'
import { v2disabledBlocks as disabledBlocks } from 'stackable'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import _metadata from './block.json'

export const schema = {
	previewMode: {
		type: 'boolean',
		default: false,
	},
}

const {
	name,
	...metadata
} = _metadata

export { name }

export const settings = {
	...metadata,
	title: metadata.title + ' (v2)',
	icon: StackableIcon,
	attributes: schema,
	example: {
		attributes: {
			previewMode: true,
		},
	},

	supports: {
		customClassName: false,
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	edit,
	save,
}
