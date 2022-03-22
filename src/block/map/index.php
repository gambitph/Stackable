<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_load_map_frontend_script' ) ) {
	function stackable_load_map_frontend_script() {
		$apiKey = get_option( 'stackable_google_maps_api_key' );
		if ( ! is_admin() && $apiKey ) {
			wp_enqueue_script(
				'stk-frontend-map',
				plugins_url( 'dist/frontend_block_map.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION
			);
		}
	}
	add_action( 'stackable/map/enqueue_scripts', 'stackable_load_map_frontend_script' );
}
