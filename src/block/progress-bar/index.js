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
import deprecated from './deprecated'
import example from './example'
import { ProgressBarIcon } from '~stackable/icons'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const settings = {
	...metadata,
	icon: ProgressBarIcon,
	attributes: schema,
	example,
	edit,
	save,
	deprecated,
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ],
		spacing: true,
	},
}
