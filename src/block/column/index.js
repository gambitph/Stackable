/**
 * BLOCK: Card Block.
 */

/**
 * External dependencies
 */
import { ColumnIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import deprecated from './deprecated'
import metadata from './block.json'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const settings = {
	...metadata,
	icon: ColumnIcon,
	attributes: schema,
	supports: {
		anchor: true,
		reusable: false,
		stkBlockLinking: true,
		stkSaveBlockStyle: false,
		stkDefaultTab: 'layout',
		spacing: true,
		__experimentalMetadata: true,
	},
	//  styles: blockStyles,

	deprecated,
	edit,
	save,
}
