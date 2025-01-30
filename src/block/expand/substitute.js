export const substitute = {
	from: 'stackable/expand',
	to: 'stackable/text',
	transform: ( oldAttributes, innerBlocks ) => {
		return {
			text: innerBlocks[ 2 ][ 1 ].text,
		}
	},
}

export default substitute
