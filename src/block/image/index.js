/**
 * BLOCK: Card Block.
 */

/**
 * External dependencies
 */
import { ImageBoxIcon } from '~stackable/icons'

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
	icon: ImageBoxIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: true,
	},
	//  styles: blockStyles,

	// deprecated,
	edit,
	save,
} )
