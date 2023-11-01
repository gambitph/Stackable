<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_load_progressbar_frontend_script' ) ) {
	function stackable_load_progressbar_frontend_script() {
		if ( ! is_admin() ) {
			wp_enqueue_script(
				'stk-frontend-progress-bar',
				plugins_url( 'dist/frontend_block_progress_bar.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION,
				true
			);
		}
	}
	add_action( 'stackable/progress-bar/enqueue_scripts', 'stackable_load_progressbar_frontend_script' );
}

// Remove commas when the progress value is text field from dynamic content
if ( ! function_exists( 'stackable_progress_bar_value_remove_commas' ) ) {
	function stackable_progress_bar_value_remove_commas( $block_content, $block ) {
		if ( empty( $block_content ) ) {
			return $block_content;
		}

		if ( stripos( $block_content, ',' ) === false ) {
			return $block_content;
		}

		return preg_replace_callback( '/--progress-value:[^%;\}]+/', function ( $matches ) {
			return str_replace( ',', '', $matches[0] );
		}, $block_content );
	}

	add_filter( 'render_block_stackable/progress-bar', 'stackable_progress_bar_value_remove_commas', 99, 2 );
}
