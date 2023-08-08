<?php
/**
 * In charge of loading the frontend polyfill for alignment :has() selector
 * support
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_load_alignment_frontend_polyfill_script' ) ) {
	function stackable_load_alignment_frontend_polyfill_script() {

		$user_agent = ! empty( $_SERVER['HTTP_USER_AGENT'] ) ? $_SERVER['HTTP_USER_AGENT'] : '';

		if ( ! $user_agent ) {
			return;
		}

		$load_polyfill = false;

		// Safari <= 15.3
		if ( stripos( $user_agent, 'Version/' ) !== false && stripos( $user_agent, 'Safari/' ) !== false ) {
			$start = stripos( $user_agent, 'Version/' ) + 8;
			$end = strpos( $user_agent, ' ', $start );
			$safari_version = substr( $user_agent, $start, $end - $start );

			// Convert version string to an array of parts
			$version_parts = explode( '.', $safari_version );

			if (
				// Safari < 15
				( isset( $version_parts[ 0 ] ) && intval( $version_parts[ 0 ] ) < 15 ) ||
				// Safari <= 15.3
				( isset( $version_parts[ 0 ] ) && intval( $version_parts[ 0 ] ) == 15 &&
					(
						( isset( $version_parts[ 1 ] ) && intval( $version_parts[ 1 ] ) <= 3 ) ||
						! isset( $version_parts[ 1 ] )
					)
				)
			) {
				$load_polyfill = true;
			}
		} else if ( stripos( $user_agent, 'Firefox/' ) !== false ) {
			$load_polyfill = true;
		}

		if ( $load_polyfill ) {
			wp_enqueue_script(
				'stk-frontend-alginment-has-polyfill',
				plugins_url( 'dist/frontend_block_components_alignment_has_polyfill.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION
			);
		}
	}
	add_action( 'wp_footer', 'stackable_load_alignment_frontend_polyfill_script' );
}
