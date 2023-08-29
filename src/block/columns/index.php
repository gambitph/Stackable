<?php
/**
 * In charge of loading the frontend polyfill for columns block :has() selector
 * support
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_load_columns_frontend_polyfill_script' ) ) {
	function stackable_load_columns_frontend_polyfill_script() {

		$user_agent = ! empty( $_SERVER['HTTP_USER_AGENT'] ) ? $_SERVER['HTTP_USER_AGENT'] : '';

		if ( ! $user_agent ) {
			return;
		}

		$load_polyfill = false;
		if ( stripos( $user_agent, 'Firefox/' ) !== false ) {
			$load_polyfill = true;
		}

		if ( $load_polyfill ) {
			wp_enqueue_script(
				'stk-frontend-columns-has-polyfill',
				plugins_url( 'dist/frontend_block_columns_has_polyfill.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION
			);
		}
	}
	add_action( 'stackable/columns/enqueue_scripts', 'stackable_load_columns_frontend_polyfill_script' );
}
