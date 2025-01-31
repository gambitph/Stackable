export const substitute = {
	from: 'stackable/call-to-action',
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
