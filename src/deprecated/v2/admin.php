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

				// Add the optimization setting.
				add_action( 'stackable_settings_page_mid', array( $this, 'add_optimization_settings' ), 11 );
			}
		}

		public function admin_enqueue_scripts() {
			wp_enqueue_script( 'stackable-welcome-v2', plugins_url( 'dist/deprecated/admin_welcome_v2.js', STACKABLE_FILE ), array( 'stackable-welcome', 'wp-i18n', 'wp-element', 'wp-hooks', 'wp-util', 'wp-components', 'wp-api', 'wp-editor' ) );
		}

		/**
		 * Add optimization setting if v2 is supported
		 *
		 * @return void
		 */
		public function add_optimization_settings() {
			?>
			<article class="s-box" id="block-settings-v2">
				<h2><?php _e( '🎛 Enable & Disable Blocks', STACKABLE_I18N ) ?> (V2)</h2>
				<strong><?php _e( 'This only works for version 2 blocks.' , STACKABLE_I18N ) ?></strong>
				<!-- We put all the block controls here. -->
				<div class="s-settings-wrapper-v2" />
			</article>
			<style>
				.s-tag-v2 {
					color: #777;
					font-size: 0.9em;
				}
			</style>
			<?php
		}
	}

	new Stackable_Admin_Settings_V2();
}
