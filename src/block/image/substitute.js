export const substitute = {
	from: 'stackable/image',
	to: 'core/image',
	transform: oldAttributes => {
		if ( oldAttributes ) {
			return {
				height: oldAttributes.imageHeight,
				url: oldAttributes.imageUrl,
			}
		}
	},
}

export default substitute
