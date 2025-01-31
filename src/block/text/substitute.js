export const substitute = {
	from: 'stackable/text',
	transform: oldAttributes => {
		return [
			'core/paragraph',
			{
				content: oldAttributes?.text,
				align: oldAttributes?.contentAlign,
			},
		]
	},
}

export default substitute
