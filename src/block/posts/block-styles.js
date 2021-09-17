/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

export const blockStyles = applyFilters(
	'stackable.posts.block-styles',
	[
		{
			name: 'default',
			label: __( 'Default', i18n ),
			isDefault: true,
			onSelect: () => ( { hasContainer: false } ),
		},
		{
			name: 'list',
			label: __( 'List', i18n ),
			onSelect: () => ( { hasContainer: false } ),
		},
	]
)

