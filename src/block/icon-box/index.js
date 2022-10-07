/**
 * BLOCK: Container Block
 */
/**
 * Internal dependencies
 */
import metadata from './block.json'
import edit from './edit'
import save from './save'
import schema from './schema'
import example from './example'

/**
 * External dependencies
 */
import { IconBoxIcon } from '~stackable/icons'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const settings = {
	...metadata,
	icon: IconBoxIcon,
	attributes: schema,
	supports: {
		anchor: true,
		html: false,
		align: true,
	},
	example,

	edit,
	save,
}
