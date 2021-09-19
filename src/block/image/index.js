/**
 * BLOCK: Card Block.
 */

/**
 * External dependencies
 */
import { ImageBoxIcon } from '~stackable/icons'
import { settings as _settings } from 'stackable'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const settings = {
	...metadata,
	icon: ImageBoxIcon,
	attributes: schema,
	supports: {
		inserter: ! _settings.stackable_disabled_blocks.includes( metadata.name ),
		anchor: true,
		align: true,
	},
	//  styles: blockStyles,

	// deprecated,
	edit,
	save,
}
