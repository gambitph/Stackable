/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

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
		attributes: { className: 'is-style-compact' },
		innerBlocks: [
			[ 'stackable/columns', {}, [
				[ 'stackable/column', {}, [
					[ 'stackable/image', {} ],
				] ],
				[ 'stackable/column', {
					contentAlign: 'left',
					columnAlign: 'center',
				}, [
					[ 'stackable/heading', {
						text: __( 'Title', i18n ), textTag: 'h3', textRemoveTextMargins: true,
					} ],
					[ 'stackable/price', {} ],
					[ 'stackable/subtitle', { text: __( 'Sub Price', i18n ) } ],
				] ],
			] ],
			[ 'stackable/text', {
				text: __( 'Description for this block. You can use this space for describing your block.', i18n ),
			} ],
			[ 'stackable/button-group', {}, [
				[ 'stackable/button', {
					text: 'Button',
				} ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'colored',
		title: __( 'Colored', i18n ),
		description: __( 'Colored Layout', i18n ),
		attributes: { className: 'is-style-colored' },
		innerBlocks: [
			[ 'stackable/columns',
				{
					hasBackground: true,
					blockBackgroundColor: '#28303D',
					align: 'full',
					blockMargin: {
						bottom: 0,
					},
				},
				[
					[ 'stackable/column', {}, [
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
					] ],
					[ 'stackable/text', {
						text: __( 'Description for this block. You can use this space for describing your block.', i18n ),
						blockPadding: {
							top: 32,
							right: 32,
							bottom: 32,
							left: 32,
						},
					} ],
				],
			],
		],
	},
]

export default variations
