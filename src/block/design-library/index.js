/**
 * BLOCK: Design Library Block.
 */
/**
 * External dependencies
 */
import { StackableIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import metadata from './block.json'
import { applyFilters } from '@wordpress/hooks'

export const settings = applyFilters( 'stackable.block.metadata', {
	...metadata,
	icon: StackableIcon,
	attributes: {
		previewMode: {
			type: 'boolean',
			default: false,
		},
	},
	supports: {},
	example: {
		attributes: {
			previewMode: true,
		},
	},
	edit,
	save,
} )
