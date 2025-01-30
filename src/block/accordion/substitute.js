export const substitute = {
	from: 'stackable/accordion',
	transform: ( oldAttributes, innerBlocks ) => {
		// Get the heading
		const heading = innerBlocks[ 0 ][ 2 ][ 0 ][ 2 ][ 0 ][ 1 ].text
		const insideBlocks = innerBlocks[ 1 ][ 2 ]

		return [
			'core/details',
			{
				open: false,
				summary: heading,
			},
			insideBlocks,
		]
	},
}

export default substitute
