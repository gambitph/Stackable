export const substitute = {
	from: 'stackable/icon-list',
	transform: () => {
		return [
			'core/list',
			{},
			[
				[ 'core/list-item', { content: 'First item list' } ],
				[ 'core/list-item', { content: 'Second item list' } ],
				[ 'core/list-item', { content: 'Third item list' } ],
			],
		]
	},
}

export default substitute
