// import { registerBlockVariation } from '@wordpress/blocks'

// registerBlockVariation( 'stackable/card-group',
export default [
	{
		name: 'custom',
		title: 'Card (v3)',
		isDefault: true,
		// scope: [ 'inserter', 'block' ],
		// scope: [ 'block' ],
		innerBlocks: [
			[ 'stackable/card' ],
		],
	},
]
