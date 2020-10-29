<?php
/**
 * Loads the Font Awesome Premium Integration
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Settings_Icons' ) ) {

	/**
	 * Premium icon settings page.
	 */
    class Stackable_Settings_Icons {

		/**
		 * Initialize
		 */
        function __construct() {
			// Register our settings.
			add_action( 'init', array( $this, 'register_icon_settings' ) );

			// Change our Font Awesome settings class.
			add_filter( 'stackable_fa_settings_class', array( $this, 'add_fa_settings_class' ) );

			// Add our settings JS variables.
			add_action( 'stackable_localize_settings_script', array( $this, 'localize_settings' ) );
		}

		/**
		 * Add the JS variables needed by our icon settings.
		 *
		 * @param array $args
		 * @return array
		 */
		public function localize_settings( $args ) {
			return array_merge( $args, array(
				'iconsIsFAPluginActive' => Stackable_Premium_Icons::is_fontawesome_plugin_active(),
				'iconsIsFAProEnabled' => Stackable_Premium_Icons::is_fontawesome_plugin_pro_enabled(),
				'iconsFAProError' => Stackable_Premium_Icons::has_fontawesome_plugin_pro(),
				'iconsFaKit' => get_option( 'stackable_icons_fa_kit' ),
			) );
			return $args;
		}

		/**
		 * Register the settings we need to load icons
		 *
		 * @return void
		 */
		public function register_icon_settings() {
			register_setting(
				'stackable_icons',
				'stackable_icons_dont_show_fa_error',
				array(
					'type' => 'string',
					'description' => __( 'Don\'t show Font Awesome plugin settings error', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);

			register_setting(
				'stackable_icons',
				'stackable_icons_fa_kit',
				array(
					'type' => 'string',
					'description' => __( 'Font Awesome Kit ID', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);

			register_setting(
				'stackable_icons',
				'stackable_icons_fa_version',
				array(
					'type' => 'string',
					'description' => __( 'Font Awesome icon version to server', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);
		}

		public function add_fa_settings_class( $class_name ) {
			return Stackable_Icons::is_fontawesome_plugin_active() ? 's-icon-field--hide' : '';
		}
	}

	new Stackable_Settings_Icons();
}
