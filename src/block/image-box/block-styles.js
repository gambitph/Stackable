/**
 * Internal dependencies
 */
import ImageDefault from './images/default.svg'
import ImagePlain from './images/plain.svg'
import ImageBox from './images/box.svg'
import ImageCaptioned from './images/captioned.svg'
import ImageFade from './images/fade.svg'
import ImageLine from './images/line.svg'

/**
 * WordPress dependencies
 */
import {
	__, _x,
} from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { createBlock, createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks'

/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'
import {
	at, defaultsDeep,
} from 'lodash'

const withDefault = ( migrate = {} ) => defaultsDeep( {
	attributes: {},
	innerBlocks: [],
	options: {
		subtitleAttributes: {},
		headingAttributes: {},
		textAttributes: {},
		iconAttributes: {},
	},
}, migrate )

const migrate = ( {
	attributes: _attributes,
	subtitleAttributes: _subtitleAttributes,
	headingAttributes: _headingAttributes,
	textAttributes: _textAttributes,
	iconAttributes: _iconAttributes,
	imageAttributes,
	columnAttributes,
} ) => ( attributes, innerBlocks, options ) => {
	let subtitleAttributes = innerBlocks[ 1 ].innerBlocks.find( ( { name } ) => name === 'stackable/subtitle' )?.attributes || options.subtitleAttributes
	let headingAttributes = innerBlocks[ 1 ].innerBlocks.find( ( { name } ) => name === 'stackable/heading' )?.attributes || options.headingAttributes
	let textAttributes = innerBlocks[ 1 ].innerBlocks.find( ( { name } ) => name === 'stackable/text' )?.attributes || options.textAttributes
	let iconAttributes = innerBlocks[ 1 ].innerBlocks.find( ( { name } ) => name === 'stackable/icon' )?.attributes || options.iconAttributes

	if ( _subtitleAttributes ) {
		subtitleAttributes = { ...subtitleAttributes, ..._subtitleAttributes }
	}

	if ( _headingAttributes ) {
		headingAttributes = { ...headingAttributes, ..._headingAttributes }
	}

	if ( _textAttributes ) {
		textAttributes = { ...textAttributes, ..._textAttributes }
	}

	if ( _iconAttributes ) {
		iconAttributes = { ...iconAttributes, ..._iconAttributes }
	}

	if ( imageAttributes ) {
		innerBlocks[ 0 ].attributes = { ...innerBlocks[ 0 ].attributes, ...imageAttributes }
	}

	if ( columnAttributes ) {
		innerBlocks[ 1 ].attributes = { ...innerBlocks[ 1 ].attributes, ...columnAttributes }
	}

	return withDefault( {
		attributes: _attributes || attributes,
		innerBlocks,
		options: {
			subtitleAttributes,
			headingAttributes,
			textAttributes,
			iconAttributes,
		},
	} )
}

export const blockStyles = applyFilters(
	'stackable.image-box.block-styles',
	[
		{
			name: 'default',
			label: __( 'Default', i18n ),
			icon: ImageDefault,
			isDefault: true,
			migrate: migrate( {} ),
			onSelect: ( attributes, innerBlocks, options ) => {
				const {
					subtitleAttributes,
					headingAttributes,
					textAttributes,
					iconAttributes,
				} = options

				const [ imageAttributes ] = at( innerBlocks, [
					'[0].attributes',
				] )

				return createBlock( 'stackable/image-box', { ...attributes }, createBlocksFromInnerBlocksTemplate( [
					[ 'stackable/image', {
						...imageAttributes, imageHeight: 350, imageFilterParentHover: 'brightness(0.3)',
					} ],
					[ 'stackable/column', {
						templateLock: false,
						blockVerticalAlign: 'center',
					}, [
						[ 'stackable/subtitle', {
							...subtitleAttributes,
							blockMargin: { bottom: 8 },
							opacity: 0,
							opacityParentHover: 1,
						} ],
						[ 'stackable/heading', {
							...headingAttributes,
							textTag: 'h4',
						} ],
						[ 'stackable/text', {
							...textAttributes,
							opacity: 0,
							transform: 'translateY(-24px)',
							opacityParentHover: 1,
							transformParentHover: 'translateY(0px)',
						} ],
						[ 'stackable/icon', {
							...iconAttributes,
							blockMargin: { top: 56 },
							opacity: 0,
							transform: 'translateY(24px)',
							opacityParentHover: 1,
							transformParentHover: 'translateY(0px)',
						} ],
					] ],
				] ) )
			},
		},
		{
			name: 'plain',
			label: __( 'Plain', i18n ),
			icon: ImagePlain,
			migrate: migrate( {} ),
			onSelect: ( attributes, innerBlocks, options ) => {
				const {
					subtitleAttributes,
					headingAttributes,
					textAttributes,
					iconAttributes,
				} = options

				const [ imageAttributes ] = at( innerBlocks, [
					'[0].attributes',
				] )

				return createBlock( 'stackable/image-box', { ...attributes, contentAlign: 'left' }, createBlocksFromInnerBlocksTemplate( [
					[ 'stackable/image', {
						...imageAttributes,
						imageHeight: 350,
						imageFilterParentHover: 'brightness(0.3)',
					} ],
					[ 'stackable/column', {
						containerPadding: {
							top: 32, right: 32, bottom: 32, left: 32,
						},
						templateLock: false,
						containerVerticalAlign: 'flex-end',
					}, [
						[ 'stackable/subtitle', {
							...subtitleAttributes,
							blockMargin: { bottom: 8 },
							transform: 'translateY(32px)',
							transformParentHover: 'translateY(0px)',
						} ],
						[ 'stackable/heading', {
							...headingAttributes,
							textTag: 'h4',
							transform: 'translateY(32px)',
							transformParentHover: 'translateY(0px)',
						} ],
						[ 'stackable/text', {
							...textAttributes,
							opacity: 0,
							opacityParentHover: 1,
						} ],
						[ 'stackable/icon', {
							...iconAttributes,
							opacity: 0,
							transform: 'translateY(-32px)',
							opacityParentHover: 1,
							transformParentHover: 'translateY(0px)',
						} ],
					] ],
				] ) )
			},
		},
		{
			name: 'box',
			label: __( 'Box', i18n ),
			icon: ImageBox,
			isPremium: ! isPro,
		},
		{
			name: 'captioned',
			label: __( 'Captioned', i18n ),
			icon: ImageCaptioned,
			isPremium: ! isPro,
		},
		{
			name: 'fade',
			label: __( 'Fade', i18n ),
			icon: ImageFade,
			isPremium: ! isPro,
		},
		{
			name: 'line',
			label: __( 'Line', i18n ),
			icon: ImageLine,
			isPremium: ! isPro,
		},
	],
	withDefault,
	migrate
)
