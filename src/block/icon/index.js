/**
 * BLOCK: Icon Block
 */

/**
 * External dependencies
 */
import { IconIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import metadata from './block.json'
import schema from './schema'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const settings = {
	...metadata,
	icon: IconIcon,
	attributes: schema,
	supports: {
		anchor: true,
	},

	edit,
	save,
}
