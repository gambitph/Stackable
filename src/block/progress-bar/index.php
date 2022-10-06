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
