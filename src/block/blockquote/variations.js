/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { renderToString } from '@wordpress/element'

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
const variations = [
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
	{
		name: 'huge',
		title: __( 'Huge', i18n ),
		description: __( 'Huge Layout', i18n ),
		innerBlocks: [
			[ 'stackable/icon', {
				icon: renderToString( <SVGDefaultQuote /> ),
				iconSize: 72,
			} ],
			[ 'stackable/text', {
				fontSize: 42,
				text: 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.',
			} ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'centered-quote',
		title: __( 'Centered Quote', i18n ),
		description: __( 'Centered Quote Layout', i18n ),
		innerBlocks: [
			[ 'stackable/icon', {
				icon: renderToString( <SVGDefaultQuote /> ),
				position: 'absolute',
				positionNum: {
					top: 50,
					right: '',
					bottom: '',
					left: 50,
				},
				transform: 'translateX(-50px) translateY(-50px)',
				iconSize: 80,
				positionNumUnit: '%',
			} ],
			[ 'stackable/text', {
				text: 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.',
			} ],
		],
		scope: [ 'block' ],
	},
]

export default variations
