<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_load_accordion_frontend_script' ) ) {
	function stackable_load_accordion_frontend_script() {
		if ( ! is_admin() ) {
			wp_enqueue_script(
				'stk-frontend-accordion',
				plugins_url( 'dist/frontend_block_accordion.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION
			);
		}
	}
	add_action( 'stackable/accordion/enqueue_scripts', 'stackable_load_accordion_frontend_script' );
}

if ( ! function_exists( 'stackable_load_accordion_frontend_polyfill_script' ) ) {
	require_once( ABSPATH . 'wp-admin/includes/dashboard.php' );
	/**
	 * Adds polyfill for summary/details element that are * used in accordion blocks.
	 *
	 * TODO: confirm that this works on older browsers
	 */
	function stackable_load_accordion_frontend_polyfill_script() {

		$browser_version = wp_check_browser_version();

		if ( is_array( $browser_version ) ) {
			$name = $browser_version['name'];
			$version = intval( $browser_version['version'] );

			if (
				( 'Edge'   === $name && $version < 79 ) ||
				( 'Chrome' === $name && $version < 49 ) ||
				( 'Safari' === $name && $version < 6  )
			) {
				wp_enqueue_script(
					'stk-frontend-accordion-polyfill',
					plugins_url( 'dist/frontend_block_accordion_polyfill.js', STACKABLE_FILE ),
					array(),
					STACKABLE_VERSION
				);
			}
		}
	}
	add_action( 'wp_footer', 'stackable_load_accordion_frontend_polyfill_script' );
}
