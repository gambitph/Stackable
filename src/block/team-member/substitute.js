export const substitute = {
	from: 'stackable/team-member',
	transform: ( oldAttributes, innerBlocks ) => {
		return [
			'stackable/columns',
			{},
			[
				[
					'stackable/column',
					{},
					innerBlocks,
				],
			],
		]
	},
}

export default substitute
