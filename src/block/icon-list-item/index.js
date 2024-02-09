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

export const settings = {
	...metadata,
	icon: IconListItemIcon,
	attributes: schema,
	supports: {
		anchor: true,
		__experimentalSelector: 'li',
	},
	example,
	edit,
	save,
	merge( attributes, attributesToMerge ) {
		return {
			...attributes,
			text: attributes.text + attributesToMerge.text,
		}
	},
}
