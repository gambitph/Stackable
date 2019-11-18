/**
 * This file contains saved block HTML from older versions.
 * These will be tested if they pass migration.
 * This will be built into the dist folder as `deprecation-tests.json`
 */

module.exports = [
	{
		block: 'Blog Posts',
		version: '1.17.3',
		description: 'Default block',
		html: `<!-- wp:ugb/blog-posts /-->`,
	},
	{
		block: 'Blog Posts',
		version: '1.17.3',
		description: 'Modified block',
		html: `<!-- wp:ugb/blog-posts {"order":"asc","postsToShow":2,"columns":1,"borderRadius":46,"shadow":5} /-->`,
	},
	{
		block: 'Blog Posts',
		version: '1.17.3',
		description: 'Modified block',
		html: `<!-- wp:ugb/blog-posts {"categories":"1"} /-->`,
	},
	{
		block: 'Blog Posts',
		version: '1.17.3',
		description: 'Modified block',
		html: `<!-- wp:ugb/blog-posts {"featuredImageShape":"full","displayTitle":false,"displayDate":false,"displayComments":false,"displayExcerpt":false,"displayReadMoreLink":true,"readMoreText":"More","accentColor":"#ff06e6"} /-->`,
	},
	{
		block: 'Blog Posts',
		version: '1.17.3',
		description: 'Modified block',
		plan: 'Premium',
		html: `<!-- wp:ugb/blog-posts {"accentColor":"#cd2653","design":"portfolio"} /-->`,
	},
	{
		block: 'Blog Posts',
		version: '1.17.3',
		description: 'Modified block',
		plan: 'Premium',
		html: `<!-- wp:ugb/blog-posts {"postsToShow":2,"columns":1,"displayComments":false,"displayAuthor":false,"displayReadMoreLink":true,"design":"portfolio2"} /-->`,
	},
	{
		block: 'Blog Posts',
		version: '1.17.3',
		description: 'Modified block',
		plan: 'Premium',
		html: `<!-- wp:ugb/blog-posts {"postsToShow":4,"displayComments":false,"displayAuthor":false,"displayExcerpt":false,"accentColor":"#fcb900","design":"image-card"} /-->`,
	},
	{
		block: 'Blog Posts',
		version: '1.17.3',
		description: 'Modified block',
		plan: 'Premium',
		html: `<!-- wp:ugb/blog-posts {"postsToShow":2,"featuredImageShape":"square","displayCategory":false,"displayComments":false,"accentColor":"#8ed1fc","design":"vertical-card"} /-->`,
	},
	{
		block: 'Blog Posts',
		version: '1.17.3',
		description: 'Custom CSS',
		plan: 'Premium',
		html: `<!-- wp:ugb/blog-posts {"displayReadMoreLink":true,"customCSSUniqueID":"ugb-d6bcad4","customCSS":"/* Blog Posts container */\n.ugb-blog-posts {\n\t\n}\n\n/* Blog Post individual item */\n.ugb-blog-posts .ugb-blog-posts__item {\n\t\n}\n\n/* Blog Post category container */\n.ugb-blog-posts .ugb-blog-posts__category-list {\n}\n\n/* Blog Post category item */\n.ugb-blog-posts .ugb-blog-posts__category-list a {\n\tcolor: yellow\n}\n\n/* Blog Post featured image */\n.ugb-blog-posts .ugb-blog-posts__featured-image {\n\t\n}\n\n/* Blog Post meta info */\n.ugb-blog-posts .ugb-blog-posts__meta {\n\t\n}\n\n/* Blog Post titles */\n.ugb-blog-posts .ugb-blog-posts__title a {\n\t\n}\n\n/* Blog Post excerpt container */\n.ugb-blog-posts .ugb-blog-posts__excerpt {\n\t\n}\n\n/* Blog Post excerpt text */\n.ugb-blog-posts .ugb-blog-posts__excerpt p {\n\t\n}\n\n/* Blog Post continue reading link */\n.ugb-blog-posts .ugb-blog-posts__read_more a {\n\tcolor: orange\n}","customCSSCompiled":".ugb-d6bcad4.ugb-blog-posts .ugb-blog-posts__category-list a{color:yellow !important}.ugb-d6bcad4.ugb-blog-posts .ugb-blog-posts__read_more a{color:orange !important}"} /-->`,
	},
]
