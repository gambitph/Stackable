/**
 * The example of this block to show in the inserter.
 * Add attributes here that will be used to show the preview of the block.
 */

/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'

export default {
	attributes: {
		uniqueId: '1234567',
	},
	innerBlocks: [
		{
			name: 'stackable/tab-labels',
			attributes: {
				uniqueId: '1234568',
				tabLabels: [
					{ label: sprintf( __( 'Tab %d', i18n ), 1 ) },
					{ label: sprintf( __( 'Tab %d', i18n ), 2 ) },
					{ label: sprintf( __( 'Tab %d', i18n ), 3 ) },
				],
			}, innerBlocks: [],
		},
		{
			name: 'stackable/tab-content',
			attributes: { uniqueId: '1234569' },
			innerBlocks: [
				{
					name: 'stackable/column',
					attributes: { uniqueId: '1234569' },
					innerBlocks: [
						{
							name: 'stackable/text',
							attributes: {
								uniqueId: '1234569',
								text: __( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', i18n ),
							},
							innerBlocks: [],
						},
					],
				},
			],
		},
	],
}
