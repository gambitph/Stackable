/**
 * BLOCK: Icon Button Block
 */
/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import transforms from './transforms'

/**
 * External dependencies
 */
import { IconButtonIcon } from '~stackable/icons'
import { applyFilters } from '@wordpress/hooks'

export const settings = applyFilters( 'stackable.block.metadata', {
	...metadata,
	icon: IconButtonIcon,
	attributes: schema,
	supports: {
		anchor: true,
	},
	transforms,

	edit,
	save,
} )
