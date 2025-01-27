export const substitute = {
	from: 'stackable/image',
	to: 'core/image',
	transform: oldAttributes => {
		if ( oldAttributes ) {
			return { height: oldAttributes.imageHeight }
		}
	},
}

export default substitute
