/**
 * BLOCK: Button Block
 */
/**
 * External dependencies
 */
import {
	ButtonGroupIcon,
	IconButtonsIcon,
	SocialButtonsIcon,
} from '~stackable/icons'
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

// Add the icon for the social button variation.
metadata.variations.find( variation => variation.name === 'social-buttons' ).icon = SocialButtonsIcon
metadata.variations.find( variation => variation.name === 'icon-button' ).icon = IconButtonsIcon

export const settings = {
	...metadata,
	icon: ButtonGroupIcon,
	attributes: schema,
	supports: {
		inserter: ! _settings.stackable_disabled_blocks.includes( metadata.name ),
		anchor: true,
		align: true,
	},

	edit,
	save,
}

