/**
 * External dependencies
 */
import { IconListItemIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import example from './example'
import deprecated from './deprecated'

export const settings = {
	...metadata,
	icon: IconListItemIcon,
	attributes: schema,
	supports: {
		anchor: true,
		__experimentalSelector: 'li',
		reusable: false,
		stkSaveBlockStyle: false,
		splitting: true,
	},
	example,
	edit,
	save,
	deprecated,
	merge( attributes, attributesToMerge ) {
		return {
			...attributes,
			text: attributes.text + attributesToMerge.text,
		}
	},
}
