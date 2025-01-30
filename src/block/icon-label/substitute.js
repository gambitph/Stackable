export const substitute = {
	from: 'stackable/icon-label',
	to: 'stackable/text',
	transform: ( oldAttributes, innerBlocks ) => {
		return {
			text: innerBlocks[ 1 ][ 1 ].text,
		}
	},
}

export default substitute
