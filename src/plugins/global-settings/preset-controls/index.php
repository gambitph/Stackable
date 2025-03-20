<?php
/**
 * Size and Spacing Preset Controls
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Size_And_Spacing_Preset_Controls' ) ) {

	/**
	 * Size and Spacing Preset Controls
	 */
    class Stackable_Size_And_Spacing_Preset_Controls {

		public $stackable_presets;
		public $theme_presets;

		/**
		 * Initialize
		 */
  		function __construct() {
			$this->stackable_presets = $this->load_presets( __DIR__ . '/presets.json');
			$this->theme_presets = WP_Theme_JSON_Resolver::get_theme_data()->get_settings();
			// Register our settings.
			// add_action( 'register_stackable_global_settings', array( $this, 'register_preset_controls' ) );

			add_filter( 'stackable_inline_styles_nodep', array( $this, 'add_preset_controls_styles' ) );
			add_filter( 'stackable_inline_editor_styles', array( $this, 'add_preset_controls_styles' ) );
		}

		/**
		 * Register the settings we need for preset controls
		 *
		 * @return void
		 */
		// public function register_preset_controls() {
			
		// }

		public function sanitize_array_setting( $input ) {
			return ! is_array( $input ) ? array( array() ) : $input;
		}

		private function load_presets( $json_path ) {
			if ( file_exists( $json_path ) ) {
				$json_data = file_get_contents( $json_path );
				$decoded_data = json_decode( $json_data, true );
				return $decoded_data[ 'settings' ] ?? [];
			}
			return [];
		}

		// Generate CSS variables based on preset type (e.g., fontSizes, spacing)
		public function generate_css_variables( $presets, $prefix ) {
			$css = "";
			foreach ( $presets as $preset ) {
				$slug = $preset[ 'slug' ];
				$size = $preset[ 'size' ];
				$css .= "--stk--preset--$prefix--$slug: $size;\n";
			}
	
			return $css;
		}

		/**
		 * Add our global preset control styles.
		 *
		 * @param String $current_css
		 * @return String
		 */
		public function add_preset_controls_styles( $current_css ) {
			$presets = $this->stackable_presets;
			
			if ( isset( $this->theme_presets ) ) {
				$presets[ 'spacing' ][ 'spacingSizes' ] = $this->theme_presets[ 'spacing' ][ 'spacingSizes' ][ 'theme' ] ?? $presets[ 'spacing' ][ 'spacingSizes' ];
				$presets[ 'typography' ][ 'fontSizes' ] = $this->theme_presets[ 'typography' ][ 'fontSizes' ][ 'theme' ] ?? $presets[ 'typography' ][ 'fontSizes' ];
			}
	
			$generated_css = ":root {\n";
			$generated_css .= $this->generate_css_variables( $presets[ 'spacing' ][ 'spacingSizes' ], 'spacing-size' );
			$generated_css .= $this->generate_css_variables( $presets[ 'typography' ][ 'fontSizes' ], 'font-size' );
			$generated_css .= "}\n";

			if ( ! $generated_css ) {
				return $current_css;
			}
	
			$current_css .= $generated_css;
			
			return apply_filters( 'stackable_frontend_css' , $current_css );
		}
	}

	new Stackable_Size_And_Spacing_Preset_Controls();
}