export const substitute = {
	from: 'stackable/heading',
	transform: oldAttributes => {
		return [
			'core/heading',
			{
				content: oldAttributes.text,
				level: oldAttributes.textTag ? Number( oldAttributes.textTag.replace( 'h', '' ) ) : 2,
				textAlign: oldAttributes.contentAlign,
			},
		]
	},
}

export default substitute
