/**
 * BLOCK: Card Block.
 */

/**
 * External dependencies
 */
import { FeatureIcon } from '~stackable/icons'

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
	icon: FeatureIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ],
		stkBlockLinking: false, // Disable linking on the columns in this block.
		stkAlign: true,
		stkDefaultTab: 'layout',
		spacing: true,
	},
	example,
	deprecated,
	//  styles: blockStyles,

	variations,
	edit,
	save,
	substitute,
}
