/**
 * BLOCK: Button Block
 */
/**
 * External dependencies
 */
import { ButtonIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import variations from './variations'

/**
 * WordPress dependencies
 */
import { i18n } from 'stackable'
import { __ } from '@wordpress/i18n'

export const name = 'stackable/button-group'

export const settings = {
	title: __( 'Button Group', i18n ),
	description: __( 'Add a customizable button.', i18n ),
	icon: ButtonIcon,
	category: 'layout',
	keywords: [
		__( 'Button', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	supports: {
		anchor: true,
		align: true,
	},

	variations,
	edit,
	save,
}

