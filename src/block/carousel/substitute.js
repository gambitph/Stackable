export const substitute = {
	from: 'stackable/carousel',
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
