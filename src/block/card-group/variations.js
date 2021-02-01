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
			[ 'stackable/card', {}, [
				[ 'core/heading', { content: 'Title for This Block' } ],
				[ 'core/paragraph', { content: 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.' } ],
				[ 'ugb/button', { buttonText: 'Button' } ],
			] ],
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
