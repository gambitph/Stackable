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

/**
 * External dependencies
 */
import { ContainerIcon } from '~stackable/icons'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const settings = {
	...metadata,
	icon: ContainerIcon,
	attributes: schema,
	supports: {
		anchor: true,
		html: false,
		align: true,
	},

	edit,
	save,
}
