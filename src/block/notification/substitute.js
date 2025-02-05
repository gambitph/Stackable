export const substitute = {
	from: 'stackable/notification',
	transform: ( oldAttributes, innerBlocks ) => {
		return [
			'stackable/columns',
			{
				...oldAttributes,
			},
			[
				[
					'stackable/column',
					{
						hasContainer: true,
						containerBackgroundColor: oldAttributes.containerBackgroundColor,
					},
					innerBlocks,
				],
			],
		]
	},
}

export default substitute
