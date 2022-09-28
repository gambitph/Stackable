/**
 * BLOCK: Expand Block.
 */

/**
 * External dependencies
 */
import { AccordionIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import variations from './variations'
import example from './example'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const settings = {
	...metadata,
	icon: AccordionIcon,
	attributes: schema,
	supports: {
		anchor: true,
	},
	example,
	//  styles: blockStyles,

	// deprecated,
	variations,
	edit,
	save,
}
