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
	/**
	 * Adds polyfill for summary/details element that are * used in accordion blocks.
	 *
	 * TODO: confirm that this works on older browsers
	 */
	function stackable_load_accordion_frontend_polyfill_script() {

		$user_agent = ! empty( $_SERVER['HTTP_USER_AGENT'] ) ? $_SERVER['HTTP_USER_AGENT'] : '';

		if ( ! $user_agent ) {
			return;
		}

		$matches = array();

		if ( preg_match( '/(Edge?|Chrome|Safari|Trident)\/(\d+)/', $user_agent, $matches ) ) {
			$name    = $matches[1];
			$version = intval( $matches[2] );
		}

		if ( isset( $name ) && isset( $version ) ) {
			if (
				// Safari 13.1.3
				( stripos( $user_agent, 'Version/13.' ) !== false && stripos( $user_agent, 'Safari/' ) !== false ) ||
				// Adnroid 7.0 Samsung Galaxy J5
				( stripos( $user_agent, 'Android 7.' ) !== false && stripos( $user_agent, 'Chrome/' ) !== false ) ||
				// Edge < 79
				( ( 'Edge' === $name || 'Edg' === $name ) && $version < 79 ) ||
				// Chrome < 49
				( 'Chrome' === $name && $version < 49 ) ||
				// IE 11
				stripos( $user_agent, 'Trident/7.0; rv:11.0' ) !== false
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
