export const substitute = {
	from: 'stackable/price',
	to: 'core/paragraph',
	transform: ( oldAttributes, innerBlocks ) => {
		let content = ''
		for ( const block of innerBlocks ) {
			content += block[ 1 ].text
		}
		return [ 'core/paragraph', {
			fontSize: 'x-large',
			content,
		} ]
	},
}

export default substitute
