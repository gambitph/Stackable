/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'
import { defaultsDeep } from 'lodash'
import { createUniqueClass } from '~stackable/block-components/block-div/use-unique-id'

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
import ImageOverlapShape1 from './images/overlap-shape-1.svg'
import ImageOverlapShape2 from './images/overlap-shape-2.svg'
import ImageOverlapShape3 from './images/overlap-shape-3.svg'
import ImageOverlapShape4 from './images/overlap-shape-4.svg'
import ImageOverlapShape5 from './images/overlap-shape-5.svg'
import ImageOverlapBg1 from './images/overlap-bg-1.svg'
import ImageOverlapBg2 from './images/overlap-bg-2.svg'
import ImageOverlapBg3 from './images/overlap-bg-3.svg'
import ImageOverlapBg4 from './images/overlap-bg-4.svg'
import ImageOverlapBg5 from './images/overlap-bg-5.svg'

const withDefault = ( migrate = {} ) => defaultsDeep( {
	attributes: {},
	innerBlocks: [],
	options: {},
}, migrate )

export const blockStyles = applyFilters(
	'stackable.feature.block-styles',
	[
		{
			name: 'default',
			label: __( 'Default', i18n ),
			icon: ImageDefault,
			isDefault: true,
			onSelect: ( attributes, innerBlocks ) => {
				const columnIndexWithImage = innerBlocks.findIndex( column => column.innerBlocks[ 0 ]?.name === 'stackable/image' )
				const columnIndexWithInnerBlocks = columnIndexWithImage === 0 ? 1 : 0

				return createBlock(
					'stackable/feature',
					attributes,
					[
						createBlock( 'stackable/column', {
							...innerBlocks[ columnIndexWithInnerBlocks ].attributes,
							columnAlign: 'center',
							columnWidth: 50,
						},
						innerBlocks[ columnIndexWithInnerBlocks ].innerBlocks
						),
						createBlock( 'stackable/column', {
							...innerBlocks[ columnIndexWithImage ].attributes,
							columnAlign: 'center',
							columnWidth: 50,
							templateLock: 'insert',
						},
						innerBlocks[ columnIndexWithImage ].innerBlocks
						),
					]
				)
			},
		},
		{
			name: 'horizontal',
			label: __( 'Horizontal', i18n ),
			icon: ImageHorizontal,
			onSelect: ( attributes, innerBlocks ) => {
				const columnIndexWithImage = innerBlocks.findIndex( column => column.innerBlocks[ 0 ]?.name === 'stackable/image' )
				const columnIndexWithInnerBlocks = columnIndexWithImage === 0 ? 1 : 0

				const contentsHasColumnsBlock = !! innerBlocks[ columnIndexWithInnerBlocks ].innerBlocks.find( ( { name } ) => name === 'stackable/columns' )

				const newInnerBlocks = []
				const oldInnerBlocks = [ ...innerBlocks[ columnIndexWithInnerBlocks ].innerBlocks ]

				if ( ! contentsHasColumnsBlock ) {
					newInnerBlocks.push( oldInnerBlocks[ 0 ] )
					const newColumnsBlock = createBlock( 'stackable/columns', {}, [
						createBlock( 'stackable/column', {}, oldInnerBlocks.slice( 0, oldInnerBlocks.length - 1 ) ),
						createBlock( 'stackable/column', {}, oldInnerBlocks.slice( 0, oldInnerBlocks.length - 1 ) ),
					] )

					newColumnsBlock.attributes.uniqueId = createUniqueClass( newColumnsBlock.clientId )
					newInnerBlocks.push( newColumnsBlock )
					newInnerBlocks.push( oldInnerBlocks.pop() )
				} else {
					newInnerBlocks.push( ...oldInnerBlocks )
				}

				return createBlock(
					'stackable/feature',
					{
						...attributes,
						align: 'full',
						innerBlockContentAlign: 'alignwide',
						columnWidth: 50,
					},
					[
						createBlock( 'stackable/column', {
							...innerBlocks[ columnIndexWithInnerBlocks ].attributes,
							columnAlign: 'center',
						}, newInnerBlocks ),
						createBlock( 'stackable/column', {
							...innerBlocks[ columnIndexWithImage ].attributes,
							templateLock: 'insert',
							columnAlign: 'center',
							columnWidth: 50,
						}, innerBlocks[ columnIndexWithImage ].innerBlocks ),
					]
				)
			},
		},
		{
			name: 'overlap-shape-1',
			label: __( 'Overlap Shape 1', i18n ),
			icon: ImageOverlapShape1,
			isPremium: ! isPro,
		},
		{
			name: 'overlap-shape-2',
			label: __( 'Overlap Shape 2', i18n ),
			icon: ImageOverlapShape2,
			isPremium: ! isPro,
		},
		{
			name: 'overlap-shape-3',
			label: __( 'Overlap Shape 3', i18n ),
			icon: ImageOverlapShape3,
			isPremium: ! isPro,
		},
		{
			name: 'overlap-shape-4',
			label: __( 'Overlap Shape 4', i18n ),
			icon: ImageOverlapShape4,
			isPremium: ! isPro,
		},
		{
			name: 'overlap-shape-5',
			label: __( 'Overlap Shape 5', i18n ),
			icon: ImageOverlapShape5,
			isPremium: ! isPro,
		},
		{
			name: 'overlap-background-1',
			label: __( 'Overlap Background 1', i18n ),
			icon: ImageOverlapBg1,
			isPremium: ! isPro,
		},
		{
			name: 'overlap-background-2',
			label: __( 'Overlap Background 2', i18n ),
			icon: ImageOverlapBg2,
			isPremium: ! isPro,
		},
		{
			name: 'overlap-background-3',
			label: __( 'Overlap Background 3', i18n ),
			icon: ImageOverlapBg3,
			isPremium: ! isPro,
		},
		{
			name: 'overlap-background-4',
			label: __( 'Overlap Background 4', i18n ),
			icon: ImageOverlapBg4,
			isPremium: ! isPro,
		},
		{
			name: 'overlap-background-5',
			label: __( 'Overlap Background 5', i18n ),
			icon: ImageOverlapBg5,
			isPremium: ! isPro,
		},
	],
	withDefault
)
