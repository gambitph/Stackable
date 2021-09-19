/**
 * External dependencies
 */
import { IconListIcon } from '~stackable/icons'
import { settings as _settings } from 'stackable'

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
	icon: IconListIcon,
	attributes: schema,
	supports: {
		inserter: ! _settings.stackable_disabled_blocks.includes( metadata.name ),
		anchor: true,
	},

	edit,
	save,
	merge( attributes, attributesToMerge ) {
		// Make sure that the selection is always at the end of the text.
		// @see https://github.com/WordPress/gutenberg/blob/3da717b8d0ac7d7821fc6d0475695ccf3ae2829f/packages/block-library/src/paragraph/index.js
		return {
			text:
				( attributes.text || '' ) +
				( attributesToMerge.text || '' ),
		}
	},
}
