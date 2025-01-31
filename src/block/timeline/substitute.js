export const substitute = {
	from: 'stackable/timeline',
	transform: ( oldAttributes, innerBlocks ) => {
		const formattedDate = new Date().toLocaleDateString( 'en-US', {
			month: 'short',
			day: '2-digit',
			year: 'numeric',
		} )
		return [
			'stackable/columns',
			{
				...oldAttributes,
			},
			[
				[ 'stackable/column', {}, innerBlocks ],
				[ 'stackable/column', {}, [
					[ 'stackable/text', { text: formattedDate } ],
				] ],
			],
		]
	},
}

export default substitute
