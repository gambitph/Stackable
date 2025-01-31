export const substitute = {
	from: 'stackable/spacer',
	transform: oldAttributes => {
		return [
			'core/spacer',
			{
				height: `${ oldAttributes?.height ?? 50 }px`,
			},
		]
	},
}

export default substitute
