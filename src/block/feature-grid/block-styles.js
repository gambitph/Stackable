/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'
import { defaultsDeep } from 'lodash'

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { createBlock } from '@wordpress/blocks'

/**
 * Internal dependencies
 */
import ImageDefault from './images/default.svg'
import ImageHorizontal from './images/horizontal.svg'
import ImageLargeMid from './images/large-mid.svg'
import ImageZigZag from './images/zig-zag.svg'
import ImageOffset from './images/offset.svg'
import ImageFloat from './images/float.svg'

const withDefault = ( migrate = {} ) => defaultsDeep( {
	attributes: {},
	innerBlocks: [], // Always `normalize` the look of the column block across all block styles.
	options: {},
}, migrate )

export const blockStyles = applyFilters(
	'stackable.feature-grid.block-styles',
	[
		{
			name: 'default',
			label: __( 'Default', i18n ),
			icon: ImageDefault,
			onSelect: ( attributes, innerBlocks ) => {
				return createBlock(
					'stackable/feature-grid',
					attributes,
					innerBlocks.map( column => {
						return createBlock(
							'stackable/column',
							{ ...column.attributes, hasContainer: true },
							column.innerBlocks
						)
					} )
				)
			},
		},
		{
			name: 'float',
			label: __( 'Float', i18n ),
			icon: ImageFloat,
			migrate: ( attributes, innerBlocks ) => {
				const newInnerBlocks = innerBlocks.map( column => {
					return {
						...column,
						attributes: {
							...column.attributes, contentAlign: 'center', containerPadding: {},
						},
						innerBlocks: column.innerBlocks.map( ( innerBlock, idx ) => {
							if ( idx === 0 && innerBlock.name === 'stackable/image' ) {
								return {
									...innerBlock,
									attributes: {
										...innerBlock.attributes,
										imageShape: '',
										imageHeight: '',
										imageWidth: '',
										positionNum: {},
									},
								}
							}
							return innerBlock
						} ),
					}
				} )

				return withDefault( { attributes, innerBlocks: newInnerBlocks } )
			},
			onSelect: ( attributes, innerBlocks ) => {
				return createBlock(
					'stackable/feature-grid',
					attributes,
					innerBlocks.map( column => {
						return createBlock(
							'stackable/column',
							{
								...column.attributes,
								contentAlign: 'left',
								containerPaddingUnit: '%',
								containerPadding: {
									left: 32,
								},
							},
							column.innerBlocks.map( ( innerBlock, idx ) => {
								if ( idx === 0 && innerBlock.name === 'stackable/image' ) {
									return {
										...innerBlock,
										attributes: {
											...innerBlock.attributes,
											imageShape: 'circle',
											imageHeight: 250,
											imageWidth: 250,
											positionNum: {
												right: 60,
											},
											imageWidthUnit: 'px',
											positionNumUnit: '%',
										},
									}
								}

								return innerBlock
							} )
						)
					} )
				)
			},
		},
		{
			name: 'horizontal',
			label: __( 'Horizontal', i18n ),
			icon: ImageHorizontal,
			isPremium: ! isPro,
		},
		{
			name: 'large-mid',
			label: __( 'Large Mid', i18n ),
			icon: ImageLargeMid,
			isPremium: ! isPro,
		},
		{
			name: 'offset',
			label: __( 'Offset', i18n ),
			icon: ImageOffset,
			isPremium: ! isPro,
		},
		{
			name: 'zigzag',
			label: __( 'Zigzag', i18n ),
			icon: ImageZigZag,
			isPremium: ! isPro,
		},
	],
	withDefault
)
