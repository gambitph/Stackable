<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_load_carousel_frontend_script' ) ) {
	function stackable_load_carousel_frontend_script() {
		if ( ! is_admin() ) {
			wp_enqueue_script(
				'stk-frontend-carousel',
				plugins_url( 'dist/frontend_block_carousel.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION,
				true
			);
		}
	}
	add_action( 'stackable/carousel/enqueue_scripts', 'stackable_load_carousel_frontend_script' );
}
