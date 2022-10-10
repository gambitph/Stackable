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
import ImageHorizontal from './images/horizontal.svg'
import ImageLargeMid from './images/large-mid.svg'
import ImageZigZag from './images/zig-zag.svg'
import ImageOffset from './images/offset.svg'
import ImageFloat from './images/float.svg'

/**
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */
const variations = applyFilters(
	'stackable.feature-grid.variations',
	[
		{
			name: 'default',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Default', i18n ) ),
			attributes: {
				className: 'is-style-default',
				innerBlockContentAlign: 'alignwide',
				align: 'wide',
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Default', i18n ),
			pickerIcon: ImageDefault,
			isDefault: true,
			innerBlocks: [
				[ 'stackable/column', { hasContainer: true }, [
					[ 'stackable/image' ],
					[ 'stackable/heading', {
						text: _x( 'Title for This Block', 'Heading placeholder', i18n ), textTag: 'h3', textRemoveTextMargins: true,
					} ],
					[ 'stackable/text', { text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ) } ],
					[ 'stackable/button-group', {}, [
						[ 'stackable/button', {
							text: _x( 'Button', 'Button placeholder', i18n ),
							buttonBackgroundColor: 'transparent',
							className: 'is-style-plain',
						} ],
					] ],
				] ],
				[ 'stackable/column', { hasContainer: true }, [
					[ 'stackable/image' ],
					[ 'stackable/heading', {
						text: _x( 'Title for This Block', 'Heading placeholder', i18n ), textTag: 'h3', textRemoveTextMargins: true,
					} ],
					[ 'stackable/text', { text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ) } ],
					[ 'stackable/button-group', {}, [
						[ 'stackable/button', {
							text: _x( 'Button', 'Button placeholder', i18n ),
							buttonBackgroundColor: 'transparent',
							className: 'is-style-plain',
						} ],
					] ],
				] ],
				[ 'stackable/column', { hasContainer: true }, [
					[ 'stackable/image' ],
					[ 'stackable/heading', {
						text: _x( 'Title for This Block', 'Heading placeholder', i18n ), textTag: 'h3', textRemoveTextMargins: true,
					} ],
					[ 'stackable/text', { text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ) } ],
					[ 'stackable/button-group', {}, [
						[ 'stackable/button', {
							text: _x( 'Button', 'Button placeholder', i18n ),
							buttonBackgroundColor: 'transparent',
							className: 'is-style-plain',
						} ],
					] ],
				] ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'float',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Float', i18n ) ),
			attributes: {
				innerBlockContentAlign: 'alignwide',
				className: 'is-style-float',
				align: 'full',
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Float', i18n ),
			pickerIcon: ImageFloat,
			innerBlocks: [
				[ 'stackable/column', {
					contentAlign: 'left',
					containerPadding: {
						left: 80,
					},
				}, [
					[ 'stackable/image', {
						imageShape: 'circle',
						imageHeight: 150,
						imageWidth: 150,
						blockMargin: {
							top: '', right: '', bottom: '', left: -80,
						},
						imageWidthUnit: 'px',
					} ],
					[ 'stackable/heading', {
						text: __( 'Title', i18n ), textTag: 'h3', textRemoveTextMargins: true,
					} ],
					[ 'stackable/text', { text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ) } ],
					[ 'stackable/button-group', {}, [
						[ 'stackable/button', {
							text: _x( 'Button', 'Button placeholder', i18n ),
							buttonBackgroundColor: 'transparent',
							buttonBorderType: 'solid',
							buttonBackgroundColorHover: 'transparent',
							buttonBackgroundColorParentHover: 'transparent',
							className: 'is-style-ghost',
						} ],
					] ],
				] ],
				[ 'stackable/column', {
					contentAlign: 'left',
					containerPadding: {
						left: 80,
					},
				}, [
					[ 'stackable/image', {
						imageShape: 'circle',
						imageHeight: 150,
						imageWidth: 150,
						blockMargin: {
							top: '', right: '', bottom: '', left: -80,
						},
						imageWidthUnit: 'px',
					} ],
					[ 'stackable/heading', {
						text: __( 'Title', i18n ), textTag: 'h3', textRemoveTextMargins: true,
					} ],
					[ 'stackable/text', { text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ) } ],
					[ 'stackable/button-group', {}, [
						[ 'stackable/button', {
							text: _x( 'Button', 'Button placeholder', i18n ),
							buttonBackgroundColor: 'transparent',
							buttonBorderType: 'solid',
							buttonBackgroundColorHover: 'transparent',
							buttonBackgroundColorParentHover: 'transparent',
							className: 'is-style-ghost',
						} ],
					] ],
				] ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'horizontal',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Horizontal', i18n ) ),
			attributes: {
				className: 'is-style-horizontal',
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Horizontal', i18n ),
			pickerIcon: ImageHorizontal,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'large-mid',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Large Mid', i18n ) ),
			attributes: {
				className: 'is-style-large-mid',
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Large Mid', i18n ),
			pickerIcon: ImageLargeMid,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'offset',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Offset', i18n ) ),
			attributes: {
				className: 'is-style-offset',
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Offset', i18n ),
			pickerIcon: ImageOffset,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'zigzag',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Zizag', i18n ) ),
			attributes: {
				className: 'is-style-zigzag',
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Zigzag', i18n ),
			pickerIcon: ImageZigZag,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations
