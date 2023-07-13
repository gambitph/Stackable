<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_load_tabs_frontend_script' ) ) {
	function stackable_load_tabs_frontend_script() {
		if ( ! is_admin() ) {
			wp_enqueue_script(
				'stk-frontend-tabs',
				plugins_url( 'dist/frontend_block_tabs.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION,
				true
			);
		}
	}
	add_action( 'stackable/tabs/enqueue_scripts', 'stackable_load_tabs_frontend_script' );
}
