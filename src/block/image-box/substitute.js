export const substitute = {
	from: 'stackable/image-box',
	transform: ( oldAttributes, innerBlocks ) => {
		const imageUrl = innerBlocks[ 0 ][ 1 ]?.imageUrl
		const imageHeight = innerBlocks[ 0 ][ 1 ]?.imageHeight

		innerBlocks = innerBlocks.filter( block => ! [ 'stackable/image', 'core/image' ].includes( block[ 0 ] ) )

		return [
			'stackable/columns',
			{
				...oldAttributes,
				hasBackground: true,
				blockBackgroundMediaUrl: imageUrl,
				blockPadding: {
					top: imageHeight,
					right: 0,
					bottom: 0,
					left: 0,
				},
			},
			innerBlocks,
		]
	},
}

export default substitute
