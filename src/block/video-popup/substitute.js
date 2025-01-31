export const substitute = {
	from: 'stackable/video-popup',
	transform: oldAttributes => {
		return [
			'core/video',
			{
				src: oldAttributes?.oldAttributes,
			},
		]
	},
}

export default substitute
