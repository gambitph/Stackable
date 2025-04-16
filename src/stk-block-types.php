<?php
// This is a generated file by gulp generate-stk-block-typesphp

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_get_blocks_array') ) {
	function stackable_get_blocks_array( $blocks = array() ) {
		$stk_blocks = array(
			'stackable/accordion' => [
				'api_version' => '3',
				'name' => 'stackable/accordion',
				'title' => __( 'Accordion', STACKABLE_I18N ),
				'description' => __( 'A title that your visitors can toggle to view more text. Use as FAQs or multiple ones for an Accordion.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'Toggle', STACKABLE_I18N ),
					__( 'Faq', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https://wpstackable.com/accordion-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
				'stk-required-blocks' => [
					'stackable/icon-label',
					'stackable/heading',
					'stackable/icon'
				],
				'stk-substitution-blocks' => [
					'stackable/text'
				]
			],
			'stackable/blockquote' => [
				'api_version' => '3',
				'name' => 'stackable/blockquote',
				'title' => __( 'Blockquote', STACKABLE_I18N ),
				'description' => __( 'Display a quote in style', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'section',
				'stk-demo' => 'https://wpstackable.com/blockquote-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
				'stk-required-blocks' => [
					'stackable/icon'
				],
				'stk-substitution-blocks' => [
					'stackable/text'
				]
			],
			'stackable/button' => [
				'api_version' => '3',
				'name' => 'stackable/button',
				'title' => __( 'Button', STACKABLE_I18N ),
				'description' => __( 'Add a customizable button.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'parent' => [
					'stackable/button-group'
				],
				'keywords' => [
					__( 'Link', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'hidden',
				'stk-demo' => 'https://wpstackable.com/button-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
				'stk-block-dependency' => 'stackable/button-group|button'
			],
			'stackable/button-group' => [
				'api_version' => '3',
				'name' => 'stackable/button-group',
				'title' => __( 'Button Group', STACKABLE_I18N ),
				'description' => __( 'Add a customizable button.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'Link', STACKABLE_I18N )
				],
				'stk-variants' => [
					[
						'name' => 'icon-button',
						'title' => __( 'Icon Button', STACKABLE_I18N ),
						'description' => __( 'Add a customizable button.', STACKABLE_I18N ),
						'category' => 'stackable',
						'stk-type' => 'essential',
						'stk-demo' => 'https://wpstackable.com/icon-button-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
					],
					[
						'name' => 'button',
						'title' => __( 'Button', STACKABLE_I18N ),
						'description' => __( 'Add a customizable button.', STACKABLE_I18N ),
						'category' => 'stackable',
						'stk-type' => 'essential',
						'stk-demo' => 'https://wpstackable.com/button-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
					],
					[
						'name' => 'social-buttons',
						'title' => __( 'Social Buttons', STACKABLE_I18N ),
						'description' => __( 'Add social buttons.', STACKABLE_I18N ),
						'category' => 'stackable',
						'stk-type' => 'special',
						'stk-demo' => 'https://wpstackable.com/social-buttons-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
						'stk-required-blocks' => [
							'stackable/button-group|icon-button'
						]
					]
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'hidden'
			],
			'stackable/call-to-action' => [
				'api_version' => '3',
				'name' => 'stackable/call-to-action',
				'title' => __( 'Call to Action', STACKABLE_I18N ),
				'description' => __( 'A small section you can use to call the attention of your visitors. Great for calling attention to your products or deals.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'provides_context' => [
					'stackable/innerBlockOrientation' => 'innerBlockOrientation'
				],
				'keywords' => [
					__( 'CTA', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'section',
				'stk-demo' => 'https://wpstackable.com/call-to-action-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
				'stk-substitution-blocks' => [
					'stackable/heading',
					'stackable/text',
					'stackable/button-group',
					'stackable/button'
				]
			],
			'stackable/card' => [
				'api_version' => '3',
				'name' => 'stackable/card',
				'title' => __( 'Card', STACKABLE_I18N ),
				'description' => __( 'Describe a single subject in a small card. You can use this to describe your product, service or a person.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'provides_context' => [
					'stackable/innerBlockOrientation' => 'innerBlockOrientation'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https://wpstackable.com/card-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
				'stk-substitution-blocks' => [
					'stackable/heading',
					'stackable/text',
					'stackable/subtitle',
					'stackable/button-group',
					'stackable/button'
				]
			],
			'stackable/carousel' => [
				'api_version' => '3',
				'name' => 'stackable/carousel',
				'title' => __( 'Carousel', STACKABLE_I18N ),
				'description' => __( 'A carousel slider.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'Slider', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https://wpstackable.com/carousel-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/column' => [
				'api_version' => '3',
				'name' => 'stackable/column',
				'title' => __( 'Inner Column', STACKABLE_I18N ),
				'description' => __( 'A single column with advanced layout options.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation',
					'stackable/columnWrapDesktop'
				],
				'provides_context' => [
					'stackable/innerBlockOrientation' => 'innerBlockOrientation'
				],
				'keywords' => [
					__( 'Section rows', STACKABLE_I18N )
				],
				'parent' => [
					'stackable/columns',
					'stackable/carousel',
					'stackable/feature',
					'stackable/feature-grid',
					'stackable/horizontal-scroller',
					'stackable/tab-content'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'hidden',
				'stk-available-states' => [
					'enabled',
					'hidden'
				]
			],
			'stackable/columns' => [
				'api_version' => '3',
				'name' => 'stackable/columns',
				'title' => __( 'Columns', STACKABLE_I18N ),
				'description' => __( 'Multiple columns with advanced layout options.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId'
				],
				'keywords' => [
					__( 'Section rows', STACKABLE_I18N ),
					__( 'Container', STACKABLE_I18N )
				],
				'provides_context' => [
					'stackable/innerBlockOrientation' => 'columnJustify',
					'stackable/columnWrapDesktop' => 'columnWrapDesktop'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'essential',
				'stk-demo' => 'https://wpstackable.com/columns-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
				'stk-available-states' => [
					'enabled',
					'hidden'
				]
			],
			'stackable/count-up' => [
				'api_version' => '3',
				'name' => 'stackable/count-up',
				'title' => __( 'Count Up', STACKABLE_I18N ),
				'description' => __( 'Showcase your stats. Display how many customers you have or the number of downloads of your app.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'Number', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https://wpstackable.com/count-up-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/countdown' => [
				'api_version' => '3',
				'name' => 'stackable/countdown',
				'title' => __( 'Countdown', STACKABLE_I18N ),
				'description' => __( 'Display a countdown timer on your website.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'Timer', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https://wpstackable.com/countdown-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/design-library' => [
				'api_version' => '3',
				'name' => 'stackable/design-library',
				'title' => __( 'Design Library', STACKABLE_I18N ),
				'description' => __( 'Choose a layout or block from the Stackable Design Library.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'Template', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https://wpstackable.com/designs/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
				'stk-available-states' => [
					'enabled',
					'hidden'
				]
			],
			'stackable/divider' => [
				'api_version' => '3',
				'name' => 'stackable/divider',
				'title' => __( 'Divider', STACKABLE_I18N ),
				'description' => __( 'Add a pause between your content.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'Horizontal Rule', STACKABLE_I18N ),
					__( 'HR', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special'
			],
			'stackable/expand' => [
				'api_version' => '3',
				'name' => 'stackable/expand',
				'title' => __( 'Expand / Show More', STACKABLE_I18N ),
				'description' => __( 'Display a small snippet of text. Your readers can toggle it to show more information.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'Hide', STACKABLE_I18N ),
					__( 'Less', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https://wpstackable.com/expand-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
				'stk-required-blocks' => [
					'stackable/text',
					'stackable/button-group|button'
				]
			],
			'stackable/feature' => [
				'api_version' => '3',
				'name' => 'stackable/feature',
				'title' => __( 'Feature', STACKABLE_I18N ),
				'description' => __( 'Display a product feature or a service in a large area.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'provides_context' => [
					'stackable/columnWrapDesktop' => 'columnWrapDesktop'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'section',
				'stk-demo' => 'https://wpstackable.com/feature-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
				'stk-required-blocks' => [
					'stackable/image'
				],
				'stk-substitution-blocks' => [
					'stackable/heading',
					'stackable/text',
					'stackable/button-group',
					'stackable/button'
				]
			],
			'stackable/feature-grid' => [
				'api_version' => '3',
				'name' => 'stackable/feature-grid',
				'title' => __( 'Feature Grid', STACKABLE_I18N ),
				'description' => __( 'Display multiple product features or services. You can use Feature Grids one after another.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'provides_context' => [
					'stackable/columnWrapDesktop' => 'columnWrapDesktop'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'section',
				'stk-demo' => 'https://wpstackable.com/feature-grid-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
				'stk-substitution-blocks' => [
					'stackable/image',
					'stackable/heading',
					'stackable/text',
					'stackable/button-group',
					'stackable/button'
				]
			],
			'stackable/heading' => [
				'api_version' => '3',
				'name' => 'stackable/heading',
				'title' => __( 'Heading', STACKABLE_I18N ),
				'description' => __( 'Introduce new sections of your content in style.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'Title', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'essential',
				'stk-demo' => 'https://wpstackable.com/advanced-heading-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/hero' => [
				'api_version' => '3',
				'name' => 'stackable/hero',
				'title' => __( 'Hero', STACKABLE_I18N ),
				'description' => __( 'A large hero area. Typically used at the very top of a page.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'provides_context' => [
					'stackable/innerBlockOrientation' => 'innerBlockOrientation'
				],
				'keywords' => [
					__( 'Header', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'section',
				'stk-demo' => 'https://wpstackable.com/hero-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
				'stk-substitution-blocks' => [
					'stackable/heading',
					'stackable/text',
					'stackable/button-group',
					'stackable/button'
				]
			],
			'stackable/horizontal-scroller' => [
				'api_version' => '3',
				'name' => 'stackable/horizontal-scroller',
				'title' => __( 'Horizontal Scroller', STACKABLE_I18N ),
				'description' => __( 'A slider that scrolls horizontally.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'Slider', STACKABLE_I18N ),
					__( 'Carousel', STACKABLE_I18N )
				],
				'provides_context' => [
					'stackable/columnFit' => 'columnFit'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https://wpstackable.com/horizontal-scroller-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/icon' => [
				'api_version' => '3',
				'name' => 'stackable/icon',
				'title' => __( 'Icon', STACKABLE_I18N ),
				'description' => __( 'Pick an icon or upload your own SVG icon to decorate your content.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'SVG', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'essential',
				'stk-demo' => 'https://wpstackable.com/icon-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/icon-box' => [
				'api_version' => '3',
				'name' => 'stackable/icon-box',
				'title' => __( 'Icon Box', STACKABLE_I18N ),
				'description' => __( 'A small text area with an icon that can be used to summarize features or services', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'section',
				'stk-demo' => 'https://wpstackable.com/icon-box-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
				'stk-required-blocks' => [
					'stackable/icon-label',
					'stackable/icon',
					'stackable/heading'
				]
			],
			'stackable/icon-button' => [
				'api_version' => '3',
				'name' => 'stackable/icon-button',
				'title' => __( 'Icon Button', STACKABLE_I18N ),
				'description' => __( 'Add a customizable button.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'parent' => [
					'stackable/button-group'
				],
				'keywords' => [
					__( 'Link', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'hidden',
				'stk-demo' => 'https://wpstackable.com/icon-button-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
				'stk-block-dependency' => 'stackable/button-group|icon-button'
			],
			'stackable/icon-label' => [
				'api_version' => '3',
				'name' => 'stackable/icon-label',
				'title' => __( 'Icon Label', STACKABLE_I18N ),
				'description' => __( 'An Icon and Heading paired together.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'SVG', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https://wpstackable.com/icon-label-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
				'stk-required-blocks' => [
					'stackable/icon',
					'stackable/heading'
				]
			],
			'stackable/icon-list' => [
				'api_version' => '3',
				'name' => 'stackable/icon-list',
				'title' => __( 'Icon List', STACKABLE_I18N ),
				'description' => __( 'An unordered list with icons. You can use this as a list of features or benefits.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'Checklist', STACKABLE_I18N ),
					__( 'Bullets', STACKABLE_I18N ),
					__( 'Number list', STACKABLE_I18N )
				],
				'provides_context' => [
					'stackable/ordered' => 'ordered',
					'stackable/uniqueId' => 'uniqueId'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'essential',
				'stk-demo' => 'https://wpstackable.com/icon-list-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/icon-list-item' => [
				'api_version' => '3',
				'name' => 'stackable/icon-list-item',
				'title' => __( 'Icon List Item', STACKABLE_I18N ),
				'description' => __( 'A single list entry in the Icon List block', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation',
					'stackable/ordered',
					'stackable/uniqueId'
				],
				'keywords' => [

				],
				'parent' => [
					'stackable/icon-list'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'hidden',
				'stk-demo' => 'https://wpstackable.com/separator-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/image' => [
				'api_version' => '3',
				'name' => 'stackable/image',
				'title' => __( 'Image', STACKABLE_I18N ),
				'description' => __( 'An image with advanced controls to make a visual statement.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'essential',
				'stk-demo' => 'https://wpstackable.com/advanced-image-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/image-box' => [
				'api_version' => '3',
				'name' => 'stackable/image-box',
				'title' => __( 'Image Box', STACKABLE_I18N ),
				'description' => __( 'Display an image that shows more information when hovered on. Can be used as a fancy link to other pages.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https://wpstackable.com/image-box-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
				'stk-required-blocks' => [
					'stackable/image',
					'stackable/subtitle',
					'stackable/icon'
				],
				'stk-substitution-blocks' => [
					'stackable/heading',
					'stackable/text'
				]
			],
			'stackable/map' => [
				'api_version' => '3',
				'name' => 'stackable/map',
				'title' => __( 'Map', STACKABLE_I18N ),
				'description' => __( 'Embedded Google Map with advanced controls.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'keywords' => [
					__( 'location', STACKABLE_I18N ),
					__( 'address', STACKABLE_I18N )
				],
				'stk-type' => 'special',
				'stk-demo' => 'https://wpstackable.com/map-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/notification' => [
				'api_version' => '3',
				'name' => 'stackable/notification',
				'title' => __( 'Notification', STACKABLE_I18N ),
				'description' => __( 'Show a notice to your readers. People can dismiss the notice to permanently hide it.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'provides_context' => [
					'stackable/innerBlockOrientation' => 'innerBlockOrientation'
				],
				'keywords' => [
					__( 'Notice', STACKABLE_I18N ),
					__( 'Alert', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https://wpstackable.com/notification-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
				'stk-required-blocks' => [
					'stackable/icon'
				],
				'stk-substitution-blocks' => [
					'stackable/heading',
					'stackable/text',
					'stackable/button-group',
					'stackable/button'
				]
			],
			'stackable/number-box' => [
				'api_version' => '3',
				'name' => 'stackable/number-box',
				'title' => __( 'Number Box', STACKABLE_I18N ),
				'description' => __( 'Display steps or methods that your users will do in your service.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'Steps', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https://wpstackable.com/number-box-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/posts' => [
				'api_version' => '3',
				'name' => 'stackable/posts',
				'title' => __( 'Posts', STACKABLE_I18N ),
				'description' => __( 'Your latest blog posts. Use this to showcase a few of your posts in your landing pages.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'Blog Posts', STACKABLE_I18N ),
					__( 'Lastest Posts', STACKABLE_I18N ),
					__( 'Query Loop', STACKABLE_I18N )
				],
				'provides_context' => [
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
				'stk-demo' => 'https://wpstackable.com/blog-posts-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/price' => [
				'api_version' => '3',
				'name' => 'stackable/price',
				'title' => __( 'Price', STACKABLE_I18N ),
				'description' => __( 'Show a price of a product or service with currency and a suffix styled with different weights', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'Currency', STACKABLE_I18N ),
					__( 'Pricing', STACKABLE_I18N ),
					__( 'Number', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https://wpstackable.com/price-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
				'stk-required-blocks' => [
					'stackable/text'
				]
			],
			'stackable/pricing-box' => [
				'api_version' => '3',
				'name' => 'stackable/pricing-box',
				'title' => __( 'Pricing Box', STACKABLE_I18N ),
				'description' => __( 'Display the different pricing tiers of your business.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'provides_context' => [
					'stackable/innerBlockOrientation' => 'innerBlockOrientation'
				],
				'keywords' => [
					__( 'Currency', STACKABLE_I18N ),
					__( 'Price', STACKABLE_I18N ),
					__( 'Pricing Table', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'section',
				'stk-demo' => 'https://wpstackable.com/pricing-table-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
				'stk-required-blocks' => [
					'stackable/price',
					'stackable/text',
					'stackable/icon-list'
				],
				'stk-substitution-blocks' => [
					'stackable/heading',
					'stackable/subtitle',
					'stackable/button-group',
					'stackable/button'
				]
			],
			'stackable/progress-bar' => [
				'api_version' => '3',
				'name' => 'stackable/progress-bar',
				'title' => __( 'Progress Bar', STACKABLE_I18N ),
				'description' => __( 'Visualize a progress value or percentage in a bar.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'percentage status', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https://wpstackable.com/progress-bar-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/progress-circle' => [
				'api_version' => '3',
				'name' => 'stackable/progress-circle',
				'title' => __( 'Progress Circle', STACKABLE_I18N ),
				'description' => __( 'Visualize a progress value or percentage in a circle.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'percentage status', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https://wpstackable.com/progress-circle-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/separator' => [
				'api_version' => '3',
				'name' => 'stackable/separator',
				'title' => __( 'Separator', STACKABLE_I18N ),
				'description' => __( 'A fancy separator to be placed between content.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'Svg Divider', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https://wpstackable.com/separator-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/spacer' => [
				'api_version' => '3',
				'name' => 'stackable/spacer',
				'title' => __( 'Spacer', STACKABLE_I18N ),
				'description' => __( 'Sometimes you just need some space.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special'
			],
			'stackable/subtitle' => [
				'api_version' => '3',
				'name' => 'stackable/subtitle',
				'title' => __( 'Subtitle', STACKABLE_I18N ),
				'description' => __( 'Subtitle text that you can add custom styling to from the global settings.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https://wpstackable.com/subtitle-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/tab-content' => [
				'api_version' => '3',
				'name' => 'stackable/tab-content',
				'title' => __( 'Tab Content', STACKABLE_I18N ),
				'description' => __( 'A wrapper for tab panels.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation',
					'stackable/tabPanelEffect',
					'stackable/equalTabHeight'
				],
				'keywords' => [

				],
				'parent' => [
					'stackable/tabs'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'hidden'
			],
			'stackable/tab-labels' => [
				'api_version' => '3',
				'name' => 'stackable/tab-labels',
				'title' => __( 'Tab Labels', STACKABLE_I18N ),
				'description' => __( 'Create interactive navigation within tabs.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation',
					'stackable/initialTabOpen',
					'stackable/tabOrientation'
				],
				'keywords' => [

				],
				'parent' => [
					'stackable/tabs'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'hidden'
			],
			'stackable/table-of-contents' => [
				'api_version' => '3',
				'name' => 'stackable/table-of-contents',
				'title' => __( 'Table of Contents', STACKABLE_I18N ),
				'description' => __( 'Automatically generated table of contents based on Heading blocks.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'ToC', STACKABLE_I18N ),
					__( 'Index', STACKABLE_I18N ),
					__( 'Outline', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https://wpstackable.com/table-of-contents-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/tabs' => [
				'api_version' => '3',
				'name' => 'stackable/tabs',
				'title' => __( 'Tabs', STACKABLE_I18N ),
				'description' => __( 'Organize and display content in multiple tabs.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'toggle', STACKABLE_I18N )
				],
				'provides_context' => [
					'stackable/initialTabOpen' => 'initialTabOpen',
					'stackable/tabOrientation' => 'tabOrientation',
					'stackable/tabPanelEffect' => 'tabPanelEffect',
					'stackable/equalTabHeight' => 'equalTabHeight'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https://wpstackable.com/tabs-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/team-member' => [
				'api_version' => '3',
				'name' => 'stackable/team-member',
				'title' => __( 'Team Member', STACKABLE_I18N ),
				'description' => __( 'Display members of your team or your office. Use multiple Team Member blocks if you have a large team.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'provides_context' => [
					'stackable/innerBlockOrientation' => 'innerBlockOrientation'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'section',
				'stk-demo' => 'https://wpstackable.com/team-member-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
				'stk-substitution-blocks' => [
					'stackable/image',
					'stackable/heading',
					'stackable/subtitle',
					'stackable/text',
					'stackable/button-group',
					'stackable/button'
				]
			],
			'stackable/testimonial' => [
				'api_version' => '3',
				'name' => 'stackable/testimonial',
				'title' => __( 'Testimonial', STACKABLE_I18N ),
				'description' => __( 'Showcase what your users say about your product or service.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'provides_context' => [
					'stackable/innerBlockOrientation' => 'innerBlockOrientation'
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'section',
				'stk-demo' => 'https://wpstackable.com/testimonial-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
				'stk-required-blocks' => [
					'stackable/image-box'
				],
				'stk-substitution-blocks' => [
					'stackable/image',
					'stackable/heading',
					'stackable/subtitle',
					'stackable/text'
				]
			],
			'stackable/text' => [
				'api_version' => '3',
				'name' => 'stackable/text',
				'title' => __( 'Text', STACKABLE_I18N ),
				'description' => __( 'Start with the building block of all page layouts.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'Paragraph', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'essential',
				'stk-demo' => 'https://wpstackable.com/advanced-text-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/timeline' => [
				'api_version' => '3',
				'name' => 'stackable/timeline',
				'title' => __( 'Timeline', STACKABLE_I18N ),
				'description' => __( 'Show events in chronological order', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'history', STACKABLE_I18N ),
					__( 'milestone', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https://wpstackable.com/timeline-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink'
			],
			'stackable/video-popup' => [
				'api_version' => '3',
				'name' => 'stackable/video-popup',
				'title' => __( 'Video Popup', STACKABLE_I18N ),
				'description' => __( 'Display a large thumbnail that your users can click to play a video full-screen. Great for introductory or tutorial videos.', STACKABLE_I18N ),
				'category' => 'stackable',
				'uses_context' => [
					'postId',
					'postType',
					'queryId',
					'stackable/innerBlockOrientation'
				],
				'keywords' => [
					__( 'YouTube', STACKABLE_I18N ),
					__( 'Vimeo', STACKABLE_I18N ),
					__( 'Embed Mp4', STACKABLE_I18N )
				],
				'textdomain' => 'stackable-ultimate-gutenberg-blocks',
				'stk-type' => 'special',
				'stk-demo' => 'https://wpstackable.com/video-popup-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
				'stk-required-blocks' => [
					'stackable/icon',
					'stackable/image'
				]
			]
		);

		return array_merge( $blocks, $stk_blocks );
	}

	add_filter( 'stackable.blocks', 'stackable_get_blocks_array' );
}
?>