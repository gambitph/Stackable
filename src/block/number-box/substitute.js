export const substitute = {
	from: 'stackable/number-box',
	to: 'core/paragraph',
	transform: oldAttributes => {
		return {
			fontSize: 'xx-large',
			content: oldAttributes.text,
			align: oldAttributes.contentAlign,
			style: { spacing: { margin: { top: '0', bottom: '0' } } },
		}
	},
}

export default substitute
