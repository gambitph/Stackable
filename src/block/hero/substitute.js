export const substitute = {
	from: 'stackable/hero',
	transform: ( oldAttributes, innerBlocks ) => {
		return [
			'stackable/columns',
			{
				...oldAttributes,
			},
			[ [ 'stackable/column', {}, innerBlocks ] ],
		]
	},
}

export default substitute
