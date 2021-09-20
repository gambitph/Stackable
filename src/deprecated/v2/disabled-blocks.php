<?php
/**
 * This is in charge of enabling/disabling blocks WP-side.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


if ( ! class_exists( 'Stackable_Disabled_Blocks_V2' ) ) {
	class Stackable_Disabled_Blocks_V2 {

		/**
		 * Add our hooks.
		 */
		function __construct() {
			if ( has_stackable_v2_frontend_compatibility() || has_stackable_v2_editor_compatibility() ) {
				// Add variables needed in the editor.
				add_filter( 'stackable_localize_script', array( $this, 'add_disabled_blocks_editor' ) );

				// Add variables needed in the settings page.
				add_filter( 'stackable_localize_settings_script', array( $this, 'add_disabled_blocks_settings' ) );

				// Save settings ajax action handler.
				add_action( 'wp_ajax_stackable_update_disable_blocks_v2', array( $this, 'ajax_update_disable_blocks' ) );
			}
		}

		public function add_disabled_blocks_editor( $args ) {
			$args['v2disabledBlocks'] = $this->get_disabled_blocks();
			return $args;
		}

		public function add_disabled_blocks_settings( $args ) {
			$args['v2disabledBlocks'] = $this->get_disabled_blocks();
			$args['v2nonce'] = $this->get_disabled_blocks_nonce();
			return $args;
		}

		/**
		 * Gets the list of block names of the disabled blocks.
		 *
		 * @return Array
		 */
		public function get_disabled_blocks() {
			$disabled_blocks = get_option( 'stackable_v2_disabled_blocks' );
			if ( false === $disabled_blocks ) {
				$disabled_blocks = array();
			}
			return apply_filters( 'stackable_disabled_blocks', $disabled_blocks );
		}

		/**
		 * Ajax handler for saving the list of disabled blocks.
		 */
		function ajax_update_disable_blocks() {
			$nonce = isset( $_POST['nonce'] ) ? sanitize_key( $_POST['nonce'] ) : '';

			if ( ! wp_verify_nonce( $nonce, 'stackable_disable_blocks' ) ) {
				wp_send_json_error( __( 'Security error, please refresh the page and try again.', STACKABLE_I18N ) );
			}

			$disabled_blocks = isset( $_POST['disabledBlocks'] ) ? $_POST['disabledBlocks'] : array();
			update_option( 'stackable_v2_disabled_blocks', $disabled_blocks );
			wp_send_json_success();
		}

		/**
		 * Create a nonce for disabling blocks.
		 *
		 * @return String
		 */
		function get_disabled_blocks_nonce() {
			return wp_create_nonce( 'stackable_disable_blocks' );
		}
	}

	new Stackable_Disabled_Blocks_V2();
}
