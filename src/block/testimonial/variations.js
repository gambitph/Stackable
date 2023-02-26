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
import ImageCompact from './images/compact.svg'
import ImageHorizontal from './images/horizontal.svg'
import ImageBubble from './images/bubble.svg'
import ImageVertical from './images/vertical.svg'
import ImageInvertedVertical from './images/inverted-vertical.svg'

/**
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */
const variations = applyFilters(
	'stackable.testimonial.variations',
	[
		{
			name: 'default',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Default', i18n ) ),
			attributes: {
				className: 'is-style-default',
				hasContainer: true,
				contentAlign: 'center',
			},
			isDefault: true,
			pickerTitle: __( 'Default', i18n ),
			pickerIcon: ImageDefault,
			isActive: [ 'className' ],
			innerBlocks: [
				[ 'stackable/text', { text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ) } ],
				[ 'stackable/image', {
					imageHeight: 75, imageWidth: 75, imageWidthUnit: 'px', imageShape: 'circle',
				} ],
				[ 'stackable/heading', {
					text: __( 'Name', i18n ), textTag: 'h3', textRemoveTextMargins: true,
				} ],
				[ 'stackable/subtitle', {
					text: __( 'Position', i18n ),
				} ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'compact',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Compact', i18n ) ),
			attributes: {
				className: 'is-style-compact',
				hasContainer: false,
				contentAlign: '',
			},
			pickerTitle: __( 'Compact', i18n ),
			pickerIcon: ImageCompact,
			isActive: [ 'className' ],
			innerBlocks: [
				[ 'stackable/text', { text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ) } ],
				[ 'stackable/columns', { columnJustify: 'flex-start' }, [
					[ 'stackable/column', {}, [
						[ 'stackable/image', {
							imageHeight: 75, imageWidth: 75, imageWidthUnit: 'px', imageShape: 'circle',
						} ],
					] ],
					[ 'stackable/column', { contentAlign: 'left' }, [
						[ 'stackable/heading', {
							text: __( 'Name', i18n ),
							textTag: 'h3',
							textRemoveTextMargins: true,
							blockMargin: { bottom: 0 },
						} ],
						[ 'stackable/subtitle', {
							text: __( 'Position', i18n ),
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
			pickerTitle: __( 'Horizontal', i18n ),
			pickerIcon: ImageHorizontal,
			isActive: [ 'className' ],
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'bubble',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Bubble', i18n ) ),
			attributes: {
				className: 'is-style-bubble',
			},
			pickerTitle: __( 'Bubble', i18n ),
			pickerIcon: ImageBubble,
			isActive: [ 'className' ],
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'vertical',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Vertical', i18n ) ),
			attributes: {
				className: 'is-style-vertical',
			},
			pickerTitle: __( 'Vertical', i18n ),
			pickerIcon: ImageVertical,
			isActive: [ 'className' ],
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'inverted-vertical',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Inverted Vertical', i18n ) ),
			attributes: {
				className: 'is-style-inverted-vertical',
			},
			pickerTitle: __( 'Inverted Vertical', i18n ),
			pickerIcon: ImageInvertedVertical,
			isActive: [ 'className' ],
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations
