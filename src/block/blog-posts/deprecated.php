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

		if ( array_key_exists( 'postsToShow', $attributes ) ) {
			$attributes['numberOfItems'] = $attributes['postsToShow'];
		}

		return $attributes;
	}
	add_filter( 'stackable_block_migrate_attributes', 'stackable_block_blog_posts_migrate_attributes', 10, 2 );
}
