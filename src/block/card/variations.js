import { i18n } from 'stackable'
import { __ } from '@wordpress/i18n'

// registerBlockVariation( 'stackable/card', {
// 	name: 'custom',
// 	title: 'Custom Columns',
// 	isDefault: true,
// 	innerBlocks: [
// 		[ 'core/heading', { content: 'Card Title' } ],
// 		[ 'core/paragraph', { content: 'Card Text' } ],
// 	],
// } )

export const blockStyles = [
	{
		name: 'default',
		label: 'Default',
		isDefault: true,
	},
	{
		name: 'horizontal',
		label: __( 'Horizontal', i18n ),
	},
]
