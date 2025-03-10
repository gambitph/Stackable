<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Admin_Settings_V2' ) ) {

	/**
	 * Stackable Global Settings
	 */
    class Stackable_Admin_Settings_V2 {

		/**
		 * Initialize
		 */
        function __construct() {
			if ( has_stackable_v2_frontend_compatibility() || has_stackable_v2_editor_compatibility() ) {
				add_action( 'stackable_settings_admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
			}
		}

		public function admin_enqueue_scripts() {
			wp_enqueue_script( 'stackable-welcome-v2', plugins_url( 'dist/deprecated/admin_welcome_v2.js', STACKABLE_FILE ), array( 'stackable-welcome', 'wp-i18n', 'wp-element', 'wp-hooks', 'wp-util', 'wp-components', 'wp-api', 'wp-editor' ) );
		}
	}

	new Stackable_Admin_Settings_V2();
}
