export const substitute = {
	from: 'stackable/card',
	variants: [],
	to: [ 'stackable/columns' ],
	transform: ( oldAttributes, innerBlocks ) => {
		return [
			'stackable/columns',
			{},
			[
				[
					'stackable/column',
					{
						align: oldAttributes.align,
						hasContainer: true,
					},
					[
						[ 'stackable/image', { imageUrl: oldAttributes.imageUrl } ],
						...innerBlocks,
					],
				],
			],
		]
	},
}

export default substitute
