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
	'stackable.feature-grid.variations',
	[
		{
			name: 'basic',
			title: __( 'Basic', i18n ),
			description: __( 'Basic Layout', i18n ),
			attributes: { className: 'is-style-basic' },
			isDefault: true,
			innerBlocks: [
				[ 'stackable/column', { templateLock: true, hasContainer: true }, [
					[ 'stackable/image' ],
					[ 'stackable/heading', {
						text: __( 'Title', i18n ), textTag: 'h3', textRemoveTextMargins: true,
					} ],
					[ 'stackable/text', { text: 'Description for this block. Use this space for describing your block.' } ],
					[ 'stackable/button-group', {}, [
						[ 'stackable/button', {
							text: 'Button',
							buttonBackgroundColor: 'transparent',
							className: 'is-style-plain',
						} ],
					] ],
				] ],
				[ 'stackable/column', { templateLock: true, hasContainer: true }, [
					[ 'stackable/image' ],
					[ 'stackable/heading', {
						text: __( 'Title', i18n ), textTag: 'h3', textRemoveTextMargins: true,
					} ],
					[ 'stackable/text', { text: 'Description for this block. Use this space for describing your block.' } ],
					[ 'stackable/button-group', {}, [
						[ 'stackable/button', {
							text: 'Button',
							buttonBackgroundColor: 'transparent',
							className: 'is-style-plain',
						} ],
					] ],
				] ],
				[ 'stackable/column', { templateLock: true, hasContainer: true }, [
					[ 'stackable/image' ],
					[ 'stackable/heading', {
						text: __( 'Title', i18n ), textTag: 'h3', textRemoveTextMargins: true,
					} ],
					[ 'stackable/text', { text: 'Description for this block. Use this space for describing your block.' } ],
					[ 'stackable/button-group', {}, [
						[ 'stackable/button', {
							text: 'Button',
							buttonBackgroundColor: 'transparent',
							className: 'is-style-plain',
						} ],
					] ],
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
			name: 'large-mid',
			title: __( 'Large Mid', i18n ),
			description: __( 'Large Mid Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
		{
			name: 'zigzag',
			title: __( 'Zigzag', i18n ),
			description: __( 'Zigzag Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
	]
)

export default variations
