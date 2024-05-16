<?php
	// This is a generated file by gulp generate-stk-block-typesphp

	// Exit if accessed directly.
	if ( ! defined( 'ABSPATH' ) ) {
		exit;
	}

	if ( ! function_exists( 'stackable_get_blocks_array') ) {
		function stackable_get_blocks_array( $disabled_blocks = array() ) {
			$stk_blocks = array(
				'stackable/accordion' => [
				'apiVersion' => 3,
				'name' => 'stackable/accordion',
				'title' => 'Accordion',
				'description' => 'A title that your visitors can toggle to view more text. Use as FAQs or multiple ones for an Accordion.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'Toggle',
								'Faq'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https =>//wpstackable.com/accordion-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/blockquote' => [
				'apiVersion' => 3,
				'name' => 'stackable/blockquote',
				'title' => 'Blockquote',
				'description' => 'Display a quote in style',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'section',
				'stk-demo' => 'https =>//wpstackable.com/blockquote-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/button' => [
				'apiVersion' => 3,
				'name' => 'stackable/button',
				'title' => 'Button',
				'description' => 'Add a customizable button.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'parent' => [
								'stackable/button-group'
				],
				'keywords' => [
								'Link'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'hidden',
				'stk-demo' => 'https =>//wpstackable.com/button-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/button-group' => [
				'apiVersion' => 3,
				'name' => 'stackable/button-group',
				'title' => 'Button Group',
				'description' => 'Add a customizable button.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'Link'
				],
				'stk-variants' => [
								[
												'name' => 'icon-button',
												'title' => 'Icon Button',
												'description' => 'Add a customizable button.',
												'category' => 'stackable',
												'stk-type' => 'essential',
												'stk-demo' => 'https =>//wpstackable.com/icon-button-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
											],
								[
												'name' => 'button',
												'title' => 'Button',
												'description' => 'Add a customizable button.',
												'category' => 'stackable',
												'stk-type' => 'essential',
												'stk-demo' => 'https =>//wpstackable.com/button-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
											],
								[
												'name' => 'social-buttons',
												'title' => 'Social Buttons',
												'description' => 'Add social buttons.',
												'category' => 'stackable',
												'stk-type' => 'special',
												'stk-demo' => 'https =>//wpstackable.com/social-buttons-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
											]],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'hidden'
			],
			'stackable/call-to-action' => [
				'apiVersion' => 3,
				'name' => 'stackable/call-to-action',
				'title' => 'Call to Action',
				'description' => 'A small section you can use to call the attention of your visitors. Great for calling attention to your products or deals.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'providesContext' => [
								'stackable/innerBlockOrientation' => 'innerBlockOrientation'
							],
				'keywords' => [
								'CTA'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'section',
				'stk-demo' => 'https =>//wpstackable.com/call-to-action-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/card' => [
				'apiVersion' => 3,
				'name' => 'stackable/card',
				'title' => 'Card',
				'description' => 'Describe a single subject in a small card. You can use this to describe your product, service or a person.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'providesContext' => [
								'stackable/innerBlockOrientation' => 'innerBlockOrientation'
							],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https =>//wpstackable.com/card-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/carousel' => [
				'apiVersion' => 3,
				'name' => 'stackable/carousel',
				'title' => 'Carousel',
				'description' => 'A carousel slider.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'Slider'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https =>//wpstackable.com/carousel-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/column' => [
				'apiVersion' => 3,
				'name' => 'stackable/column',
				'title' => 'Inner Column',
				'description' => 'A single column with advanced layout options.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation',
								'stackable/columnWrapDesktop'
				],
				'providesContext' => [
								'stackable/innerBlockOrientation' => 'innerBlockOrientation'
							],
				'keywords' => [
								'Section rows'
				],
				'parent' => [
								'stackable/columns',
								'stackable/feature',
								'stackable/feature-grid',
								'stackable/horizontal-scroller',
								'stackable/tab-content'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'hidden'
			],
			'stackable/columns' => [
				'apiVersion' => 3,
				'name' => 'stackable/columns',
				'title' => 'Columns',
				'description' => 'Multiple columns with advanced layout options.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId'
				],
				'keywords' => [
								'Section rows',
								'Container'
				],
				'providesContext' => [
								'stackable/innerBlockOrientation' => 'columnJustify',
								'stackable/columnWrapDesktop' => 'columnWrapDesktop'
							],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'essential',
				'stk-demo' => 'https =>//wpstackable.com/columns-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/count-up' => [
				'apiVersion' => 3,
				'name' => 'stackable/count-up',
				'title' => 'Count Up',
				'description' => 'Showcase your stats. Display how many customers you have or the number of downloads of your app.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'Number'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https =>//wpstackable.com/count-up-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/countdown' => [
				'apiVersion' => 3,
				'name' => 'stackable/countdown',
				'title' => 'Countdown',
				'description' => 'Display a countdown timer on your website.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'Timer'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https =>//wpstackable.com/countdown-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/design-library' => [
				'apiVersion' => 3,
				'name' => 'stackable/design-library',
				'title' => 'Design Library',
				'description' => 'Choose a layout or block from the Stackable Design Library.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'Template'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https =>//wpstackable.com/designs/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/divider' => [
				'apiVersion' => 3,
				'name' => 'stackable/divider',
				'title' => 'Divider',
				'description' => 'Add a pause between your content.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'Horizontal Rule',
								'HR'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special'
			],
			'stackable/expand' => [
				'apiVersion' => 3,
				'name' => 'stackable/expand',
				'title' => 'Expand / Show More',
				'description' => 'Display a small snippet of text. Your readers can toggle it to show more information.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'Hide',
								'Less'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https =>//wpstackable.com/expand-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/feature' => [
				'apiVersion' => 3,
				'name' => 'stackable/feature',
				'title' => 'Feature',
				'description' => 'Display a product feature or a service in a large area.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'providesContext' => [
								'stackable/columnWrapDesktop' => 'columnWrapDesktop'
							],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'section',
				'stk-demo' => 'https =>//wpstackable.com/feature-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/feature-grid' => [
				'apiVersion' => 3,
				'name' => 'stackable/feature-grid',
				'title' => 'Feature Grid',
				'description' => 'Display multiple product features or services. You can use Feature Grids one after another.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'providesContext' => [
								'stackable/columnWrapDesktop' => 'columnWrapDesktop'
							],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'section',
				'stk-demo' => 'https =>//wpstackable.com/feature-grid-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/heading' => [
				'apiVersion' => 3,
				'name' => 'stackable/heading',
				'title' => 'Heading',
				'description' => 'Introduce new sections of your content in style.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'Title'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'essential',
				'stk-demo' => 'https =>//wpstackable.com/advanced-heading-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/hero' => [
				'apiVersion' => 3,
				'name' => 'stackable/hero',
				'title' => 'Hero',
				'description' => 'A large hero area. Typically used at the very top of a page.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'providesContext' => [
								'stackable/innerBlockOrientation' => 'innerBlockOrientation'
							],
				'keywords' => [
								'Header'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'section',
				'stk-demo' => 'https =>//wpstackable.com/hero-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/horizontal-scroller' => [
				'apiVersion' => 3,
				'name' => 'stackable/horizontal-scroller',
				'title' => 'Horizontal Scroller',
				'description' => 'A slider that scrolls horizontally.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'Slider',
								'Carousel'
				],
				'providesContext' => [
								'stackable/columnFit' => 'columnFit'
							],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https =>//wpstackable.com/horizontal-scroller-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/icon' => [
				'apiVersion' => 3,
				'name' => 'stackable/icon',
				'title' => 'Icon',
				'description' => 'Pick an icon or upload your own SVG icon to decorate your content.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'SVG'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'essential',
				'stk-demo' => 'https =>//wpstackable.com/icon-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/icon-box' => [
				'apiVersion' => 3,
				'name' => 'stackable/icon-box',
				'title' => 'Icon Box',
				'description' => 'A small text area with an icon that can be used to summarize features or services',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'section',
				'stk-demo' => 'https =>//wpstackable.com/icon-box-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/icon-button' => [
				'apiVersion' => 3,
				'name' => 'stackable/icon-button',
				'title' => 'Icon Button',
				'description' => 'Add a customizable button.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'parent' => [
								'stackable/button-group'
				],
				'keywords' => [
								'Link'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'hidden',
				'stk-demo' => 'https =>//wpstackable.com/icon-button-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/icon-label' => [
				'apiVersion' => 3,
				'name' => 'stackable/icon-label',
				'title' => 'Icon Label',
				'description' => 'An Icon and Heading paired together.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'SVG'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https =>//wpstackable.com/icon-label-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/icon-list' => [
				'apiVersion' => 3,
				'name' => 'stackable/icon-list',
				'title' => 'Icon List',
				'description' => 'An unordered list with icons. You can use this as a list of features or benefits.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'Checklist',
								'Bullets',
								'Number list'
				],
				'providesContext' => [
								'stackable/ordered' => 'ordered',
								'stackable/uniqueId' => 'uniqueId'
							],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'essential',
				'stk-demo' => 'https =>//wpstackable.com/icon-list-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/icon-list-item' => [
				'apiVersion' => 3,
				'name' => 'stackable/icon-list-item',
				'title' => 'Icon List Item',
				'description' => 'A single list entry in the Icon List block',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation',
								'stackable/ordered',
								'stackable/uniqueId'
				],
				'keywords' => [],
				'parent' => [
								'stackable/icon-list'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'hidden',
				'stk-demo' => 'https =>//wpstackable.com/separator-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/image' => [
				'apiVersion' => 3,
				'name' => 'stackable/image',
				'title' => 'Image',
				'description' => 'An image with advanced controls to make a visual statement.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'essential',
				'stk-demo' => 'https =>//wpstackable.com/advanced-image-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/image-box' => [
				'apiVersion' => 3,
				'name' => 'stackable/image-box',
				'title' => 'Image Box',
				'description' => 'Display an image that shows more information when hovered on. Can be used as a fancy link to other pages.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https =>//wpstackable.com/image-box-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/map' => [
				'apiVersion' => 3,
				'name' => 'stackable/map',
				'title' => 'Map',
				'description' => 'Embedded Google Map with advanced controls.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'keywords' => [
								'location',
								'address'
				],
				'stk-type' => 'special',
				'stk-demo' => 'https =>//wpstackable.com/map-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/notification' => [
				'apiVersion' => 3,
				'name' => 'stackable/notification',
				'title' => 'Notification',
				'description' => 'Show a notice to your readers. People can dismiss the notice to permanently hide it.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'providesContext' => [
								'stackable/innerBlockOrientation' => 'innerBlockOrientation'
							],
				'keywords' => [
								'Notice',
								'Alert'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https =>//wpstackable.com/notification-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/number-box' => [
				'apiVersion' => 3,
				'name' => 'stackable/number-box',
				'title' => 'Number Box',
				'description' => 'Display steps or methods that your users will do in your service.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'Steps'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https =>//wpstackable.com/number-box-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/posts' => [
				'apiVersion' => 3,
				'name' => 'stackable/posts',
				'title' => 'Posts',
				'description' => 'Your latest blog posts. Use this to showcase a few of your posts in your landing pages.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'Blog Posts',
								'Lastest Posts',
								'Query Loop'
				],
				'providesContext' => [
								'type' => 'type',
								'orderBy' => 'orderBy',
								'order' => 'order',
								'taxonomyType' => 'taxonomyType',
								'taxonomy' => 'taxonomy',
								'taxonomyFilterType' => 'taxonomyFilterType',
								'postOffset' => 'postOffset',
								'postExclude' => 'postExclude',
								'postInclude' => 'postInclude',
								'numberOfItems' => 'numberOfItems',
								'stkQueryId' => 'stkQueryId'
							],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https =>//wpstackable.com/blog-posts-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/price' => [
				'apiVersion' => 3,
				'name' => 'stackable/price',
				'title' => 'Price',
				'description' => 'Show a price of a product or service with currency and a suffix styled with different weights',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'Currency',
								'Pricing',
								'Number'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https =>//wpstackable.com/price-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/pricing-box' => [
				'apiVersion' => 3,
				'name' => 'stackable/pricing-box',
				'title' => 'Pricing Box',
				'description' => 'Display the different pricing tiers of your business.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'providesContext' => [
								'stackable/innerBlockOrientation' => 'innerBlockOrientation'
							],
				'keywords' => [
								'Currency',
								'Price',
								'Pricing Table'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'section',
				'stk-demo' => 'https =>//wpstackable.com/pricing-table-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/progress-bar' => [
				'apiVersion' => 3,
				'name' => 'stackable/progress-bar',
				'title' => 'Progress Bar',
				'description' => 'Visualize a progress value or percentage in a bar.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'percentage status'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https =>//wpstackable.com/progress-bar-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/progress-circle' => [
				'apiVersion' => 3,
				'name' => 'stackable/progress-circle',
				'title' => 'Progress Circle',
				'description' => 'Visualize a progress value or percentage in a circle.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'percentage status'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https =>//wpstackable.com/progress-circle-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/separator' => [
				'apiVersion' => 3,
				'name' => 'stackable/separator',
				'title' => 'Separator',
				'description' => 'A fancy separator to be placed between content.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'Svg Divider'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https =>//wpstackable.com/separator-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/spacer' => [
				'apiVersion' => 3,
				'name' => 'stackable/spacer',
				'title' => 'Spacer',
				'description' => 'Sometimes you just need some space.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special'
			],
			'stackable/subtitle' => [
				'apiVersion' => 3,
				'name' => 'stackable/subtitle',
				'title' => 'Subtitle',
				'description' => 'Subtitle text that you can add custom styling to from the global settings.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https =>//wpstackable.com/subtitle-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/tab-content' => [
				'apiVersion' => 3,
				'name' => 'stackable/tab-content',
				'title' => 'Tab Content',
				'description' => 'A wrapper for tab panels.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation',
								'stackable/tabPanelEffect',
								'stackable/equalTabHeight'
				],
				'keywords' => [],
				'parent' => [
								'stackable/tabs'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'hidden'
			],
			'stackable/tab-labels' => [
				'apiVersion' => 3,
				'name' => 'stackable/tab-labels',
				'title' => 'Tab Labels',
				'description' => 'Create interactive navigation within tabs.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation',
								'stackable/initialTabOpen',
								'stackable/tabOrientation'
				],
				'keywords' => [],
				'parent' => [
								'stackable/tabs'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'hidden'
			],
			'stackable/table-of-contents' => [
				'apiVersion' => 3,
				'name' => 'stackable/table-of-contents',
				'title' => 'Table of Contents',
				'description' => 'Automatically generated table of contents based on Heading blocks.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'ToC',
								'Index',
								'Outline'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https =>//wpstackable.com/table-of-contents-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/tabs' => [
				'apiVersion' => 3,
				'name' => 'stackable/tabs',
				'title' => 'Tabs',
				'description' => 'Organize and display content in multiple tabs.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'toggle'
				],
				'providesContext' => [
								'stackable/initialTabOpen' => 'initialTabOpen',
								'stackable/tabOrientation' => 'tabOrientation',
								'stackable/tabPanelEffect' => 'tabPanelEffect',
								'stackable/equalTabHeight' => 'equalTabHeight'
							],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https =>//wpstackable.com/tabs-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/team-member' => [
				'apiVersion' => 3,
				'name' => 'stackable/team-member',
				'title' => 'Team Member',
				'description' => 'Display members of your team or your office. Use multiple Team Member blocks if you have a large team.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'providesContext' => [
								'stackable/innerBlockOrientation' => 'innerBlockOrientation'
							],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'section',
				'stk-demo' => 'https =>//wpstackable.com/team-member-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/testimonial' => [
				'apiVersion' => 3,
				'name' => 'stackable/testimonial',
				'title' => 'Testimonial',
				'description' => 'Showcase what your users say about your product or service.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'providesContext' => [
								'stackable/innerBlockOrientation' => 'innerBlockOrientation'
							],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'section',
				'stk-demo' => 'https =>//wpstackable.com/testimonial-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/text' => [
				'apiVersion' => 3,
				'name' => 'stackable/text',
				'title' => 'Text',
				'description' => 'Start with the building block of all page layouts.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'Paragraph'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'essential',
				'stk-demo' => 'https =>//wpstackable.com/advanced-text-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/timeline' => [
				'apiVersion' => 3,
				'name' => 'stackable/timeline',
				'title' => 'Timeline',
				'description' => 'Show events in chronological order',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'history',
								'milestone'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https =>//wpstackable.com/timeline-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/video-popup' => [
				'apiVersion' => 3,
				'name' => 'stackable/video-popup',
				'title' => 'Video Popup',
				'description' => 'Display a large thumbnail that your users can click to play a video full-screen. Great for introductory or tutorial videos.',
				'category' => 'stackable',
				'usesContext' => [
								'postId',
								'postType',
								'queryId',
								'stackable/innerBlockOrientation'
				],
				'keywords' => [
								'YouTube',
								'Vimeo',
								'Embed Mp4'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https =>//wpstackable.com/video-popup-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			]
			);

			if ( is_array( $disabled_blocks ) && count( $disabled_blocks ) > 0 ) {
				foreach ( $disabled_blocks as $block_name ) {
					unset( $stk_blocks[ $block_name ] );
				}
			}
			return $stk_blocks;
		}

		add_filter( 'stackable.blocks', 'stackable_get_blocks_array', 1, 1 );
	}
	?>
	