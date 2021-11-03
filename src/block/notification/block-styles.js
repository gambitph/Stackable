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
import { createBlock } from '@wordpress/blocks'

/**
 * Internal dependencies
 */
import ImageDefault from './images/default.svg'
import ImagePlain from './images/plain.svg'
import ImageSide from './images/side.svg'
import ImageBordered from './images/bordered.svg'
import ImageOutlined from './images/outlined.svg'
import ImageLargeIcon from './images/large-icon.svg'

const withDefault = ( migrate = {} ) => defaultsDeep( {
	attributes: {},
	innerBlocks: [],
	options: {},
}, migrate )

export const blockStyles = applyFilters(
	'stackable.notification.block-styles',
	[
		{
			name: 'default',
			label: __( 'Default', i18n ),
			icon: ImageDefault,
			isDefault: true,
			onSelect: ( attributes, innerBlocks ) => {
				return createBlock(
					'stackable/notification',
					attributes,
					innerBlocks.map(
						innerBlock => {
							if ( innerBlock.name === 'stackable/icon' ) {
								innerBlock.attributes.iconColor1 = '#FFFFFF'
							}

							if ( [ 'stackable/heading', 'stackable/text', 'stackable/subtitle' ].includes( innerBlock.name ) ) {
								innerBlock.attributes.textColor1 = '#FFFFFF'
								innerBlock.attributes.textColorClass = 'has-white-color'
							}

							if ( innerBlock.name === 'stackable/button-group' ) {
								for ( let i = 0; i < innerBlock.innerBlocks.length; i++ ) {
									innerBlock.innerBlocks[ i ].attributes.textColor1 = '#FFFFFF'
									innerBlock.innerBlocks[ i ].attributes.buttonBorderColor = '#FFFFFF'
									innerBlock.innerBlocks[ i ].attributes.textColorClass = ''
								}
							}

							return innerBlock
						}
					)
				)
			},
		},
		{
			name: 'plain',
			label: __( 'Plain', i18n ),
			icon: ImagePlain,
			migrate: ( attributes, innerBlocks ) => {
				return withDefault( {
					attributes: {
						...attributes,
						hasContainer: true,
						containerPadding: {},
						dismissibleColor: '',
					},
					innerBlocks: innerBlocks.map( innerBlock => {
						if ( innerBlock.name === 'stackable/icon' ) {
							innerBlock.attributes.iconColor1 = ''
						}

						if ( [ 'stackable/heading', 'stackable/text', 'stackable/subtitle' ].includes( innerBlock.name ) ) {
							innerBlock.attributes.textColor1 = ''
							innerBlock.attributes.textColorClass = ''
						}

						if ( innerBlock.name === 'stackable/button-group' ) {
							for ( let i = 0; i < innerBlock.innerBlocks.length; i++ ) {
								innerBlock.innerBlocks[ i ].attributes.textColor1 = ''
								innerBlock.innerBlocks[ i ].attributes.buttonBorderColor = ''
								innerBlock.innerBlocks[ i ].attributes.textColorClass = ''
							}
						}

						return innerBlock
					} ),
				} )
			},
			onSelect: ( attributes, innerBlocks ) => {
				return createBlock( 'stackable/notification', {
					...attributes,
					hasContainer: false,
					containerPadding: {
						top: 32,
						right: 32,
						bottom: 32,
						left: 32,
					},
					dismissibleColor: 'var(--stk-container-background-color, #40ba7b)',
				}, innerBlocks.map(
					innerBlock => {
						if ( innerBlock.name === 'stackable/icon' ) {
							innerBlock.attributes.iconColor1 = 'var(--stk-container-background-color, #40ba7b)'
						}

						if ( [ 'stackable/heading', 'stackable/text', 'stackable/subtitle' ].includes( innerBlock.name ) ) {
							innerBlock.attributes.textColor1 = 'var(--stk-container-background-color, #40ba7b)'
						}

						if ( innerBlock.name === 'stackable/button-group' ) {
							for ( let i = 0; i < innerBlock.innerBlocks.length; i++ ) {
								innerBlock.innerBlocks[ i ].attributes.textColor1 = 'var(--stk-container-background-color, #40ba7b)'
								innerBlock.innerBlocks[ i ].attributes.buttonBorderColor = 'var(--stk-container-background-color, #40ba7b)'
							}
						}

						return innerBlock
					}
				) )
			},
		},
		{
			name: 'side',
			label: __( 'Side', i18n ),
			icon: ImageSide,
			isPremium: ! isPro,
		},
		{
			name: 'bordered',
			label: __( 'Bordered', i18n ),
			icon: ImageBordered,
			isPremium: ! isPro,
		},
		{
			name: 'outlined',
			label: __( 'Outlined', i18n ),
			icon: ImageOutlined,
			isPremium: ! isPro,
		},
		{
			name: 'large-icon',
			label: __( 'Large Icon', i18n ),
			icon: ImageLargeIcon,
			isPremium: ! isPro,
		},
	],
	withDefault
)
