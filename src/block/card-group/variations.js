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
			[ 'stackable/card', {}, [] ],
		],
	},
	{
		name: 'custom',
		title: 'Card33',
		isDefault: true,
		// scope: [ 'inserter', 'block' ],
		// scope: [ 'block' ],
		innerBlocks: [
			[ 'stackable/card', {}, [
				[ 'core/heading', { content: 'Card Title 2' } ],
				[ 'core/paragraph', { content: 'Card Text' } ],
			] ],
		],
	},
]
