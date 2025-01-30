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
import variations from './variations'
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import example from './example'
import deprecated from './deprecated'
import substitute from './substitute'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const settings = {
	...metadata,
	icon: CardIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: true,
		spacing: true,
	},
	example,
	deprecated,
	//  styles: blockStyles,

	// deprecated,
	variations,
	edit,
	save,
	substitute,
}
