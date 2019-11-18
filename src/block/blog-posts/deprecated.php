<?php
/**
 * Handles the migration of old/removed attributes to new attributes.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_block_blog_posts_migrate_attributes' ) ) {
	/**
	 * Migrate old attributes to new attributes.
	 *
	 * @param array 	$attributes 	Current saved block attributes.
	 * @param string 	$block_name 	The name of the block.
	 *
	 * @return array New set of attributes.
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

		$attributes['metaColor'] = in_array( $design, array( 'portfolio', 'portfolio2' ) ) ? '#ffffff' : '';
		if ( ! empty( $accent_color ) ) {
			if ( in_array( $design, array( 'basic', 'list', 'vertical-card', 'horizontal-card', 'vertical-card2' ) ) ) {
				$attributes['metaColor'] = $accent_color;
			}
		}

		$attributes['categoryColor'] = '';
		if ( ! empty( $accent_color ) ) {
			if ( in_array( $design, array( 'portfolio', 'portfolio2', 'horizontal-card', 'image-card' ) ) ) {
				$attributes['categoryColor'] = $accent_color;
			}
		}

		$attributes['showImage'] = ! empty( $attributes['displayFeaturedImage'] ) ? $attributes['displayFeaturedImage'] : '';
		$attributes['showTitle'] = ! empty( $attributes['displayTitle'] ) ? $attributes['displayTitle'] : '';
		$attributes['showDate'] = ! empty( $attributes['displayDate'] ) ? $attributes['displayDate'] : '';
		$attributes['showCategory'] = ! empty( $attributes['displayCategory'] ) ? $attributes['displayCategory'] : '';
		$attributes['showComments'] = ! empty( $attributes['displayComments'] ) ? $attributes['displayComments'] : '';
		$attributes['showAuthor'] = ! empty( $attributes['displayAuthor'] ) ? $attributes['displayAuthor'] : '';
		$attributes['showExcerpt'] = ! empty( $attributes['displayExcerpt'] ) ? $attributes['displayExcerpt'] : '';
		$attributes['showReadmore'] = ! empty( $attributes['displayReadMoreLink'] ) ? $attributes['displayReadMoreLink'] : '';
		$attributes['readmoreText'] = ! empty( $attributes['readMoreText'] ) ? $attributes['readMoreText'] : '';

		// Update the custom CSS since the structure has changed.
		$css = $attributes['customCSS'];
		$css = preg_replace( '/\.ugb-blog-posts__category-list/i', '.ugb-blog-posts__category', $css );
		$css = preg_replace( '/\.ugb-blog-posts__read_more/i', '.ugb-blog-posts__readmore', $css );
		$css = preg_replace( '/\.ugb-blog-posts__side/i', '.ugb-blog-posts__content', $css );
		$attributes['customCSS'] = $css;

		$css = $attributes['customCSSCompiled'];
		$css = preg_replace( '/\.ugb-blog-posts__category-list/i', '.ugb-blog-posts__category', $css );
		$css = preg_replace( '/\.ugb-blog-posts__read_more/i', '.ugb-blog-posts__readmore', $css );
		$css = preg_replace( '/\.ugb-blog-posts__side/i', '.ugb-blog-posts__content', $css );
		$attributes['customCSSCompiled'] = $css;

		return $attributes;
	}
	add_filter( 'stackable_block_migrate_attributes', 'stackable_block_blog_posts_migrate_attributes', 10, 2 );
}
