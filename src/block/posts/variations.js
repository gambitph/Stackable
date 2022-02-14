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
 * Internal dependencies
 */
import ImageDefault from './images/default.svg'
import ImageList from './images/list.svg'
import ImagePortfolio from './images/portfolio.svg'
import ImagePortfolio2 from './images/portfolio-2.svg'
import ImageVerticalCard from './images/vertical-card.svg'
import ImageHorizontalCard from './images/horizontal-card.svg'
import ImageHorizontalCard2 from './images/horizontal-card-2.svg'
import ImageVerticalCard2 from './images/vertical-card-2.svg'
import ImageImageCard from './images/image-card.svg'

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
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Default', i18n ) ),
			isDefault: true,
			attributes: {
				className: 'is-style-default',
				hasContainer: false,
				imageWidth: 100,
				imageWidthUnit: '%',
			},
			pickerTitle: __( 'Default', i18n ),
			pickerIcon: ImageDefault,
			isActive: [ 'className' ],
			scope: [ 'block' ],
		},
		{
			name: 'list',
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
			pickerTitle: __( 'List', i18n ),
			pickerIcon: ImageList,
			isActive: [ 'className' ],
			scope: [ 'block' ],
		},
		{
			name: 'image-card',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Image Card', i18n ) ),
			pickerTitle: __( 'Image Card', i18n ),
			pickerIcon: ImageImageCard,
			isActive: [ 'className' ],
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'horizontal',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Horizontal', i18n ) ),
			pickerTitle: __( 'Horizontal', i18n ),
			pickerIcon: ImageHorizontalCard,
			isActive: [ 'className' ],
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'horizontal-2',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Horizontal 2', i18n ) ),
			pickerTitle: __( 'Horizontal 2', i18n ),
			pickerIcon: ImageHorizontalCard2,
			isActive: [ 'className' ],
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'portfolio',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Portfolio', i18n ) ),
			pickerTitle: __( 'Portfolio', i18n ),
			pickerIcon: ImagePortfolio,
			isActive: [ 'className' ],
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'portfolio-2',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Portfolio 2', i18n ) ),
			pickerTitle: __( 'Portfolio 2', i18n ),
			pickerIcon: ImagePortfolio2,
			isActive: [ 'className' ],
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'vertical-card',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Vertical Card', i18n ) ),
			pickerTitle: __( 'Vertical Card', i18n ),
			pickerIcon: ImageVerticalCard,
			isActive: [ 'className' ],
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'vertical-card-2',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Vertical Card 2', i18n ) ),
			pickerTitle: __( 'Vertical Card 2', i18n ),
			pickerIcon: ImageVerticalCard2,
			isActive: [ 'className' ],
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations

