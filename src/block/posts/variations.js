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
	'stackable.posts.variations',
	[
		{
			name: 'default',
			title: __( 'Default', i18n ),
			description: __( 'Default Layout', i18n ),
			isDefault: true,
			attributes: {
				hasContainer: false,
			},
			scope: [ 'block' ],
		},
		{
			name: 'list',
			title: __( 'List', i18n ),
			description: __( 'List Layout', i18n ),
			attributes: {
				imageWidth: 150,
				imageHeight: 150,
				imageWidthUnit: 'px',
				imageHeightUnit: 'px',
				hasContainer: false,
				className: 'is-style-list',
			},
			scope: [ 'block' ],
		},
	]
)

export default variations

