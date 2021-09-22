/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

/**
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */
const variations = applyFilters(
	'stackable.posts.variations',
	[
		{
			name: 'default',
			title: __( 'Default', i18n ),
			description: __( 'Default Layout', i18n ),
			isDefault: true,
			attributes: {
				hasContainer: false,
				imageWidth: 100,
				imageWidthUnit: '%',
			},
			scope: [ 'block' ],
		},
		{
			name: 'list',
			title: __( 'List', i18n ),
			description: __( 'List Layout', i18n ),
			attributes: {
				imageWidth: 150,
				imageHeight: 150,
				imageWidthUnit: 'px',
				imageHeightUnit: 'px',
				hasContainer: false,
				className: 'is-style-list',
			},
			scope: [ 'block' ],
		},
		{
			name: 'image-card',
			title: __( 'Image Card', i18n ),
			description: __( 'Image Card Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
		{
			name: 'horizontal',
			title: __( 'Horizontal', i18n ),
			description: __( 'Horizontal Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
		{
			name: 'portfolio',
			title: __( 'Portfolio', i18n ),
			description: __( 'Portfolio Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
		{
			name: 'portfolio-2',
			title: __( 'Portfolio 2', i18n ),
			description: __( 'Portfolio 2 Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
		{
			name: 'vertical-card',
			title: __( 'Vertical Card', i18n ),
			description: __( 'Verical Card Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
		{
			name: 'vertical-card-2',
			title: __( 'Vertical Card 2', i18n ),
			description: __( 'Verical Card 2 Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
	]
)

export default variations

