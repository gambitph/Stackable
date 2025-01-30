export const substitute = {
	from: 'stackable/blockquote',
	to: 'core/pullquote',
	transform: ( oldAttributes, innerBlocks ) => {
		return {
			value: innerBlocks[ 1 ][ 1 ].text,
			align: oldAttributes.contentAlign,
		}
	},
}

export default substitute
