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
			name: 'plain',
			title: __( 'Plain', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Plain', i18n ) ),
			attributes: {
				hasContainer: false,
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
			name: 'half-overlay',
			title: __( 'Half Overlay', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Half Overlay', i18n ) ),
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'center-overlay',
			title: __( 'Center Overlay', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Center Overlay', i18n ) ),
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'side-overlay',
			title: __( 'Side Overlay', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Side Overlay', i18n ) ),
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'half',
			title: __( 'Half', i18n ),
			description: __( 'Half Layout', i18n ),
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations
