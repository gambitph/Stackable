<?php
/**
 * Optimization Settings data handling.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Optimization_Settings_V2' ) ) {

	/**
	 * Stackable Global Settings
	 */
    class Stackable_Optimization_Settings_V2 {

		private $is_script_loaded = false;

		/**
		 * Initialize
		 */
        function __construct() {
			if ( has_stackable_v2_frontend_compatibility() || has_stackable_v2_editor_compatibility() ) {
				// Register our setting.
				add_action( 'admin_init', array( $this, 'register_optimization_settings' ) );
				add_action( 'rest_api_init', array( $this, 'register_optimization_settings' ) );

				// Prevent the scripts from loading normally. Low priority so we can remove the assets.
				add_action( 'init', array( $this, 'disable_frontend_scripts' ), 9 );

				// Load the scripts only when Stackable blocks are detected.
				add_filter( 'render_block', array( $this, 'load_frontend_scripts_conditionally' ), 10, 2 );

				// Add the optimization setting.
				add_action( 'stackable_settings_page_mid', array( $this, 'add_optimization_settings' ) );
			}
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
				remove_action( 'init', 'stackable_block_assets_v2' );
				remove_action( 'enqueue_block_assets', 'stackable_add_required_block_styles_v2' );
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
			if ( $block_content === null ) {
				return $block_content;
			}

			if ( ! $this->is_script_loaded ) {
				if ( get_option( 'stackable_optimize_script_load' ) && ! is_admin() ) {
					$block_name = isset( $block['blockName'] ) ? $block['blockName'] : '';
					if (
						stripos( $block_name, 'ugb/' ) === 0 ||
						stripos( $block_content, '<!-- wp:ugb/' ) !==  false ||
						stripos( $block_content, 'ugb-highlight' ) !==  false
					) {
						stackable_block_enqueue_frontend_assets_v2();
						stackable_add_required_block_styles_v2();
						$this->is_script_loaded = true;
					}
				}
			}

			return $block_content;
		}

		/**
		 * Add optimization setting if v2 is supported
		 *
		 * @return void
		 */
		public function add_optimization_settings() {
			?>
			<article class="s-box" id="optimization-settings">
				<h2><?php _e( '🏃‍♂️ Optimization Settings', STACKABLE_I18N ) ?> (V2)</h2>
				<p class="s-settings-subtitle">
					<?php printf( __( 'Here are some settings that you can tweak to optimize Stackable. %sLearn more%s.' , STACKABLE_I18N ), '<a href="https://docs.wpstackable.com/article/460-how-to-use-optimization-settings?utm_source=wp-settings-global-settings&utm_campaign=learnmore&utm_medium=wp-dashboard" target="_docs">', '</a>' ) ?>
					<br />
					<strong><?php _e( 'This only works for version 2 blocks.' , STACKABLE_I18N ) ?></strong>
				</p>
				<div class="s-optimization-settings"></div>
			</article>
			<?php
		}
	}

	new Stackable_Optimization_Settings_V2();
}
