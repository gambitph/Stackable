/**
 * Internal dependencies
 */
import SVGRoundFatQuote from './images/round-fat.svg'
import SVGRoundQuote from './images/round.svg'
import SVGRoundThickQuote from './images/round-thick.svg'
import SVGRoundThinQuote from './images/round-thin.svg'
import SVGSquareFatQuote from './images/square-fat.svg'
import SVGSquareModernQuote from './images/square-modern.svg'
import SVGSquareQuote from './images/square.svg'
import SVGSquareSimpleQuote from './images/square-simple.svg'
import SVGSquareThinQuote from './images/square-thin.svg'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { renderToString } from '@wordpress/element'

export const QUOTE_ICONS = {
	'round-thin': {
		icon: <SVGRoundThinQuote />,
		title: __( 'Round Thin', i18n ),
		value: renderToString( <SVGRoundThinQuote /> ),
	},
	round: {
		icon: <SVGRoundQuote />,
		title: __( 'Round', i18n ),
		value: renderToString( <SVGRoundQuote /> ),
	},
	'round-thick': {
		icon: <SVGRoundThickQuote />,
		title: __( 'Round Thick', i18n ),
		value: renderToString( <SVGRoundThickQuote /> ),
	},
	'round-fat': {
		icon: <SVGRoundFatQuote />,
		title: __( 'Round Fat', i18n ),
		value: renderToString( <SVGRoundFatQuote /> ),
	},
	'square-thin': {
		icon: <SVGSquareThinQuote />,
		title: __( 'Square Thin', i18n ),
		value: renderToString( <SVGSquareThinQuote /> ),
	},
	square: {
		icon: <SVGSquareQuote />,
		title: __( 'Square', i18n ),
		value: renderToString( <SVGSquareQuote /> ),
	},
	'square-simple': {
		icon: <SVGSquareSimpleQuote />,
		title: __( 'Square Simple', i18n ),
		value: renderToString( <SVGSquareSimpleQuote /> ),
	},
	'square-modern': {
		icon: <SVGSquareModernQuote />,
		title: __( 'Square Modern', i18n ),
		value: renderToString( <SVGSquareModernQuote /> ),
	},
	'square-fat': {
		icon: <SVGSquareFatQuote />,
		title: __( 'Square Fat', i18n ),
		value: renderToString( <SVGSquareFatQuote /> ),
	},
}
