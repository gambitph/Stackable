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
import { settings as _settings } from 'stackable'

export const settings = {
	...metadata,
	icon: BlogPostsIcon,
	supports: {
		inserter: ! _settings.stackable_disabled_blocks.includes( metadata.name ),
		align: [ 'center', 'wide', 'full' ],
		anchor: true,
	},
	attributes: schema,

	edit,
	save,
}
