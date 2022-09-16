/**
 * BLOCK: Test Block.
 */

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
import { Icon, wordpress } from '@wordpress/icons'

export const settings = applyFilters( 'stackable.block.metadata', {
	...metadata,
	icon: <Icon icon={ wordpress } />,
	attributes: schema,
	edit,
	save,
} )
