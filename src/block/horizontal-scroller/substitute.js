export const substitute = {
	from: 'stackable/horizontal-scroller',
	variants: [],
	to: [ 'stackable/columns' ],
	transform: ( oldAttributes, innerBlocks ) => {
		return [
			'stackable/columns',
			{},
			innerBlocks,
		]
	},
}

export default substitute
