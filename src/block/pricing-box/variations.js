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
	'stackable.pricing-box.variations',
	[
		{
			name: 'default',
			title: __( 'Default', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Default', i18n ) ),
			attributes: { className: 'is-style-basic' },
			isDefault: true,
			innerBlocks: [
				[ 'stackable/image', {} ],
				[ 'stackable/heading', {
					text: _x( 'Title for This Block', 'Heading placeholder', i18n ), textTag: 'h3', textRemoveTextMargins: true,
				} ],
				[ 'stackable/price', {} ],
				[ 'stackable/subtitle', { text: _x( 'Subtitle for This Block', 'Subtitle placeholder', i18n ) } ],
				[ 'stackable/button-group', {}, [
					[ 'stackable/button', {
						text: _x( 'Button', 'Button placeholder', i18n ),
					} ],
				] ],
				[ 'stackable/text', {
					text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ),
				} ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'plain',
			title: __( 'Plain', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Plain', i18n ) ),
			attributes: { className: 'is-style-plain', hasContainer: false },
			innerBlocks: [
				[ 'stackable/image', {} ],
				[ 'stackable/heading', {
					text: _x( 'Title for This Block', 'Heading placeholder', i18n ), textTag: 'h3', textRemoveTextMargins: true,
				} ],
				[ 'stackable/price', {} ],
				[ 'stackable/subtitle', { text: _x( 'Subtitle for This Block', 'Subtitle placeholder', i18n ) } ],
				[ 'stackable/button-group', {}, [
					[ 'stackable/button', {
						text: _x( 'Button', 'Button placeholder', i18n ),
					} ],
				] ],
				[ 'stackable/text', {
					text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ),
				} ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'compact',
			title: __( 'Compact', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Compact', i18n ) ),
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'colored',
			title: __( 'Colored', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Colored Layout', i18n ) ),
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'sectioned',
			title: __( 'Sectioned', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Sectioned Layout', i18n ) ),
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations
