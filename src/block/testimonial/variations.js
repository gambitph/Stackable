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
			title: __( 'Default', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Default', i18n ) ),
			icon: ImageDefault,
			attributes: {
				className: 'is-style-default',
			},
			isDefault: true,
			innerBlocks: [
				[ 'stackable/text', { text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ) } ],
				[ 'stackable/image', {
					imageHeight: 75, imageWidth: 75, imageWidthUnit: 'px', imageBorderRadius: 90,
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
			title: __( 'Compact', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Compact', i18n ) ),
			icon: ImageCompact,
			attributes: {
				className: 'is-style-compact',
				hasContainer: false,
				contentAlign: '',
			},
			innerBlocks: [
				[ 'stackable/text', { text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ) } ],
				[ 'stackable/columns', {}, [
					[ 'stackable/column', { columnWidth: 25 }, [
						[ 'stackable/image', {
							imageHeight: 75, imageWidth: 75, imageWidthUnit: 'px', imageBorderRadius: 90,
						} ],
					] ],
					[ 'stackable/column', { columnWidth: 75, contentAlign: 'left' }, [
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
			title: __( 'Horizontal', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Horizontal', i18n ) ),
			icon: ImageHorizontal,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'bubble',
			title: __( 'Bubble', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Bubble', i18n ) ),
			icon: ImageBubble,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'vertical',
			title: __( 'Vertical', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Vertical', i18n ) ),
			icon: ImageVertical,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'inverted-vertical',
			title: __( 'Inverted Vertical', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Inverted Vertical', i18n ) ),
			icon: ImageInvertedVertical,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations
