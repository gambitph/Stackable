/**
 * Internal dependencies
 */
import ImageStyleDefault from './images/default.svg'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
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
			description: __( 'Default Layout', i18n ),
			attributes: {
				className: 'is-style-default',
			},
			icon: ImageStyleDefault,
			innerBlocks: [
				[ 'stackable/heading', {} ],
				[ 'stackable/subtitle', { text: 'Subtitle for This Block' } ],
				[ 'stackable/text', { text: 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.' } ],
				[ 'stackable/button-group', {}, [
					[ 'stackable/button', { text: 'Button' } ],
				] ],
			],
			scope: [ 'block' ],
		},
	]
)

export default variations
