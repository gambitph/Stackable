export const substitute = {
	from: 'stackable/icon-label',
	to: 'stackable/text',
	transform: ( oldAttributes, innerBlocks ) => {
		return [
			'stackable/text',
			{
				text: innerBlocks[ 1 ][ 1 ].text,
			},
		]
	},
}

export default substitute
