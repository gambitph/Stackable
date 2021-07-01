/**
 * BLOCK: Button Block
 */
/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'

/**
 * External dependencies
 */
import { ButtonIcon } from '~stackable/icons'

/**
 * WordPress dependencies
 */
import { i18n } from 'stackable'
import { __ } from '@wordpress/i18n'

export const name = 'stackable/button'

export const settings = {
	title: __( 'Button', i18n ),
	description: __( 'Add a customizable button.', i18n ),
	icon: ButtonIcon,
	category: 'layout',
	keywords: [
		__( 'Button', i18n ),
		__( 'Stackable', i18n ),
	],
	parent: [ 'stackable/button-group' ],
	attributes: schema,
	supports: {
		anchor: true,
		stkBlockLinking: true,
	},

	edit,
	save,
}

