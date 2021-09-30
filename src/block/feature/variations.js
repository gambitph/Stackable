/**
 * Internal dependencies
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
	'stackable.feature.variations',
	[
		{
			name: 'plain',
			title: __( 'Plain', i18n ),
			description: __( 'Plain Layout', i18n ),
			attributes: { className: 'is-style-plain' },
			isDefault: true,
			innerBlocks: [
				[ 'stackable/column', {}, [
					[ 'stackable/heading', { text: __( 'Feature' ) } ],
					[ 'stackable/text', { text: __( 'Description for this block. Use this space for describing your block.' ) } ],
					[ 'stackable/button-group', {}, [
						[ 'stackable/button', { text: __( 'Button' ) } ],
					] ],
				] ],
				[ 'stackable/column', { templateLock: 'insert', columnAlign: 'center' }, [
					[ 'stackable/image', {} ],
				] ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'overlap-shape-1',
			title: __( 'Overlap Shape 1', i18n ),
			description: __( 'Overlap Shape 1 Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-shape-2',
			title: __( 'Overlap Shape 2', i18n ),
			description: __( 'Overlap Shape 2 Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-shape-3',
			title: __( 'Overlap Shape 3', i18n ),
			description: __( 'Overlap Shape 3 Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-shape-4',
			title: __( 'Overlap Shape 4', i18n ),
			description: __( 'Overlap Shape 4 Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-shape-5',
			title: __( 'Overlap Shape 5', i18n ),
			description: __( 'Overlap Shape 5 Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-background-1',
			title: __( 'Overlap Background 1', i18n ),
			description: __( 'Overlap Background 1 Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-background-2',
			title: __( 'Overlap Background 2', i18n ),
			description: __( 'Overlap Background 2 Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-background-3',
			title: __( 'Overlap Background 3', i18n ),
			description: __( 'Overlap Background 3 Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-background-4',
			title: __( 'Overlap Background 4', i18n ),
			description: __( 'Overlap Background 4 Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-background-5',
			title: __( 'Overlap Background 5', i18n ),
			description: __( 'Overlap Background 5 Layout', i18n ),
			isPremium: true,
			scope: [ 'block' ],
		},
	]
)

export default variations
