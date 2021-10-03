/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	__, sprintf, _x,
} from '@wordpress/i18n'
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
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Default', i18n ) ),
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
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'List', i18n ) ),
			attributes: {
				imageWidth: 35,
				imageWidthUnit: '%',
				imageHeightUnit: 'px',
				hasContainer: false,
				className: 'is-style-list',
				innerBlockContentAlign: 'alignwide',
				align: 'wide',
			},
			scope: [ 'block' ],
		},
		{
			name: 'image-card',
			title: __( 'Image Card', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Image Card', i18n ) ),
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'horizontal',
			title: __( 'Horizontal', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Horizontal', i18n ) ),
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'portfolio',
			title: __( 'Portfolio', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Portfolio', i18n ) ),
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'portfolio-2',
			title: __( 'Portfolio 2', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Portfolio 2', i18n ) ),
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'vertical-card',
			title: __( 'Vertical Card', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Vertical Card', i18n ) ),
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'vertical-card-2',
			title: __( 'Vertical Card 2', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Vertical Card 2', i18n ) ),
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations

