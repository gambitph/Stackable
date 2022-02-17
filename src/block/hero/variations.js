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
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Default', i18n ) ),
			isDefault: true,
			attributes: {
				className: 'is-style-default',
				contentAlign: 'center',
				hasContainer: true,
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Default', i18n ),
			pickerIcon: ImageDefault,
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
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Horizontal', i18n ) ),
			attributes: {
				className: 'is-style-horizontal',
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
			isActive: [ 'className' ],
			pickerTitle: __( 'Horizontal', i18n ),
			pickerIcon: ImageHorizontal,
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
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Half Overlay', i18n ) ),
			attributes: {
				className: 'is-style-half-overlay',
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Half Overlay', i18n ),
			pickerIcon: ImageHalfOverlay,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'center-overlay',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Center Overlay', i18n ) ),
			attributes: {
				className: 'is-style-center-overlay',
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Center Overlay', i18n ),
			pickerIcon: ImageCenterOverlay,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'side-overlay',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Side Overlay', i18n ) ),
			attributes: {
				className: 'is-style-side-overlay',
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Side Overlay', i18n ),
			pickerIcon: ImageSideOverlay,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'half',
			description: __( 'Half Layout', i18n ),
			attributes: {
				className: 'is-style-half',
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Half', i18n ),
			pickerIcon: ImageHalf,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations
