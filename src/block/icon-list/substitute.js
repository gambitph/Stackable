export const substitute = {
	from: 'stackable/icon-list',
	transform: () => {
		return [
			'core/list',
			{},
			[
				[ 'core/list-item', { content: 'First line of content' } ],
				[ 'core/list-item', { content: 'Second line of content' } ],
				[ 'core/list-item', { content: 'Third line of content' } ],
			],
		]
	},
}

export default substitute
