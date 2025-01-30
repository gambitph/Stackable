import './design'
/**
 * BLOCK: Posts
 */
/**
 * Internal dependencies
 */
import variations from './variations'
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import example from './example'
import { BlogPostsIcon } from '~stackable/icons'
import deprecated from './deprecated'
import substitute from './substitute'

export const settings = {
	...metadata,
	icon: BlogPostsIcon,
	supports: {
		align: [ 'center', 'wide', 'full' ],
		anchor: true,
		stkAlign: true,
		spacing: true,
	},
	attributes: schema,
	example,
	deprecated,

	variations,
	edit,
	save,
	substitute,
}
