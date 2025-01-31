export const substitute = {
	from: 'stackable/image',
	transform: oldAttributes => {
		return [
			'core/image',
			{
				height: oldAttributes?.imageHeight ? ( oldAttributes?.imageHeight + 'px' ) : undefined,
				url: oldAttributes?.imageUrl,
			},
		]
	},
}

export default substitute
