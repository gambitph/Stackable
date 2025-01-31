export const substitute = {
	from: 'stackable/pricing-box',
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
