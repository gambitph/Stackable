/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	__, _x, sprintf,
} from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

/**
 * Internal dependencies
 */
import ImageDefault from './images/default.svg'
import ImageHorizontal from './images/horizontal.svg'
import ImageHorizontal2 from './images/horizontal-2.svg'
import ImageHorizontal3 from './images/horizontal-3.svg'
import ImageSplitCentered from './images/split-centered.svg'

/**
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */
const variations = applyFilters(
	'stackable.call-to-action.variations',
	[
		{
			name: 'default',
			title: __( 'Default', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Default', i18n ) ),
			isDefault: true,
			icon: ImageDefault,
			attributes: {
				hasContainer: true,
			},
			innerBlocks: [
				[ 'stackable/heading', { text: _x( 'Title for This Block', 'Heading placeholder', i18n ), textTag: 'h3' } ],
				[ 'stackable/text', { text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ) } ],
				[ 'stackable/button-group', {}, [
					[ 'stackable/button', { text: 'Button' } ],
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
				className: 'is-style-horizontal',
				hasContainer: true,
				innerBlockOrientation: 'horizontal',
				innerBlockContentAlign: 'alignwide',
				innerBlockVerticalAlign: 'center',
				align: 'wide',
			},
			innerBlocks: [
				[ 'stackable/heading', { text: _x( 'Title for This Block', 'Heading placeholder', i18n ), textTag: 'h3' } ],
				[ 'stackable/text', { text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ) } ],
				[ 'stackable/button-group', {}, [
					[ 'stackable/button', { text: 'Button' } ],
				] ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'horizontal-2',
			title: __( 'Horizontal 2', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Horizontal 2', i18n ) ),
			icon: ImageHorizontal2,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'horizontal-3',
			title: __( 'Horizontal 3', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Horizontal 3', i18n ) ),
			icon: ImageHorizontal3,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'split-centered',
			title: __( 'Split Centered', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Split Centered', i18n ) ),
			icon: ImageSplitCentered,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations
