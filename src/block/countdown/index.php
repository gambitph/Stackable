<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_load_countdown_frontend_script' ) ) {
	function stackable_load_countdown_frontend_script() {
		if ( ! is_admin() ) {
			wp_enqueue_script(
				'stk-frontend-countdown',
				plugins_url( 'dist/frontend_block_countdown.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION,
				true
			);
		}
	}
	add_action( 'stackable/countdown/enqueue_scripts', 'stackable_load_countdown_frontend_script' );
}
