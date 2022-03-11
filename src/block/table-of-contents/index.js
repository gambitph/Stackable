/**
 * External dependencies
 */
import { TableOfContentsIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import metadata from './block.json'
import schema from './schema'
import example from './example'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

export const settings = applyFilters( 'stackable.block.metadata', {
	...metadata,
	icon: TableOfContentsIcon,
	attributes: schema,
	supports: {
		anchor: true,
	},
	example,

	edit,
	save,
} )
