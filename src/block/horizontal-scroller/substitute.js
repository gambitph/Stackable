export const substitute = {
	from: 'stackable/horizontal-scroller',
	transform: ( oldAttributes, innerBlocks ) => {
		return [
			'stackable/columns',
			{ ...oldAttributes },
			innerBlocks,
		]
	},
}

export default substitute
