<?php
/**
 * Optimization Settings data handling.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Optimization_Settings' ) ) {

	/**
	 * Stackable Global Settings
	 */
    class Stackable_Optimization_Settings {

		private $is_script_loaded = false;

		/**
		 * Initialize
		 */
        function __construct() {
			// Register our setting.
			add_action( 'init', array( $this, 'register_optimization_settings' ) );

			// Prevent the scripts from loading normally.
			add_action( 'init', array( $this, 'disable_frontend_scripts' ) );

			// Load the scripts only when Stackable blocks are detected.
			add_filter( 'render_block', array( $this, 'load_frontend_scripts_conditionally' ), 10, 2 );
		}

		/**
		 * Register the settings we need for global settings.
		 *
		 * @return void
		 */
		public function register_optimization_settings() {
			register_setting(
				'stackable_optimization_settings',
				'stackable_optimize_script_load',
				array(
					'type' => 'boolean',
					'description' => __( 'Stackable optimization setting, only load scripts when there are Stackable blocks in the page', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);
		}

		/**
		 * If the optimize script load is activated, prevent the normal loading
		 * process of the frontend scripts
		 *
		 * @return void
		 *
		 * @since 2.17.0
		 */
		public function disable_frontend_scripts() {
			if ( get_option( 'stackable_optimize_script_load' ) && ! is_admin() ) {
				remove_action( 'enqueue_block_assets', 'stackable_block_assets' );
			}
		}

		/**
		 * If the optimize script load is activated, detect when blocks are used
		 * and only load the frontend scripts then.
		 *
		 * @param String $block_content
		 * @param Array $block
		 *
		 * @return void
		 *
		 * @since 2.17.0
		 */
		public function load_frontend_scripts_conditionally( $block_content, $block ) {
			if ( ! $this->is_script_loaded ) {
				if ( get_option( 'stackable_optimize_script_load' ) && ! is_admin() ) {
					preg_match( '/<!-- wp:ugb\//', $block_content, $ugb_matches );
					preg_match( '/<!-- wp:stackable\//', $block_content, $stackable_matches );
					if ( 
						count( $ugb_matches ) > 0 ||
						count( $stackable_matches ) > 0
					) {
						stackable_block_assets();
						$this->is_script_loaded = true;
					}
				}
			}

			return $block_content;
		}
	}

	new Stackable_Optimization_Settings();
}
