export const substitute = {
	from: 'stackable/count-up',
	transform: oldAttributes => {
		return [
			'core/paragraph',
			{
				fontSize: 'x-large',
				content: oldAttributes.text,
				align: oldAttributes.contentAlign,
				style: { spacing: { margin: { top: '0', bottom: '0' } } },
			},
		]
	},
}

export default substitute
