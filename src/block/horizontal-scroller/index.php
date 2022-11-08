<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_load_horizontalscroller_frontend_script' ) ) {
	function stackable_load_horizontalscroller_frontend_script() {
		if ( ! is_admin() ) {
			wp_enqueue_script(
				'stk-frontend-horizontal-scroller',
				plugins_url( 'dist/frontend_block_horizontal_scroller.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION,
				true
			);
		}
	}
	add_action( 'stackable/horizontal-scroller/enqueue_scripts', 'stackable_load_horizontalscroller_frontend_script' );
}
