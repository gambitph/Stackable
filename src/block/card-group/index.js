/**
 * BLOCK: Card Block.
 */

/**
 * External dependencies
 */
import { CardIcon } from '~stackable/icons'

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

export const name = 'stackable/card-group'

export const settings = {
	title: __( 'Card Group', i18n ),
	description: __( 'Describe a single subject in a small card. You can use this to describe your product, service or a person.', i18n ),
	icon: CardIcon,
	category: 'layout',
	keywords: [
		__( 'Card', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	supports: {
		// inserter: false,
		anchor: true,
		align: true,
	},

	variations,
	edit,
	save,
}
