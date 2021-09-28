/**
 * BLOCK: Expand Block.
 */

/**
 * External dependencies
 */
import { ExpandIcon } from '~stackable/icons'

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
import { applyFilters } from '@wordpress/hooks'

export const settings = applyFilters( 'stackable.block.metadata', {
	...metadata,
	icon: ExpandIcon,
	attributes: schema,
	supports: {
		anchor: true,
	},
	//  styles: blockStyles,

	// deprecated,
	edit,
	save,
} )
