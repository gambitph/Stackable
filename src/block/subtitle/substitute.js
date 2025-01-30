export const substitute = {
	from: 'stackable/subtitle',
	transform: oldAttributes => {
		return [
			'core/paragraph',
			{
				fontSize: 'small',
				align: oldAttributes.contentAlign,
				content: oldAttributes.text,
			},
		]
	},
}

export default substitute
