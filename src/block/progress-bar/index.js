/**
 * BLOCK: Test Block.
 */

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import { ProgressBarIcon } from '~stackable/icons'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const settings = {
	...metadata,
	icon: ProgressBarIcon,
	attributes: schema,
	edit,
	save,
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ],
	},
}
