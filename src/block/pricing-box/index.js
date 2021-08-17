/**
 * BLOCK: Pricing Box Block.
 */

/**
 * External dependencies
 */
import { PricingBoxIcon } from '~stackable/icons'

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
	icon: PricingBoxIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ],
	},
	//  styles: blockStyles,

	// deprecated,
	edit,
	save,
}
