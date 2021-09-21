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
	'stackable.hero.variations',
	[
		{
			name: 'default',
			title: __( 'Default', i18n ),
			description: __( 'Default Layout', i18n ),
			isDefault: true,
			attributes: {
				hasContainer: true,
			},
			innerBlocks: [
				[ 'stackable/heading', { text: __( 'Hero Section' ) } ],
				[ 'stackable/text', { text: 'Description for this block. Use this space for describing your block.' } ],
				[ 'stackable/button-group', {}, [
					[ 'stackable/button', { text: 'Button' } ],
				] ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'plain',
			title: __( 'Plain', i18n ),
			description: __( 'Plain Layout', i18n ),
			attributes: {
				hasContainer: false,
			},
			innerBlocks: [
				[ 'stackable/heading', { text: __( 'Hero Section' ) } ],
				[ 'stackable/text', { text: 'Description for this block. Use this space for describing your block.' } ],
				[ 'stackable/button-group', {}, [
					[ 'stackable/button', { text: 'Button' } ],
				] ],
			],
			scope: [ 'block' ],
		},
	]
)

export default variations
