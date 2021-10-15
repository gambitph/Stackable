/**
 * BLOCK: Card Block.
 */

/**
 * External dependencies
 */
import { ImageIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import transforms from './transforms'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

export const settings = applyFilters( 'stackable.block.metadata', {
	...metadata,
	icon: ImageIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: true,
	},
	transforms,
	//  styles: blockStyles,

	// deprecated,
	edit,
	save,
} )
