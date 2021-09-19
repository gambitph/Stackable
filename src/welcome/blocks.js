/**
 * All block descriptions and titles are copied here.
 */
/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

const blocks = {
	'ugb/accordion': {
		title: _x( 'Accordion', 'block title', i18n ),
		//description: __( 'A title that your visitors can toggle to view more text. Use as FAQs or multiple ones for an Accordion.', i18n ),
		sDemoURL: 'https://wpstackable.com/accordion-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/text': {
		title: _x( 'Advanced Text', 'block title', i18n ),
		//description: __( 'Start with the building block of all page layouts.', i18n ),
		sDemoURL: 'https://wpstackable.com/advanced-text-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/heading': {
		title: _x( 'Advanced Heading', 'block title', i18n ),
		//description: __( 'Introduce new sections of your content in style.', i18n ),
		sDemoURL: 'https://wpstackable.com/advanced-heading-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/blockquote': {
		title: _x( 'Blockquote', 'block title', i18n ),
		//description: __( 'Display a quote in style.', i18n ),
		sDemoURL: 'https://wpstackable.com/blockquote-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/blog-posts': {
		title: _x( 'Blog Posts', 'block title', i18n ),
		//description: __( 'Your latest blog posts. Use this to showcase a few of your posts in your landing pages.', i18n ),
		sDemoURL: 'https://wpstackable.com/blog-posts-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/button': {
		title: _x( 'Button', 'block title', i18n ),
		//description: __( 'Add a customizable button.', i18n ),
		sDemoURL: 'https://wpstackable.com/button-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/cta': {
		title: _x( 'Call to Action', 'block title', i18n ),
		//description: __( 'A small section you can use to call the attention of your visitors. Great for calling attention to your products or deals.', i18n ),
		sDemoURL: 'https://wpstackable.com/call-to-action-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/card': {
		title: _x( 'Card', 'block title', i18n ),
		//description: __( 'Describe a single subject in a small card. You can use this to describe your product, service or a person.', i18n ),
		sDemoURL: 'https://wpstackable.com/card-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/columns': {
		title: _x( 'Columns', 'block title', i18n ),
		//description: __( 'Add a block that displays content in multiple columns. Get advanced options on how you want your columns to look.', i18n ),
		sDemoURL: 'https://wpstackable.com/columns-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/container': {
		title: _x( 'Container', 'block title', i18n ),
		//description: __( 'A styled container that you can add other blocks inside. Use this to create unique layouts.', i18n ),
		sDemoURL: 'https://wpstackable.com/container-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/count-up': {
		title: _x( 'Count Up', 'block title', i18n ),
		//description: __( 'Showcase your stats. Display how many customers you have or the number of downloads of your app.', i18n ),
		sDemoURL: 'https://wpstackable.com/count-up-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/design-library': {
		title: _x( 'Design Library', 'block title', i18n ),
		//description: __( 'Choose from over a hundred block designs from the Stackable Design Library.', i18n ),
	},
	'ugb/divider': {
		title: _x( 'Divider', 'block title', i18n ),
		//description: __( 'Add a pause between your content.', i18n ),
	},
	'ugb/expand': {
		title: _x( 'Expand / Show More', 'block title', i18n ),
		//description: __( 'Display a small snippet of text. Your readers can toggle it to show more information.', i18n ),
		sDemoURL: 'https://wpstackable.com/expand-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/feature-grid': {
		title: _x( 'Feature Grid', 'block title', i18n ),
		//description: __( 'Display multiple product features or services. You can use Feature Grids one after another.', i18n ),
		sDemoURL: 'https://wpstackable.com/feature-grid-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/feature': {
		title: _x( 'Feature', 'block title', i18n ),
		//description: __( 'Display a product feature or a service in a large area.', i18n ),
		sDemoURL: 'https://wpstackable.com/feature-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/header': {
		title: _x( 'Header', 'block title', i18n ),
		//description: __( 'A large header title area. Typically used at the very top of a page.', i18n ),
		sDemoURL: 'https://wpstackable.com/header-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/icon': {
		title: _x( 'Icon', 'block title', i18n ),
		//description: __( 'Pick an icon or upload your own SVG icon to decorate your content.', i18n ),
		sDemoURL: 'https://wpstackable.com/icon-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/icon-list': {
		title: _x( 'Icon List', 'block title', i18n ),
		//description: __( 'An unordered list with icons. You can use this as a list of features or benefits.', i18n ),
		sDemoURL: 'https://wpstackable.com/icon-list-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/image-box': {
		title: _x( 'Image Box', 'block title', i18n ),
		//description: __( 'Display an image that shows more information when hovered on. Can be used as a fancy link to other pages.', i18n ),
		sDemoURL: 'https://wpstackable.com/image-box-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/notification': {
		title: _x( 'Notification', 'block title', i18n ),
		//description: __( 'Show a notice to your readers. People can dismiss the notice to permanently hide it.', i18n ),
		sDemoURL: 'https://wpstackable.com/notification-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/number-box': {
		title: _x( 'Number Box', 'block title', i18n ),
		//description: __( 'Display steps or methods that your users will do in your service. For example, "Get started in just 3 easy steps: 1, 2 and 3!"', i18n ),
		sDemoURL: 'https://wpstackable.com/number-box-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/pricing-box': {
		title: _x( 'Pricing Box', 'block title', i18n ),
		//description: __( 'Display the different pricing tiers of your business.', i18n ),
		sDemoURL: 'https://wpstackable.com/pricing-table-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/separator': {
		title: _x( 'Separator', 'block title', i18n ),
		//description: __( 'A fancy separator to be placed between content.', i18n ),
		sDemoURL: 'https://wpstackable.com/separator-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/spacer': {
		title: _x( 'Spacer', 'block title', i18n ),
		//description: __( 'Sometimes you just need some space.', i18n ),
	},
	'ugb/team-member': {
		title: _x( 'Team Member', 'block title', i18n ),
		//description: __( 'Display members of your team or your office. Use multiple Team Member blocks if you have a large team.', i18n ),
		sDemoURL: 'https://wpstackable.com/team-member-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/testimonial': {
		title: _x( 'Testimonial', 'block title', i18n ),
		//description: __( 'Showcase what your users say about your product or service.', i18n ),
		sDemoURL: 'https://wpstackable.com/testimonial-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
	'ugb/video-popup': {
		title: _x( 'Video Popup', 'block title', i18n ),
		//description: __( 'Display a large thumbnail that your users can click to play a video full-screen. Great for introductory or tutorial videos.', i18n ),
		sDemoURL: 'https://wpstackable.com/video-popup-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
	},
}

export default blocks
