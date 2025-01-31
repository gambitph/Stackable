export const substitute = {
	from: 'stackable/testimonial',
	transform: ( oldAttributes, innerBlocks ) => {
		return [
			'stackable/columns',
			{
				...oldAttributes,
			},
			[ [ 'stackable/column', { hasContainer: true }, innerBlocks ] ],
		]
	},
}

export default substitute
