<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_neve_get_dynamic_content_id' ) ) {
	function stackable_neve_get_dynamic_content_id( $post_id, $args, $field_data, $is_editor_content = false, $context = null ) {
		if ( isset( $context ) && isset( $context[ 'postId' ] ) && $args['source'] === 'current-page' ) {
			if ( isset( $context[ 'postType' ] ) && $context['postType'] === 'neve_custom_layouts' ) {
				$post_id = get_the_ID();
			}
		}
		return $post_id;
	}
	add_filter( 'stackable_dynamic_content/get_dynamic_content/id', 'stackable_neve_get_dynamic_content_id', 10, 5 );
}

if ( ! function_exists( 'stackable_neve_parse_field_data_current_post_id' ) ) {
	function stackable_neve_parse_field_data_current_post_id( $post_id, $field_data, $route ) {
		$post_type = get_post_type();
		if ( $post_type === 'neve_custom_layouts' ) {
			wp_reset_postdata();
			$post_id = get_the_ID();
		}
		return $post_id;
	}
	add_filter( 'stackable_dynamic_content/parse_field_data/current_post_id', 'stackable_neve_parse_field_data_current_post_id', 10, 3 );
}
