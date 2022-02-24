<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_load_table_of_contents_frontend_script' ) ) {
	function stackable_load_table_of_contents_frontend_script() {
		if ( ! is_admin() ) {
			wp_enqueue_script(
				'stk-frontend-table-of-contents',
				plugins_url( 'dist/frontend_block_table_of_contents.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION
			);
		}
	}
	add_action( 'stackable/table-of-contents/enqueue_scripts', 'stackable_load_table_of_contents_frontend_script' );
}
