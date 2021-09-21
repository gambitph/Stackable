/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { renderToString } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'

/**
 * Internal dependencies
 */
import SVGDefaultQuote from './images/round-thin.svg'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */
const variations = applyFilters(
	'stackable.blockquote.variations',
	[
		{
			name: 'basic',
			title: __( 'Basic', i18n ),
			description: __( 'Basic Layout', i18n ),
			attributes: {
				hasContainer: true,
			},
			innerBlocks: [
				[ 'stackable/icon', { icon: renderToString( <SVGDefaultQuote /> ) } ],
				[ 'stackable/text', {
					text: 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.',
				} ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'plain',
			title: __( 'Plain', i18n ),
			description: __( 'Plain Layout', i18n ),
			innerBlocks: [
				[ 'stackable/icon', { icon: renderToString( <SVGDefaultQuote /> ) } ],
				[ 'stackable/text', {
					text: 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.',
				} ],
			],
			scope: [ 'block' ],
		},
	]
)

export default variations
