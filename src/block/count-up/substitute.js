export const substitute = {
	from: 'stackable/count-up',
	to: 'core/paragraph',
	transform: oldAttributes => {
		return {
			fontSize: 'x-large',
			content: oldAttributes.text,
			align: oldAttributes.contentAlign,
		}
	},
}

export default substitute
