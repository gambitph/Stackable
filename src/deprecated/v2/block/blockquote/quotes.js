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

const RoundQuote = ( style = {}, props = {} ) => <SVGRoundQuote style={ style } { ...props } />
const RoundThinQuote = ( style = {}, props = {} ) => <SVGRoundThinQuote style={ style } { ...props } />
const RoundThickQuote = ( style = {}, props = {} ) => <SVGRoundThickQuote style={ style } { ...props } />
const RoundFatQuote = ( style = {}, props = {} ) => <SVGRoundFatQuote style={ style } { ...props } />
const SquareQuote = ( style = {}, props = {} ) => <SVGSquareQuote style={ style } { ...props } />
const SquareFatQuote = ( style = {}, props = {} ) => <SVGSquareFatQuote style={ style } { ...props } />
const SquareModernQuote = ( style = {}, props = {} ) => <SVGSquareModernQuote style={ style } { ...props } />
const SquareSimpleQuote = ( style = {}, props = {} ) => <SVGSquareSimpleQuote style={ style } { ...props } />
const SquareThinQuote = ( style = {}, props = {} ) => <SVGSquareThinQuote style={ style } { ...props } />

export const QUOTE_ICONS = {
	'round-thin': {
		icon: RoundThinQuote(),
		iconFunc: RoundThinQuote,
		title: __( 'Round Thin', i18n ),
		value: 'round-thin',
	},
	round: {
		icon: RoundQuote(),
		iconFunc: RoundQuote,
		title: __( 'Round', i18n ),
		value: 'round',
	},
	'round-thick': {
		icon: RoundThickQuote(),
		iconFunc: RoundThickQuote,
		title: __( 'Round Thick', i18n ),
		value: 'round-thick',
	},
	'round-fat': {
		icon: RoundFatQuote(),
		iconFunc: RoundFatQuote,
		title: __( 'Round Fat', i18n ),
		value: 'round-fat',
	},
	'square-thin': {
		icon: SquareThinQuote(),
		iconFunc: SquareThinQuote,
		title: __( 'Square Thin', i18n ),
		value: 'square-thin',
	},
	square: {
		icon: SquareQuote(),
		iconFunc: SquareQuote,
		title: __( 'Square', i18n ),
		value: 'square',
	},
	'square-simple': {
		icon: SquareSimpleQuote(),
		iconFunc: SquareSimpleQuote,
		title: __( 'Square Simple', i18n ),
		value: 'square-simple',
	},
	'square-modern': {
		icon: SquareModernQuote(),
		iconFunc: SquareModernQuote,
		title: __( 'Square Modern', i18n ),
		value: 'square-modern',
	},
	'square-fat': {
		icon: SquareFatQuote(),
		iconFunc: SquareFatQuote,
		title: __( 'Square Fat', i18n ),
		value: 'square-fat',
	},
}
