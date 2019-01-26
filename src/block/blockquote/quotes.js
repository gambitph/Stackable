import { __ } from '@wordpress/i18n'
import SVGRoundFatQuote from './images/round-fat.svg'
import SVGRoundQuote from './images/round.svg'
import SVGRoundThickQuote from './images/round-thick.svg'
import SVGRoundThinQuote from './images/round-thin.svg'
import SVGSquareFatQuote from './images/square-fat.svg'
import SVGSquareModernQuote from './images/square-modern.svg'
import SVGSquareQuote from './images/square.svg'
import SVGSquareSimpleQuote from './images/square-simple.svg'
import SVGSquareThinQuote from './images/square-thin.svg'

export const RoundQuote = ( style = {} ) => <SVGRoundQuote style={ style } />
export const RoundThinQuote = ( style = {} ) => <SVGRoundThinQuote style={ style } />
export const RoundThickQuote = ( style = {} ) => <SVGRoundThickQuote style={ style } />
export const RoundFatQuote = ( style = {} ) => <SVGRoundFatQuote style={ style } />
export const SquareQuote = ( style = {} ) => <SVGSquareQuote style={ style } />
export const SquareFatQuote = ( style = {} ) => <SVGSquareFatQuote style={ style } />
export const SquareModernQuote = ( style = {} ) => <SVGSquareModernQuote style={ style } />
export const SquareSimpleQuote = ( style = {} ) => <SVGSquareSimpleQuote style={ style } />
export const SquareThinQuote = ( style = {} ) => <SVGSquareThinQuote style={ style } />

export const QUOTE_ICONS = {
	'round-thin': {
		icon: RoundThinQuote(),
		iconFunc: RoundThinQuote,
		title: __( 'Round Thin' ),
		value: 'round-thin',
	},
	round: {
		icon: RoundQuote(),
		iconFunc: RoundQuote,
		title: __( 'Round' ),
		value: 'round',
	},
	'round-thick': {
		icon: RoundThickQuote(),
		iconFunc: RoundThickQuote,
		title: __( 'Round Thick' ),
		value: 'round-thick',
	},
	'round-fat': {
		icon: RoundFatQuote(),
		iconFunc: RoundFatQuote,
		title: __( 'Round Fat' ),
		value: 'round-fat',
	},
	'square-thin': {
		icon: SquareThinQuote(),
		iconFunc: SquareThinQuote,
		title: __( 'Square Thin' ),
		value: 'square-thin',
	},
	square: {
		icon: SquareQuote(),
		iconFunc: SquareQuote,
		title: __( 'Square' ),
		value: 'square',
	},
	'square-simple': {
		icon: SquareSimpleQuote(),
		iconFunc: SquareSimpleQuote,
		title: __( 'Square Simple' ),
		value: 'square-simple',
	},
	'square-modern': {
		icon: SquareModernQuote(),
		iconFunc: SquareModernQuote,
		title: __( 'Square Modern' ),
		value: 'square-modern',
	},
	'square-fat': {
		icon: SquareFatQuote(),
		iconFunc: SquareFatQuote,
		title: __( 'Square Fat' ),
		value: 'square-fat',
	},
}
