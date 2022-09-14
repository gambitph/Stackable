/**
 * BLOCK: Test Block.
 */

/**
 * Internal dependencies
 */
import metadata from './meta-data.json'
import schema from './schema'
import Edit from './edit'
import Save from './save'

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
	edit: Edit,
	save: Save,
} )
