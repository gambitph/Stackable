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
	'stackable.image-box.block-styles',
	[
		{
			name: 'default',
			label: __( 'Default', i18n ),
			isDefault: true,
		},
		{
			name: 'plain',
			label: __( 'Plain', i18n ),
		},
	]
)
