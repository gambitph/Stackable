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
	'stackable.pricing-box.variations',
	[
		{
			name: 'basic',
			title: __( 'Basic', i18n ),
			description: __( 'Basic Layout', i18n ),
			attributes: { className: 'is-style-basic' },
			isDefault: true,
			innerBlocks: [
				[ 'stackable/image', {} ],
				[ 'stackable/heading', {
					text: __( 'Title', i18n ), textTag: 'h3', textRemoveTextMargins: true,
				} ],
				[ 'stackable/price', {} ],
				[ 'stackable/subtitle', { text: __( 'Sub Price', i18n ) } ],
				[ 'stackable/button-group', {}, [
					[ 'stackable/button', {
						text: 'Button',
					} ],
				] ],
				[ 'stackable/text', {
					text: __( 'Description for this block. You can use this space for describing your block.', i18n ),
				} ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'plain',
			title: __( 'Plain', i18n ),
			description: __( 'Plain Layout', i18n ),
			attributes: { className: 'is-style-plain', hasContainer: false },
			innerBlocks: [
				[ 'stackable/image', {} ],
				[ 'stackable/heading', {
					text: __( 'Title', i18n ), textTag: 'h3', textRemoveTextMargins: true,
				} ],
				[ 'stackable/price', {} ],
				[ 'stackable/subtitle', { text: __( 'Sub Price', i18n ) } ],
				[ 'stackable/button-group', {}, [
					[ 'stackable/button', {
						text: 'Button',
					} ],
				] ],
				[ 'stackable/text', {
					text: __( 'Description for this block. You can use this space for describing your block.', i18n ),
				} ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'compact',
			title: __( 'Compact', i18n ),
			description: __( 'Compact Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
		{
			name: 'colored',
			title: __( 'Colored', i18n ),
			description: __( 'Colored Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
		{
			name: 'sectioned',
			title: __( 'Sectioned', i18n ),
			description: __( 'Sectioned Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
	]
)

export default variations
