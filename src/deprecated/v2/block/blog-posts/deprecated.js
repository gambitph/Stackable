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
			let metaColor = [ 'portfolio', 'portfolio2' ].includes( attributes.design ) ? '#ffffff' : undefined
			if ( attributes.accentColor ) {
				if ( [ 'basic', 'list', 'vertical-card', 'horizontal-card', 'vertical-card2' ].includes( attributes.design ) ) {
					metaColor = attributes.accentColor
				}
			}

			let categoryColor
			if ( attributes.accentColor ) {
				if ( [ 'portfolio', 'portfolio2', 'horizontal-card', 'image-card' ].includes( attributes.design ) ) {
					categoryColor = attributes.accentColor
				}
			}

			// Update the custom CSS since the structure has changed.
			const updateCSS = css => ( css || '' )
				.replace( /\.ugb-blog-posts__category-list/g, '.ugb-blog-posts__category' )
				.replace( /\.ugb-blog-posts__read_more/g, '.ugb-blog-posts__readmore' )
				.replace( /\.ugb-blog-posts__side/g, '.ugb-blog-posts__content' )

			return {
				...attributes,

				// Custom CSS.
				customCSS: updateCSS( attributes.customCSS ),
				customCSSCompiled: updateCSS( attributes.customCSSCompiled ),

				numberOfItems: attributes.postsToShow,
				categoryHighlighted: [ 'portfolio', 'portfolio2', 'horizontal-card', 'image-card' ].includes( attributes.design ),
				metaColor,
				categoryColor,

				showImage: attributes.displayFeaturedImage,
				showTitle: attributes.displayTitle,
				showDate: attributes.displayDate,
				showCategory: attributes.displayCategory,
				showComments: attributes.displayComments,
				showAuthor: attributes.displayAuthor,
				showExcerpt: attributes.displayExcerpt,
				showReadmore: attributes.displayReadMoreLink,
				readmoreText: attributes.readMoreText,

				postType: 'post',
				taxonomyType: 'category',
				taxonomy: attributes.categories,
			}
		},
	},
]

export default deprecated
