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

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import variations from './variations'
import { buttonExample } from './example'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

// Add the icon for the social button variation.
variations.find( variation => variation.name === 'social-buttons' ).icon = SocialButtonsIcon
variations.find( variation => variation.name === 'icon-button' ).icon = IconButtonsIcon

export const settings = applyFilters( 'stackable.block.metadata', {
	...metadata,
	icon: ButtonGroupIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ],
		stkLayoutReset: false,
		stkSaveBlockStyle: false,
	},
	variations,

	example: buttonExample,
	edit,
	save,
} )
