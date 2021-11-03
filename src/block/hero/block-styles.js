/**
 * Internal dependencies
 */
import ImageDefault from './images/default.svg'
import ImageHorizontal from './images/horizontal.svg'
import ImageHalfOverlay from './images/half-overlay.svg'
import ImageCenterOverlay from './images/center-overlay.svg'
import ImageSideOverlay from './images/side-overlay.svg'
import ImageHalf from './images/half.svg'

/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'
import { defaultsDeep } from 'lodash'

/**
 * WordPress dependencies
 */
import {
	__, _x,
} from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { createBlock, createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks'
import { createUniqueClass } from '~stackable/block-components/block-div/use-unique-id'

const withDefault = ( migrate = {} ) => defaultsDeep( {
	attributes: {},
	innerBlocks: [],
	options: {
		imageAttributes: {},
	},
}, migrate )

export const blockStyles = applyFilters(
	'stackable.hero.block-styles',
	[
		{
			name: 'default',
			label: __( 'Default', i18n ),
			icon: ImageDefault,
			isDefault: true,
			onSelect: ( attributes, innerBlocks ) => {
				return createBlock( 'stackable/hero', { hasContainer: true }, innerBlocks )
			},
		},
		{
			name: 'default-2',
			label: __( 'Default 2', i18n ),
			icon: ImageHorizontal,
			migrate: ( attributes, innerBlocks ) => {
				const newInnerBlocks = []
				let imageBoxAttributes = {}
				innerBlocks.forEach( innerBlock => {
					if ( innerBlock.name === 'stackable/columns' ) {
						const columnIndexWithImageBox = innerBlock.innerBlocks.findIndex( column => column.innerBlocks[ 0 ]?.name === 'stackable/image' )
						const columnIndexWithInnerBlocks = columnIndexWithImageBox === 1 ? 0 : 1

						newInnerBlocks.push( ...innerBlock.innerBlocks[ columnIndexWithInnerBlocks ].innerBlocks )
						imageBoxAttributes = innerBlock.innerBlocks[ columnIndexWithImageBox ].innerBlocks[ 0 ].attributes
					}
				} )

				return withDefault( {
					attributes, innerBlocks: newInnerBlocks, options: { imageBoxAttributes },
				} )
			},
			onSelect: ( attributes, innerBlocks, options ) => {
				const newInnerBlocks = createBlocksFromInnerBlocksTemplate( [
					[ 'stackable/columns', {
						innerBlockContentAlign: 'alignfull',
						align: 'full',
						blockMargin: {
							bottom: 0,
						},
					}, [
						[ 'stackable/column', {
							containerWidth: 450,
							contentAlign: 'left',
							columnAlign: 'center',
						} ],
						[ 'stackable/column', {
							columnSpacing: {
								top: 0,
								right: 0,
								bottom: 0,
								left: 0,
							},
						}, [
							[ 'stackable/image', {
								imageHeight: 750,
								imageWidth: 100,
							} ],
						] ],
					] ],
				] )[ 0 ]

				newInnerBlocks.innerBlocks[ 0 ].innerBlocks = innerBlocks
				newInnerBlocks.innerBlocks[ 1 ].innerBlocks[ 0 ].attributes = {
					...newInnerBlocks.innerBlocks[ 1 ].innerBlocks[ 0 ].attributes,
					...options.imageBoxAttributes,
				}
				newInnerBlocks.attributes.uniqueId = createUniqueClass( newInnerBlocks.clientId )

				return createBlock( 'stackable/hero', {
					...attributes,
					hasBackground: true,
					blockBackgroundColor: '#FFFFFF',
					blockPadding: {
						top: 0,
						right: 0,
						bottom: 0,
						left: 0,
					},
					hasContainer: false,
					innerBlockContentAlign: 'alignfull',
					align: 'full',
				}, [ newInnerBlocks ] )
			},
		},
		{
			name: 'half-overlay',
			label: __( 'Half Overlay', i18n ),
			icon: ImageHalfOverlay,
			isPremium: ! isPro,
		},
		{
			name: 'center-overlay',
			label: __( 'Center Overlay', i18n ),
			icon: ImageCenterOverlay,
			isPremium: ! isPro,
		},
		{
			name: 'side-overlay',
			label: __( 'Side Overlay', i18n ),
			icon: ImageSideOverlay,
			isPremium: ! isPro,
		},
		{
			name: 'half',
			label: __( 'Half', i18n ),
			icon: ImageHalf,
			isPremium: ! isPro,
		},
	],
	withDefault
)
