export const substitute = {
	from: 'stackable/expand',
	transform: ( oldAttributes, innerBlocks ) => {
		return [
			'stackable/text',
			{ text: innerBlocks[ 2 ][ 1 ].text },
		]
	},
}

export default substitute
