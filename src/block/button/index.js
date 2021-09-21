/**
 * BLOCK: Button Block
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
import { ButtonIcon } from '~stackable/icons'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

export const settings = applyFilters( 'stackable.block.metadata', {
	...metadata,
	icon: ButtonIcon,
	attributes: schema,
	supports: {
		anchor: true,
	},
	transforms,

	edit,
	save,
} )

