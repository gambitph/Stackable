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
	'stackable.feature-grid.variations',
	[
		{
			name: 'default',
			title: __( 'Default', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Default', i18n ) ),
			attributes: { className: 'is-style-default' },
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
			title: __( 'Horizontal', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Horizontal', i18n ) ),
			attributes: {
				innerBlockContentAlign: 'alignwide',
				className: 'is-style-horizontal',
				align: 'full',
			},
			innerBlocks: [
				[ 'stackable/column', {
					contentAlign: 'left',
					containerPaddingUnit: '%',
					containerPadding: {
						left: 32,
					},
				}, [
					[ 'stackable/image', {
						imageBorderRadius: 125,
						imageHeight: 250,
						imageWidth: 250,
						positionNum: {
							right: 60,
						},
						imageWidthUnit: 'px',
						positionNumUnit: '%',
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
					containerPaddingUnit: '%',
					containerPadding: {
						left: 32,
					},
				}, [
					[ 'stackable/image', {
						imageBorderRadius: 125,
						imageHeight: 250,
						imageWidth: 250,
						positionNum: {
							right: 60,
						},
						imageWidthUnit: 'px',
						positionNumUnit: '%',
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
			name: 'horizontal-2',
			title: __( 'Horizontal 2', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Horizontal 2', i18n ) ),
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'large-mid',
			title: __( 'Large Mid', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Large Mid', i18n ) ),
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'outlined',
			title: __( 'Outlined', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Outlined', i18n ) ),
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'zigzag',
			title: __( 'Zigzag', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Zizag', i18n ) ),
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations
