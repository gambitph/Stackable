/**
 * Internal dependencies
 */
import ImageStyleDefault from './images/default.svg'

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
	'stackable.card.block-styles',
	[
		{
			name: 'default',
			label: __( 'Default', i18n ),
			isDefault: true,
			image: ImageStyleDefault,
		},
	]
)
