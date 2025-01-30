/**
 * BLOCK: Feature Grid Block.
 */

/**
 * External dependencies
 */
import { FeatureGridIcon } from '~stackable/icons'

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
	icon: FeatureGridIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ],
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
