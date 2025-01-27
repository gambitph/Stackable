/**
 * BLOCK: Card Block.
 */

/**
 * External dependencies
 */
import { ImageIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import example from './example'
import transforms from './transforms'
import deprecated from './deprecated'
import substitute from './substitute'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const settings = {
	...metadata,
	icon: ImageIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: true,
		spacing: true,
	},
	example,
	transforms,

	deprecated,
	edit,
	save,
	substitute,
}
