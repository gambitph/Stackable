<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_load_countup_frontend_script' ) ) {
	function stackable_load_countup_frontend_script() {
		if ( ! is_admin() ) {
			wp_enqueue_script(
				'stk-frontend-count-up',
				plugins_url( 'dist/frontend_block_count_up.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION,
				true
			);
		}
	}
	add_action( 'stackable/count-up/enqueue_scripts', 'stackable_load_countup_frontend_script' );
}
