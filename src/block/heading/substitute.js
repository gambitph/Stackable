export const substitute = {
	from: 'stackable/heading',
	to: 'core/heading',
	transform: oldAttributes => {
		return {
			content: oldAttributes.text,
			level: oldAttributes.textTag ? Number( oldAttributes.textTag.replace( 'h', '' ) ) : 2,
		}
	},
}

export default substitute
