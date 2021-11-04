/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n'
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
import ImageVerticalCard2 from './images/vertical-card-2.svg'
import ImageImageCard from './images/image-card.svg'

export const blockStyles = applyFilters(
	'stackable.posts.block-styles',
	[
		{
			name: 'default',
			label: __( 'Default', i18n ),
			isDefault: true,
			icon: ImageDefault,
			onSelect: attributes => ( {
				...attributes,
				hasContainer: false,
				imageWidth: 100,
				imageWidthUnit: '%',
				imageHeight: 350,
			} ),
			migrate: ( attributes, innerBlocks, options ) => ( {
				attributes: {
					...attributes,
					hasContainer: true,
					imageWidth: '',
					imageWidthUnit: '',
					imageHeight: '',
				},
				innerBlocks,
				options,
			} ),
		},
		{
			name: 'list',
			label: __( 'List', i18n ),
			icon: ImageList,
			onSelect: attributes => ( {
				...attributes,
				imageWidth: 35,
				imageWidthUnit: '%',
				imageHeightUnit: 'px',
				hasContainer: false,
				innerBlockContentAlign: 'alignwide',
				align: 'wide',
			} ),
			migrate: ( attributes, innerBlocks, options ) => ( {
				attributes: {
					...attributes,
					imageWidth: '',
					imageWidthUnit: '',
					imageHeightUnit: '',
					hasContainer: '',
					innerBlockContentAlign: '',
					align: '',
				},
				innerBlocks,
				options,
			} ),
		},
		{
			name: 'image-card',
			label: __( 'Image Card', i18n ),
			icon: ImageImageCard,
			isPremium: ! isPro,
		},
		{
			name: 'horizontal',
			label: __( 'Horizontal', i18n ),
			icon: ImageHorizontalCard,
			isPremium: ! isPro,
		},
		{
			name: 'portfolio',
			label: __( 'Portfolio', i18n ),
			icon: ImagePortfolio,
			isPremium: ! isPro,
		},
		{
			name: 'portfolio-2',
			label: __( 'Portfolio 2', i18n ),
			icon: ImagePortfolio2,
			isPremium: ! isPro,
		},
		{
			name: 'vertical-card',
			label: __( 'Vertical Card', i18n ),
			icon: ImageVerticalCard,
			isPremium: ! isPro,
		},
		{
			name: 'vertical-card-2',
			label: __( 'Vertical Card 2', i18n ),
			icon: ImageVerticalCard2,
			isPremium: ! isPro,
		},
	]
)
