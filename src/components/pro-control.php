<?php
/**
 * This is in charge of enabling/disbling the show Go Premium notices in the editor.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_get_show_pro_notice' ) ) {

	/**
	 * Gets whether the Go Premium notices are set to show or hide.
	 * If the option is not yet set (e.g. new install), this is considered "show".
	 *
	 * @return Array
	 */
	function stackable_get_show_pro_notice() {
		$show_pro_notice = get_option( 'stackable_show_pro_notice' );
		if ( $show_pro_notice === false ) {
			return true;
		}
		return $show_pro_notice === '1';
	}
}

if ( ! function_exists( 'stackable_ajax_update_show_pro_notice' ) ) {

	/**
	 * Ajax handler for saving the setting for the Go Premium show/hide notices.
	 */
	function stackable_ajax_update_show_pro_notice() {
		$nonce = isset( $_POST['nonce'] ) ? sanitize_key( $_POST['nonce'] ) : '';

		if ( ! wp_verify_nonce( $nonce, 'stackable_show_pro_notice' ) ) {
			wp_send_json_error( __( 'Security error, please refresh the page and try again.', 'stackable' ) );
		}

		$checked_show_notices = isset( $_POST['checked'] ) ? $_POST['checked'] === 'true' : false;
		update_option( 'stackable_show_pro_notice', $checked_show_notices ? '1' : '0' );
		wp_send_json_success();
	}
	add_action( 'wp_ajax_stackable_update_show_pro_notice', 'stackable_ajax_update_show_pro_notice' );
}

if ( ! function_exists( 'stackable_get_pro_notice_nonce' ) ) {

	/**
	 * Create a nonce for show/hide Go Premium notice.
	 *
	 * @return String
	 */
	function stackable_get_pro_notice_nonce() {
		return wp_create_nonce( 'stackable_show_pro_notice' );
	}
}
