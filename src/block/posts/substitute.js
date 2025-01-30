export const substitute = {
	from: 'stackable/posts',
	variants: [],
	to: [ 'core/query' ],
	transform: oldAttributes => {
		return [
			'core/query',
			{
				queryId: 0,
				query: {
					perPage: 10,
					pages: 0,
					offset: 0,
					postType: 'post',
					order: 'desc',
					orderBy: 'date',
					author: '',
					search: '',
					exclude: [],
					sticky: '',
					inherit: false,
					taxQuery: null,
					parents: [],
					format: [],
				},
				layout: { type: 'default' },
			},
			[
				[
					'core/post-template',
					{
						layout: {
							type: 'grid',
							columnCount: oldAttributes.columns,
						},
					},
					[
						[ 'post-featured-image', { aspectRatio: '1' } ],
						[ 'post-title', {} ],
						[ 'post-date', {} ],
						[ 'post-excerpt', { moreText: 'Continue Reading' } ],
					],
				],
			],
		]
	},
}

export default substitute
