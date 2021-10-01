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
	'stackable.hero.variations',
	[
		{
			name: 'default',
			title: __( 'Default', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Default', i18n ) ),
			icon: ImageDefault,
			isDefault: true,
			attributes: {
				hasContainer: true,
			},
			innerBlocks: [
				[ 'stackable/heading', { text: _x( 'Title for This Block', 'Heading placeholder', i18n ) } ],
				[ 'stackable/text', { text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ) } ],
				[ 'stackable/button-group', {}, [
					[ 'stackable/button', { text: _x( 'Button', 'Button placeholder', i18n ) } ],
				] ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'horizontal',
			title: __( 'Horizontal', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Horizontal', i18n ) ),
			icon: ImageHorizontal,
			attributes: {
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
			},
			innerBlocks: [
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
					}, [
						[ 'stackable/heading', { text: _x( 'Title for This Block', 'Heading placeholder', i18n ), textTag: 'h1' } ],
						[ 'stackable/text', { text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ) } ],
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
						[ 'stackable/image', {
							imageHeight: 750,
							imageWidth: 100,
						} ],
					] ],
				] ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'half-overlay',
			title: __( 'Half Overlay', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Half Overlay', i18n ) ),
			icon: ImageHalfOverlay,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'center-overlay',
			title: __( 'Center Overlay', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Center Overlay', i18n ) ),
			icon: ImageCenterOverlay,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'side-overlay',
			title: __( 'Side Overlay', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Side Overlay', i18n ) ),
			icon: ImageSideOverlay,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'half',
			title: __( 'Half', i18n ),
			description: __( 'Half Layout', i18n ),
			icon: ImageHalf,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations
