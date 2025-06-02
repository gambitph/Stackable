export const substitute = {
	from: 'stackable/icon-list',
	transform: ( oldAttributes, innerBlocks ) => {
		const newInnerBlocks = innerBlocks.reduce( ( newInnerBlocks, innerBlock ) => {
			const attributes = innerBlock[ 1 ]

			newInnerBlocks.push( [ 'core/list-item', { content: attributes.text } ] )
			return newInnerBlocks
		}, [] )
		return [
			'core/list',
			{},
			newInnerBlocks,
		]
	},
}

export default substitute
