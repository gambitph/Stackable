/**
 * Internal dependencies
 */
import ImageStyleDefault from './images/default.svg'
import ImageStyleHorizontal from './images/horizontal.svg'

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
	'stackable.card.variations',
	[
		{
			name: 'default',
			title: __( 'Default', i18n ),
			isDefault: true,
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Default', i18n ) ),
			attributes: {
				className: 'is-style-default',
			},
			icon: ImageStyleDefault,
			innerBlocks: [
				[ 'stackable/heading', {} ],
				[ 'stackable/subtitle', { text: _x( 'Subtitle for This Block', 'Subtitle placeholder', i18n ) } ],
				[ 'stackable/text', { text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ) } ],
				[ 'stackable/button-group', {}, [
					[ 'stackable/button', { text: _x( 'Button', 'Button placeholder', i18n ) } ],
				] ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'horizontal',
			title: __( 'Horizontal', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Horizontal', i18n ) ),
			icon: ImageStyleHorizontal,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'full',
			title: __( 'Full', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Full', i18n ) ),
			icon: ImageStyleHorizontal,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'faded',
			title: __( 'Faded', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Faded', i18n ) ),
			icon: ImageStyleHorizontal,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations
