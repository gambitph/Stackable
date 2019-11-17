const deprecatedSchema_1_17_3 = {
	className: {
		type: 'string',
	},
	order: {
		type: 'string',
		default: 'desc',
	},
	orderBy: {
		type: 'string',
		default: 'date',
	},
	categories: {
		type: 'string',
	},
	postsToShow: {
		type: 'number',
		default: 6,
	},
	columns: {
		type: 'number',
		default: 2,
	},
	displayFeaturedImage: {
		type: 'boolean',
		default: true,
	},
	featuredImageShape: {
		type: 'string',
		default: 'landscape',
	},
	displayTitle: {
		type: 'boolean',
		default: true,
	},
	displayDate: {
		type: 'boolean',
		default: true,
	},
	displayCategory: {
		type: 'boolean',
		default: true,
	},
	displayComments: {
		type: 'boolean',
		default: true,
	},
	displayAuthor: {
		type: 'boolean',
		default: true,
	},
	displayExcerpt: {
		type: 'boolean',
		default: true,
	},
	displayReadMoreLink: {
		type: 'boolean',
		default: false,
	},
	readMoreText: {
		type: 'string',
	},
	contentAlign: {
		type: 'string',
	},
	align: {
		type: 'string',
	},
	accentColor: {
		type: 'string',
	},
	design: {
		type: 'string',
		default: 'basic',
	},
	borderRadius: {
		type: 'number',
		default: 12,
	},
	shadow: {
		type: 'number',
		default: 3,
	},

	// Custom CSS attributes.
	customCSSUniqueID: {
		type: 'string',
		default: '',
	},
	customCSS: {
		type: 'string',
		default: '',
	},
	customCSSCompiled: {
		type: 'string',
		default: '',
	},
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_17_3,
		save: () => null,
		migrate: attributes => {
			return {
				...attributes,

				// TODO: migrate to new custom CSS
				// .ugb-blog-posts__category-list -> .ugb-blog-posts__category
				// .ugb-blog-posts__read_more -> .ugb-blog-posts__readmore
				// .ugb-blog-posts__side -> .ugb-blog-posts__content

				numberOfItems: attributes.postsToShow,
			}
		},
	},
]

export default deprecated
