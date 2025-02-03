<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_blocksy_parse_field_data_current_post_id' ) ) {
	// When using Blocksy Content Blocks, sometimes the get_the_ID() returns 0.
	function stackable_blocksy_parse_field_data_current_post_id( $post_id, $field_data, $route ) {
		if ( class_exists( 'Blocksy_Translations_Manager' ) && $post_id == 0 ) {
			$post_id = get_queried_object_id();
		}
		return $post_id;
	}

	add_filter( 'stackable_dynamic_content/parse_field_data/current_post_id', 'stackable_blocksy_parse_field_data_current_post_id', 10, 3 );
}
