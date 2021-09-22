/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { renderToString } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'
import { Path, SVG } from '@wordpress/components'

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
			isDefault: true,
			icon: (
				<SVG
					width="48"
					height="48"
					viewBox="0 0 48 48"
					xmlns="http://www.w3.org/2000/svg"
				>
					<Path
						fillRule="evenodd"
						clipRule="evenodd"
						d="m39.0625 14h-30.0625v20.0938h30.0625zm-30.0625-2c-1.10457 0-2 .8954-2 2v20.0938c0 1.1045.89543 2 2 2h30.0625c1.1046 0 2-.8955 2-2v-20.0938c0-1.1046-.8954-2-2-2z"
					/>
				</SVG>
			),
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
			icon: (
				<SVG
					width="48"
					height="48"
					viewBox="0 0 48 48"
					xmlns="http://www.w3.org/2000/svg"
				>
					<Path
						fillRule="evenodd"
						clipRule="evenodd"
						d="m39.0625 14h-30.0625v20.0938h30.0625zm-30.0625-2c-1.10457 0-2 .8954-2 2v20.0938c0 1.1045.89543 2 2 2h30.0625c1.1046 0 2-.8955 2-2v-20.0938c0-1.1046-.8954-2-2-2z"
					/>
				</SVG>
			),
			innerBlocks: [
				[ 'stackable/icon', { icon: renderToString( <SVGDefaultQuote /> ) } ],
				[ 'stackable/text', {
					text: 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.',
				} ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'highlighted',
			title: __( 'Highlighted', i18n ),
			description: __( 'Highlighted Layout', i18n ),
			icon: (
				<SVG
					width="48"
					height="48"
					viewBox="0 0 48 48"
					xmlns="http://www.w3.org/2000/svg"
				>
					<Path
						fillRule="evenodd"
						clipRule="evenodd"
						d="m39.0625 14h-30.0625v20.0938h30.0625zm-30.0625-2c-1.10457 0-2 .8954-2 2v20.0938c0 1.1045.89543 2 2 2h30.0625c1.1046 0 2-.8955 2-2v-20.0938c0-1.1046-.8954-2-2-2z"
					/>
				</SVG>
			),
			isPremium: true,
			scope: [ 'block' ],
		},
		{
			name: 'huge',
			title: __( 'Huge', i18n ),
			description: __( 'Huge Layout', i18n ),
			icon: (
				<SVG
					width="48"
					height="48"
					viewBox="0 0 48 48"
					xmlns="http://www.w3.org/2000/svg"
				>
					<Path
						fillRule="evenodd"
						clipRule="evenodd"
						d="m39.0625 14h-30.0625v20.0938h30.0625zm-30.0625-2c-1.10457 0-2 .8954-2 2v20.0938c0 1.1045.89543 2 2 2h30.0625c1.1046 0 2-.8955 2-2v-20.0938c0-1.1046-.8954-2-2-2z"
					/>
				</SVG>
			),
			isPremium: true,
			scope: [ 'block' ],
		},
		{
			name: 'centered-quote',
			title: __( 'Centered Quote', i18n ),
			description: __( 'Centered Quote Layout', i18n ),
			icon: (
				<SVG
					width="48"
					height="48"
					viewBox="0 0 48 48"
					xmlns="http://www.w3.org/2000/svg"
				>
					<Path
						fillRule="evenodd"
						clipRule="evenodd"
						d="m39.0625 14h-30.0625v20.0938h30.0625zm-30.0625-2c-1.10457 0-2 .8954-2 2v20.0938c0 1.1045.89543 2 2 2h30.0625c1.1046 0 2-.8955 2-2v-20.0938c0-1.1046-.8954-2-2-2z"
					/>
				</SVG>
			),
			isPremium: true,
			scope: [ 'block' ],
		},
	]
)

export default variations
