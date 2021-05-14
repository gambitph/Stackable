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
import { blockStyles } from './variations'

/**
 * WordPress dependencies
 */
import { i18n } from 'stackable'
import { __ } from '@wordpress/i18n'

export const name = 'stackable/card'

export const settings = {
	title: __( 'Card', i18n ),
	description: __( 'Describe a single subject in a small card. You can use this to describe your product, service or a person.', i18n ),
	icon: CardIcon,
	category: 'layout',
	keywords: [
		__( 'Card', i18n ),
		__( 'Stackable', i18n ),
	],
	parent: [ 'stackable/card-group' ],
	attributes: schema,
	supports: {
		anchor: true,
		stkBlockLinking: true,
	},
	 styles: blockStyles,

	// deprecated,
	edit,
	save,
}
