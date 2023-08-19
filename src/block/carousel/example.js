/**
 * The example of this block to show in the inserter.
 * Add attributes here that will be used to show the preview of the block.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export default {
	attributes: {
		uniqueId: '1234567',
	},
	innerBlocks: [
		{
			name: 'stackable/column', attributes: { uniqueId: '1234568' }, innerBlocks: [],
		},
		{
			name: 'stackable/column', attributes: { uniqueId: '1234569' }, innerBlocks: [],
		},
		{
			name: 'stackable/column', attributes: { uniqueId: '1234570' }, innerBlocks: [],
		},
	],
}
