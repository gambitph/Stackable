export const substitute = {
	from: 'stackable/feature-grid',
	transform: ( oldAttributes, innerBlocks ) => {
		return [
			'stackable/columns',
			{
				...oldAttributes,
				contentAlign: 'center',
			},
			innerBlocks,
		]
	},
}

export default substitute
