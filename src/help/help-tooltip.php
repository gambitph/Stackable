<?php
/**
 * Help Tooltip settings.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Help_Tooltip' ) ) {
	class Stackable_Help_Tooltip {

		/**
		 * Constructor
		 */
		public function __construct() {
			add_action( 'init', array( $this, 'register_settings' ) );
		}

		public function register_settings() {
			register_setting(
				'stackable_help_tooltip_disabled',
				'stackable_help_tooltip_disabled',
				array(
					'type' => 'string',
					'description' => __( 'Disable Stackable help video tooltips', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);
		}
	}

	new Stackable_Help_Tooltip();
}
