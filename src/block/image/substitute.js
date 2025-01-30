export const substitute = {
	from: 'stackable/image',
	transform: oldAttributes => {
		return [
			'core/image',
			{
				height: oldAttributes?.imageHeight,
				url: oldAttributes?.imageUrl,
			},
		]
	},
}

export default substitute
