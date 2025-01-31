/**
 * BLOCK: Countdown Block.
 */
/**
 * External dependencies
 */
import { CountdownIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import example from './example'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import deprecated from './deprecated'
import substitute from './substitute'

export const settings = {
	...metadata,
	icon: CountdownIcon,
	edit,
	save,
	example,
	deprecated,
	attributes: schema,
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ],
		spacing: true,
	},
	substitute,
}

