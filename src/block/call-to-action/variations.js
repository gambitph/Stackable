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
	'stackable.call-to-action.variations',
	[
		{
			name: 'basic',
			title: __( 'Basic', i18n ),
			description: __( 'Basic Layout', i18n ),
			isDefault: true,
			attributes: {
				hasContainer: true,
			},
			innerBlocks: [
				[ 'stackable/heading', { text: __( 'Call to Action' ), textTag: 'h3' } ],
				[ 'stackable/text', { text: 'Description for this block. Use this space for describing your block.' } ],
				[ 'stackable/button-group', {}, [
					[ 'stackable/button', { text: 'Button' } ],
				] ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'horizontal',
			title: __( 'Horizontal', i18n ),
			description: __( 'Horizontal Layout', i18n ),
			attributes: {
				className: 'is-style-horizontal',
				hasContainer: true,
				innerBlockOrientation: 'horizontal',
				innerBlockContentAlign: 'alignwide',
				align: 'wide',
			},
			innerBlocks: [
				[ 'stackable/heading', { text: __( 'Call to Action' ), textTag: 'h3' } ],
				[ 'stackable/text', { text: 'Description for this block. Use this space for describing your block.' } ],
				[ 'stackable/button-group', {}, [
					[ 'stackable/button', { text: 'Button' } ],
				] ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'horizontal',
			title: __( 'Horizontal', i18n ),
			description: __( 'Horizontal Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
		{
			name: 'horizontal-2',
			title: __( 'Horizontal 2', i18n ),
			description: __( 'Horizontal 2 Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
		{
			name: 'horizontal-3',
			title: __( 'Horizontal 3', i18n ),
			description: __( 'Horizontal 3 Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
		{
			name: 'split-centered',
			title: __( 'Split Centered', i18n ),
			description: __( 'Split Centered Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
	]
)

export default variations
