<?php
// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Remove commas when the progress value is text field from dynamic content
if ( ! function_exists( 'stackable_progress_value_remove_commas' ) ) {
	function stackable_progress_value_remove_commas( $block_content, $block ) {
		return preg_replace_callback( '/--progress-value:[^%]+%/', function ( $matches ) {
			return str_replace( ',', '', $matches[0] );
		}, $block_content );
	}

	add_filter( 'render_block_stackable/progress-bar', 'stackable_progress_value_remove_commas', 99, 2 );
}
