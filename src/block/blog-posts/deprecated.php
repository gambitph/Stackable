<?php
/**
 * Handles the migration of old/removed attributes to new attributes.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_block_blog_posts_is_deprecated' ) ) {
	/**
	 * Check whether the blog post block is deprecated based on it's attributes & content.
	 *
	 * @param array $attributes Block attributes.
	 * @param string $content Block inner content.
	 *
	 * @return boolean True if the block was created in v1.
	 *
	 * @since 2.0
	 */
	function stackable_block_blog_posts_is_deprecated( $attributes, $content = '' ) {
		// If no content, then the block was created with version 1.
		if ( empty( $content ) ) {
			return true;
		}
	}
}

if ( ! function_exists( 'stackable_block_blog_posts_migrate_attributes' ) ) {
	/**
	 * Migrate old attributes to new attributes.
	 *
	 * @param array 	$attributes 	Current saved block attributes.
	 * @param string 	$block_name 	The name of the block.
	 *
	 * @return array New set of attributes.
	 *
	 * @since 2.0
	 */
	function stackable_block_blog_posts_migrate_attributes( $attributes, $block_name ) {
		if ( $block_name !== 'blog-posts' ) {
			return $attributes;
		}

		$design = ! empty( $attributes['design'] ) ? $attributes['design'] : 'basic';
		$accent_color = ! empty( $attributes['accentColor'] ) ? $attributes['accentColor'] : '';

		if ( array_key_exists( 'postsToShow', $attributes ) ) {
			$attributes['numberOfItems'] = $attributes['postsToShow'];
		}
		if ( array_key_exists( 'design', $attributes ) ) {
			$attributes['categoryHighlighted'] = in_array( $design, array( 'portfolio', 'portfolio2', 'horizontal-card', 'image-card' ) );
		}

		if ( ! array_key_exists( 'metaColor', $attributes ) ) {
			$attributes['metaColor'] = in_array( $design, array( 'portfolio', 'portfolio2' ) ) ? '#ffffff' : '';
			if ( ! empty( $accent_color ) ) {
				if ( in_array( $design, array( 'basic', 'list', 'vertical-card', 'horizontal-card', 'vertical-card2' ) ) ) {
					$attributes['metaColor'] = $accent_color;
				}
			}
		}

		if ( ! array_key_exists( 'categoryColor', $attributes ) ) {
			$attributes['categoryColor'] = '';
			if ( ! empty( $accent_color ) ) {
				if ( in_array( $design, array( 'portfolio', 'portfolio2', 'horizontal-card', 'image-card' ) ) ) {
					$attributes['categoryColor'] = $accent_color;
				}
			}
		}

		$attributes['contentAlign'] = isset( $attributes['contentAlign'] ) ? $attributes['contentAlign'] : '';
		$attributes['align'] = isset( $attributes['align'] ) ? $attributes['align'] : '';
		$attributes['columns'] = isset( $attributes['columns'] ) ? $attributes['columns'] : 2;
		$attributes['showImage'] = isset( $attributes['displayFeaturedImage'] ) ? $attributes['displayFeaturedImage'] : '';
		$attributes['showTitle'] = isset( $attributes['displayTitle'] ) ? $attributes['displayTitle'] : '';
		$attributes['showDate'] = isset( $attributes['displayDate'] ) ? $attributes['displayDate'] : '';
		$attributes['showCategory'] = isset( $attributes['displayCategory'] ) ? $attributes['displayCategory'] : '';
		$attributes['showComments'] = isset( $attributes['displayComments'] ) ? $attributes['displayComments'] : '';
		$attributes['showAuthor'] = isset( $attributes['displayAuthor'] ) ? $attributes['displayAuthor'] : '';
		$attributes['showExcerpt'] = isset( $attributes['displayExcerpt'] ) ? $attributes['displayExcerpt'] : '';
		$attributes['showReadmore'] = isset( $attributes['displayReadMoreLink'] ) ? $attributes['displayReadMoreLink'] : false;
		$attributes['readmoreText'] = isset( $attributes['readMoreText'] ) ? $attributes['readMoreText'] : '';

		$attributes['postType'] = 'post';
		$attributes['taxonomyType'] = 'category';
		$attributes['taxonomy'] = ! empty( $attributes['categories'] ) ? $attributes['categories'] : '';

		// Update the custom CSS since the structure has changed.
		$css = isset( $attributes['customCSS'] ) ? $attributes['customCSS'] : '';
		$css = preg_replace( '/\.ugb-blog-posts__category-list/i', '.ugb-blog-posts__category', $css );
		$css = preg_replace( '/\.ugb-blog-posts__read_more/i', '.ugb-blog-posts__readmore', $css );
		$css = preg_replace( '/\.ugb-blog-posts__side/i', '.ugb-blog-posts__content', $css );
		$attributes['customCSS'] = $css;

		$css = isset( $attributes['customCSSCompiled'] ) ? $attributes['customCSSCompiled'] : '';
		$css = preg_replace( '/\.ugb-blog-posts__category-list/i', '.ugb-blog-posts__category', $css );
		$css = preg_replace( '/\.ugb-blog-posts__read_more/i', '.ugb-blog-posts__readmore', $css );
		$css = preg_replace( '/\.ugb-blog-posts__side/i', '.ugb-blog-posts__content', $css );
		$attributes['customCSSCompiled'] = $css;

		return $attributes;
	}
	add_filter( 'stackable_block_migrate_attributes', 'stackable_block_blog_posts_migrate_attributes', 10, 2 );
}

if ( ! function_exists( 'stackable_block_blog_posts_migrate_output' ) ) {
	// We use this for old < v2 blocks as unique IDs.
	global $stkbp_unique_id;
	$stkbp_unique_id = 0;

	/**
	 * Creates a fake wrapper around the deprecated blog posts block to make it look like the new blocks.
	 * This is required to make the migrated blocks look good while not yet edited using v2.
	 * Used when the user just updated the plugin but didn't edit the block.
	 *
	 * @param string $output Block output.
	 * @param array $attributes Migrated attributes.
	 * @param string $content Block inner content.
	 *
	 * @return string Block output.
	 *
	 * @since 2.0
	 */
	function stackable_block_blog_posts_migrate_output( $output, $attributes, $content ) {
		if ( ! stackable_block_blog_posts_is_deprecated( $attributes, $content ) ) {
			return $output;
		}

		global $stkbp_unique_id;
		$stkbp_unique_id++;

		$border_radius = '';
		if ( ! empty( $attributes['borderRadius'] ) ) {
			if ( $attributes['design'] === '' || $attributes['design'] === 'basic' || $attributes['design'] === 'list' ) {
				$border_radius = '<style>.ugb-blog-posts-old-' . $stkbp_unique_id . ' .ugb-blog-posts__featured-image img { border-radius: ' . $attributes['borderRadius'] . 'px !important; }</style>';
			} else if ( $attributes['design'] === 'vertical-card2' ) {
				$border_radius = '<style>.ugb-blog-posts-old-' . $stkbp_unique_id . ' .ugb-blog-posts__item, .ugb-blog-posts-old-' . $stkbp_unique_id . ' .ugb-blog-posts__featured-image { border-radius: ' . $attributes['borderRadius'] . 'px !important; }</style>';
			} else {
				$border_radius = '<style>.ugb-blog-posts-old-' . $stkbp_unique_id . ' .ugb-blog-posts__item { border-radius: ' . $attributes['borderRadius'] . 'px !important; }</style>';
			}
		}

		return sprintf( '<div class="ugb-blog-posts ugb-blog-posts-old-%s ugb-blog-posts--columns-%s ugb-blog-posts--v2 ugb-main-block ugb-blog-posts--design-%s %s %s" style="%s%s"><div class="ugb-inner-block">%s<div class="ugb-block-content">%s</div></div></div>',
			$stkbp_unique_id,
			$attributes['columns'],
			$attributes['design'],
			$attributes['align'] ? 'align' . $attributes['align'] . '' : '',
			$attributes['categoryHighlighted'] ? 'ugb-blog-posts--cat-highlighted' : '',
			isset( $attributes['accentColor'] ) ? '--s-accent-color: ' . $attributes['accentColor'] . ';' : '',
			isset( $attributes['contentAlign'] ) ? 'text-align: ' . $attributes['contentAlign'] . ';' : '',
			$border_radius,
			$output
		);
	}
	add_filter( 'stackable/blog-posts/edit.output.markup', 'stackable_block_blog_posts_migrate_output', 10, 3 );
}
