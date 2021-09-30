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
			attributes: {
				className: 'is-style-horizontal',
				hasContainer: true,
				innerBlockOrientation: 'horizontal',
				innerBlockContentAlign: 'alignwide',
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
			name: 'horizontal',
			title: __( 'Horizontal', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Horizontal', i18n ) ),
			isPremium: ! isPro,
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
			name: 'horizontal-3',
			title: __( 'Horizontal 3', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Horizontal 3', i18n ) ),
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'split-centered',
			title: __( 'Split Centered', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Split Centered', i18n ) ),
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations
