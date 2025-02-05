<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_load_image_optimizer_polyfill_frontend_script' ) ) {
	function stackable_load_image_optimizer_polyfill_frontend_script( $block_content, $block ) {
		// If Easy IO setting is activated for EWWW Image Optimizer, dynamic images becomes blurry.
		// Load the script to fix the issue.
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

	function stackable_ewww_image_optimzer_plugin_checker() {
		if ( ! is_admin() && defined( 'EWWW_IMAGE_OPTIMIZER_PLUGIN_FILE' ) ) {
			// Load the script in the frontend if EWWW Image Optimizer is active.
			add_action( 'stackable/enqueue_scripts', 'stackable_load_image_optimizer_polyfill_frontend_script', 10, 2 );
		}
	}

	// Run the plugin checker after all plugins are loaded because
	// the condition defined( 'EWWW_IMAGE_OPTIMIZER_PLUGIN_FILE' ) may return false
	// even if the plugin is actually activated
	add_action( 'plugins_loaded', 'stackable_ewww_image_optimzer_plugin_checker' );
}
