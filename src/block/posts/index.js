import './design'
/**
 * BLOCK: Posts
 */
/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import { BlogPostsIcon } from '~stackable/icons'

export const settings = {
	...metadata,
	icon: BlogPostsIcon,
	supports: {
		align: [ 'center', 'wide', 'full' ],
		anchor: true,
	},
	attributes: schema,

	edit,
	save,
}
