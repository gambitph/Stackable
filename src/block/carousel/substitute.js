export const substitute = {
	from: 'stackable/carousel',
	transform: ( oldAttributes, innerBlocks ) => {
		return [
			'stackable/columns',
			{ ...oldAttributes },
			innerBlocks,
		]
	},
}

export default substitute
