<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_load_map_frontend_script' ) ) {
	function stackable_load_map_frontend_script() {
		if ( ! is_admin() ) {
			wp_enqueue_script(
				'stk-frontend-map',
				plugins_url( 'dist/frontend_block_map.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION,
				true
			);
			wp_localize_script( 'stk-frontend-map', 'stackableMapVars', array(
				'googleApiKey' => get_option( 'stackable_google_maps_api_key', '' ),
				'labelMissingMapApiKey' =>  __( 'This map block uses settings that require a Google Maps API key, but it is missing. Please enter your Google Maps API key in the Stackable settings, or edit this map block.', STACKABLE_I18N ),
			) );
		}
	}
	add_action( 'stackable/map/enqueue_scripts', 'stackable_load_map_frontend_script' );
}
