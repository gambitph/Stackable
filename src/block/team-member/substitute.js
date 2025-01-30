export const substitute = {
	from: 'stackable/team-member',
	variants: [],
	to: 'stackable/columns',
	transform: ( oldAttributes, innerBlocks ) => {
		return [ 'stackable/columns',
			{},
			[
				[ 'stackable/column',
					{},
					innerBlocks,
				],
			],
		]
	},
}

export default substitute
