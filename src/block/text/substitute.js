export const substitute = {
	from: 'stackable/text',
	to: 'core/paragraph',
	transform: oldAttributes => {
		return {
			content: oldAttributes.text,
		}
	},
}

export default substitute
