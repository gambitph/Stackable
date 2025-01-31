export const substitute = {
	from: 'stackable/feature',
	transform: ( oldAttributes, innerBlocks ) => {
		return [
			'stackable/columns',
			{ ...oldAttributes },
			innerBlocks,
		]
	},
}

export default substitute
