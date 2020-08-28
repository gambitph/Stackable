<?php
/**
 * Global Settings data handling.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Global_Settings' ) ) {

	/**
	 * Stackable Global Settings
	 */
    class Stackable_Global_Settings {

		/**
		 * Initialize
		 */
        function __construct() {
			// Register our settings.
			add_action( 'init', array( $this, 'register_global_settings' ) );
		}

		/**
		 * Register the settings we need for global settings.
		 *
		 * @return void
		 */
		public function register_global_settings() {
			register_setting(
				'stackable_global_settings',
				'stackable_global_colors',
				array(
					'type' => 'array',
					'description' => __( 'Stackable global color palette', STACKABLE_I18N ),
					'sanitize_callback' => array( $this, 'sanitize_array_setting' ),
					'show_in_rest' => array(
						'type' => 'array',
						'items' => array(
							'type' => 'object',
							'properties' => array(
								'name' => array(
									'type' => 'string',
								),
								'slug' => array(
									'type' => 'string',
								),
								'colorVar' => array(
									'type' => 'string',
								),
								'color' => array(
									'type' => 'string',
								),
								'fallback' => array(
									'type' => 'string',
								),
							)
						)
					),
					'default' => '',
				)
			);

			register_setting(
				'stackable_global_settings',
				'stackable_global_typography',
				array(
					'type' => 'string',
					'description' => __( 'Stackable global typography settings', STACKABLE_I18N ),
					'sanitize_callback' => array( $this, 'sanitize_array_setting' ),
					'show_in_rest' => array(
						'schema' => array(
							'type'  => 'array',
							'items' => array(
								'type'  => 'array',
								'items' => array(
									'type' => 'string',
								),
							),
						),
					),
					'default' => '',
				)
			);
		}

		public function sanitize_array_setting( $input ) {
			return ! is_array( $input ) ? array( array() ) : $input;
		}
	}

	new Stackable_Global_Settings();
}
