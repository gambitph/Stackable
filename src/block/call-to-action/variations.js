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
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Default', i18n ) ),
			isDefault: true,
			attributes: {
				className: 'is-style-default',
				hasContainer: true,
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Default', i18n ),
			pickerIcon: ImageDefault,
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
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Horizontal', i18n ) ),
			attributes: {
				className: 'is-style-horizontal',
				hasContainer: true,
				innerBlockOrientation: 'horizontal',
				innerBlockContentAlign: 'alignwide',
				innerBlockVerticalAlign: 'center',
				align: 'wide',
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Horizontal', i18n ),
			pickerIcon: ImageHorizontal,
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
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Horizontal 2', i18n ) ),
			isActive: [ 'className' ],
			pickerTitle: __( 'Horizontal 2', i18n ),
			pickerIcon: ImageHorizontal2,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'horizontal-3',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Horizontal 3', i18n ) ),
			isActive: [ 'className' ],
			pickerTitle: __( 'Horizontal 3', i18n ),
			pickerIcon: ImageHorizontal3,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'split-centered',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Split Centered', i18n ) ),
			isActive: [ 'className' ],
			pickerTitle: __( 'Split Centered', i18n ),
			pickerIcon: ImageSplitCentered,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations
