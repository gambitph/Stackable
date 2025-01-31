export const substitute = {
	from: 'stackable/price',
	transform: ( oldAttributes, innerBlocks ) => {
		let content = ''
		for ( const block of innerBlocks ) {
			content += block[ 1 ].text
		}
		return [ 'core/paragraph', {
			fontSize: 'x-large',
			align: oldAttributes.contentAlign,
			content,
		} ]
	},
}

export default substitute
