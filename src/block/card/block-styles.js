/**
 * Internal dependencies
 */
import ImageDefault from './images/default.svg'
import ImageDefault2 from './images/default-2.svg'
import ImageHorizontal from './images/horizontal.svg'
import ImageFull from './images/full.svg'
import ImageFaded from './images/faded.svg'

/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'
import {
	defaultsDeep, last, get,
} from 'lodash'

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { createBlock, createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks'
import { createUniqueClass } from '~stackable/block-components/block-div/use-unique-id'

const withDefault = ( migrate = {} ) => defaultsDeep( {
	attributes: {},
	innerBlocks: [],
	options: {},
}, migrate )

export const blockStyles = applyFilters(
	'stackable.card.block-styles',
	[
		{
			name: 'default',
			label: __( 'Default', i18n ),
			icon: ImageDefault,
			isDefault: true,
			onSelect: ( attributes, innerBlocks ) => {
				return createBlock( 'stackable/card', { ...attributes }, innerBlocks )
			},
		},
		{
			name: 'default-2',
			label: __( 'Default 2', i18n ),
			icon: ImageDefault2,
			migrate: ( attributes, innerBlocks ) => {
				const newInnerBlocks = [ ...innerBlocks ]
				let socialIcons
				const innerBlocksLength = newInnerBlocks.length
				const lastBlock = last( innerBlocks ) || {}
				if (
					get( lastBlock, 'name' ) === 'stackable/columns' &&
					get( lastBlock, 'innerBlocks[1].innerBlocks[0].name' ) === 'stackable/button-group'
				) {
					socialIcons = newInnerBlocks[ innerBlocksLength - 1 ].innerBlocks[ 1 ]?.innerBlocks?.shift()
					const columnsBlock = newInnerBlocks.pop()
					columnsBlock.innerBlocks.forEach( column => {
						newInnerBlocks.push( ...column.innerBlocks )
					} )
				}

				return withDefault( {
					attributes, innerBlocks: newInnerBlocks, options: { cachedSocialIcons: socialIcons },
				} )
			},
			onSelect: ( attributes, innerBlocks, options ) => {
				const newInnerBlocks = [ ...innerBlocks ]
				const lastBlock = last( newInnerBlocks ) || {}
				if (
					lastBlock.name !== 'stackable/columns' &&
					lastBlock.innerBlocks[ 1 ]?.innerBlocks?.[ 0 ]?.name !== 'stackable/button-group'
				) {
					let buttonGroupBlock = newInnerBlocks.pop()
					if ( buttonGroupBlock.name !== 'stackable/button-group' ) {
						newInnerBlocks.push( buttonGroupBlock )
						buttonGroupBlock = undefined
					}

					const newColumnsBlock = createBlocksFromInnerBlocksTemplate(
						[
							[ 'stackable/columns', {
								rowAlign: 'center',
								innerBlockContentAlign: 'alignfull',
								align: 'full',
							}, [
								[ 'stackable/column', {
									columnSpacing: {
										top: 0,
										right: 0,
										bottom: 0,
										left: 0,
									},
								}, [
									[ 'stackable/button-group', {}, [
										[ 'stackable/button', { text: _x( 'Button', 'Button placeholder', i18n ) } ],
									] ],
								] ],
								[ 'stackable/column', {
									columnSpacing: {
										top: 0,
										right: 0,
										bottom: 0,
										left: 0,
									},
								}, [
									[ 'stackable/button-group', {
										columnSpacing: {
											top: 0,
											right: 0,
											bottom: 0,
											left: 0,
										},
										contentAlign: 'right',
									}, [
										[ 'stackable/icon-button', {
											buttonBackgroundColor: 'transparent',
											icon: '<svg data-prefix="fas" data-icon="share-alt" class="svg-inline--fa fa-share-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M352 320c-22.608 0-43.387 7.819-59.79 20.895l-102.486-64.054a96.551 96.551 0 0 0 0-41.683l102.486-64.054C308.613 184.181 329.392 192 352 192c53.019 0 96-42.981 96-96S405.019 0 352 0s-96 42.981-96 96c0 7.158.79 14.13 2.276 20.841L155.79 180.895C139.387 167.819 118.608 160 96 160c-53.019 0-96 42.981-96 96s42.981 96 96 96c22.608 0 43.387-7.819 59.79-20.895l102.486 64.054A96.301 96.301 0 0 0 256 416c0 53.019 42.981 96 96 96s96-42.981 96-96-42.981-96-96-96z"></path></svg>',
											iconColor1: '#D3D3D3',
											buttonBackgroundColorHover: 'transparent',
											buttonBackgroundColorParentHover: 'transparent',
											className: 'is-style-plain',
										} ],
										[ 'stackable/icon-button', {
											buttonBackgroundColor: 'transparent',
											icon: '<svg data-prefix="fab" data-icon="facebook-f" class="svg-inline--fa fa-facebook-f fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path></svg>',
											iconColor1: '#D3D3D3',
											buttonBackgroundColorHover: 'transparent',
											buttonBackgroundColorParentHover: 'transparent',
											className: 'is-style-plain',
										} ],
									] ],
								] ],
							] ],
						]
					)[ 0 ]

					newColumnsBlock.attributes.uniqueId = createUniqueClass( newColumnsBlock.clientId )
					if ( buttonGroupBlock ) {
						newColumnsBlock.innerBlocks[ 0 ].innerBlocks[ 0 ] = buttonGroupBlock
					}

					if ( options.cachedSocialIcons ) {
						newColumnsBlock.innerBlocks[ 1 ].innerBlocks[ 0 ] = options.cachedSocialIcons
					}

					newInnerBlocks.push( newColumnsBlock )
				}
				return createBlock( 'stackable/card', { ...attributes }, newInnerBlocks )
			},
		},
		{
			name: 'horizontal',
			label: __( 'Horizontal', i18n ),
			icon: ImageHorizontal,
			isPremium: ! isPro,
		},
		{
			name: 'full',
			label: __( 'Full', i18n ),
			icon: ImageFull,
			isPremium: ! isPro,
		},
		{
			name: 'faded',
			label: __( 'Faded', i18n ),
			icon: ImageFaded,
			isPremium: ! isPro,
		},
	],
	withDefault
)
