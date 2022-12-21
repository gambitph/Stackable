/**
 * BLOCK: Text Block.
 */
/**
 * External dependencies
 */
import { CountdownIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'

export const settings = {
	...metadata,
	edit,
	save,
	attributes: schema,
	icon: CountdownIcon,
}

