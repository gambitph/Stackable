<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_load_image_optimizer_polyfill_frontend_script' ) ) {
	function stackable_load_image_optimizer_polyfill_frontend_script( $block_content, $block ) {
		if ( ! is_admin() ) {
			wp_enqueue_script(
				'stk-frontend-image-optimizer-polyfill',
				plugins_url( 'dist/frontend_image_optimizer_polyfill.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION,
				true
			);

			// Only do this once.
			remove_action( 'stackable/enqueue_scripts', 'stackable_load_image_optimizer_polyfill_frontend_script', 10 );
		}
	}

	if ( ! is_admin() ) {
		add_action( 'stackable/enqueue_scripts', 'stackable_load_image_optimizer_polyfill_frontend_script', 10, 2 );
	}
}
