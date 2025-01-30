export const substitute = {
	from: 'stackable/feature-grid',
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
