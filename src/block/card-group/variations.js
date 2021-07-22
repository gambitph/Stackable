// import { registerBlockVariation } from '@wordpress/blocks'

// registerBlockVariation( 'stackable/card-group',
export default [
	{
		name: 'custom',
		title: 'Card',
		isDefault: true,
		// scope: [ 'inserter', 'block' ],
		// scope: [ 'block' ],
		innerBlocks: [
			[ 'stackable/card' ],
		],
	},
]
