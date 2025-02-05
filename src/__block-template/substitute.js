export const substitute = {
	from: 'stackable/card', // The name of the current block
	transform: ( oldAttributes, innerBlocks ) => {
		return [
			'stackable/columns', // The name of the new block
			{ ...oldAttributes }, // Attributes of the new block
			// The inner blocks of the new block
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
