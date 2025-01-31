export const substitute = {
	from: 'stackable/tabs',
	transform: ( oldAttributes, innerBlocks ) => {
		const labels = innerBlocks[ 0 ][ 1 ]?.tabLabels
		const contents = innerBlocks[ 1 ][ 2 ]

		const insideBlocks = []

		labels.forEach( ( label, index ) => {
			insideBlocks.push( [ 'stackable/heading', { text: label?.label } ] )
			if ( contents[ index ] ) {
				insideBlocks.push( contents[ index ] )
			}
		} )

		return [
			'stackable/columns',
			{
				...oldAttributes,
			},
			[ [ 'stackable/column', {}, insideBlocks ] ],
		]
	},
}

export default substitute
