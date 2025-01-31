export const substitute = {
	from: 'stackable/table-of-contents',
	transform: oldAttributes => {
		return [
			'stackable/columns', { ...oldAttributes }, [
				[ 'stackable/column', {}, [
					[ 'stackable/text', { text: 'Table of Contents' } ],
					[ 'core/list', {}, [
						[ 'core/list-item', { content: 'First line of content' } ],
						[ 'core/list-item', { content: 'Second line of content' } ],
						[ 'core/list-item', { content: 'Third line of content' } ],
					] ],
				] ],
			],
		]
	},
}

export default substitute
