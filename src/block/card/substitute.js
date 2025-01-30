export const substitute = {
	from: 'stackable/card',
	transform: ( oldAttributes, innerBlocks ) => {
		return [
			'stackable/columns',
			{ uniqueId: 'test' },
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
