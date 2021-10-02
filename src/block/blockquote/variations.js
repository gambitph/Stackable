/**
 * WordPress dependencies
 */
import {
	__, _x, sprintf,
} from '@wordpress/i18n'
import { renderToString } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'

/**
 * Internal dependencies
 */
import SVGDefaultQuote from './images/round-thin.svg'
import ImageDefault from './images/default.svg'
import ImageSimple from './images/simple.svg'
import ImageHighlighted from './images/highlighted.svg'
import ImageHuge from './images/huge.svg'
import ImageCenteredQuote from './images/centered-quote.svg'

/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'

/**
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */
const variations = applyFilters(
	'stackable.blockquote.variations',
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
				[ 'stackable/icon', { icon: renderToString( <SVGDefaultQuote /> ), linkHasLink: false } ],
				[ 'stackable/text', {
					text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ),
				} ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'simple',
			title: __( 'Simple', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Simple', i18n ) ),
			icon: ImageSimple,
			innerBlocks: [
				[ 'stackable/icon', {
					icon: renderToString( <SVGDefaultQuote /> ),
					opacity: 0.2,
					position: 'absolute',
					positionNum: {
						top: -50, right: '', bottom: '', left: -50,
					},
					iconSize: 200,
					linkHasLink: false,
				} ],
				[ 'stackable/text', {
					text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ),
				} ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'highlighted',
			title: __( 'Highlighted', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Highlighted', i18n ) ),
			icon: ImageHighlighted,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'huge',
			title: __( 'Huge', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Huge', i18n ) ),
			icon: ImageHuge,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'centered-quote',
			title: __( 'Centered Quote', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Centered Quote', i18n ) ),
			icon: ImageCenteredQuote,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations
