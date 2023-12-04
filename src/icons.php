<?php
/**
 * Loads the Font Awesome Kit
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Icons' ) ) {

	/**
	 * Stackable Icons
	 */
    class Stackable_Icons {

		/**
		 * Initialize
		 */
        function __construct() {
			add_action( 'admin_init', array( $this, 'register_icon_settings' ) );
			add_action( 'rest_api_init', array( $this, 'register_icon_settings' ) );

			// Make our settings available in the editor.
			add_action( 'stackable_localize_script', array( $this, 'add_settings' ) );
		}

		/**
		 * Register the setting to select FontAwesome version
		 *
		 * @return void
		 */
		public function register_icon_settings() {
			register_setting(
				'stackable_icons',
				'stackable_icons_fa_free_version',
				array(
					'type' => 'string',
					'description' => __( 'Select FontAwesome version', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);
		}

		/**
		 * Add the JS variables needed by our icon settings.
		 *
		 * @param array $args
		 * @return array
		 */
		public function add_settings( $args ) {
			return array_merge( $args, array(
				'iconsFaFreeKitVersion' => get_option( 'stackable_icons_fa_free_version' ),
			) );
			return $args;
		}
	}

	new Stackable_Icons();
}
