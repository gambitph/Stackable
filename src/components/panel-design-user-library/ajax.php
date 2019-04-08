<?php
/**
 * Ajax handlers for the user design library.
 */

if ( ! function_exists( 'stackable_update_user_designs_library' ) ) {

	/**
	 * Updates the user designs of a block.
	 */
	function stackable_update_user_designs_library() {
		$nonce = isset( $_POST['nonce'] ) ? sanitize_key( $_POST['nonce'] ) : '';

		if ( ! wp_verify_nonce( $nonce, 'stackable' ) ) {
			wp_send_json_error( __( 'Security error, please refresh the page and try again.', 'stackable' ) );
		}

		$designs = isset( $_POST['designs'] ) ? $_POST['designs'] : array();
		$block = isset( $_POST['block'] ) ? $_POST['block'] : '';

		if ( empty( $block ) ) {
			wp_send_json_error( __( 'Invalid arguments.', 'stackable' ) );
		}

		update_option( 'stackable_saved_designs_' . $block, json_decode( stripslashes( $designs ) ) );
		wp_send_json_success();
	}

	add_action( 'wp_ajax_stackable_update_user_designs_library', 'stackable_update_user_designs_library' );
}

if ( ! function_exists( 'stackable_get_user_designs_library' ) ) {

	/**
	 * Gets all the saved designs of a block.
	 */
	function stackable_get_user_designs_library() {
		$nonce = isset( $_POST['nonce'] ) ? sanitize_key( $_POST['nonce'] ) : '';

		if ( ! wp_verify_nonce( $nonce, 'stackable' ) ) {
			wp_send_json_error( __( 'Security error, please refresh the page and try again.', 'stackable' ) );
		}

		$block = isset( $_POST['block'] ) ? $_POST['block'] : '';

		if ( empty( $block ) ) {
			wp_send_json_error( __( 'Invalid arguments.', 'stackable' ) );
		}

		$designs = get_option( 'stackable_saved_designs_' . $block );
		if ( empty( $designs ) ) {
			$designs = array();
		}

		wp_send_json_success( json_encode( $designs ) );
	}

	add_action( 'wp_ajax_stackable_get_user_designs_library', 'stackable_get_user_designs_library' );
}
