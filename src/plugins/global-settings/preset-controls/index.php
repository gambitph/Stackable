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

		public $theme_presets;
		public $default_presets;
		public $stackable_presets;

		/**
		 * Initialize
		 */
  		function __construct() {
			$this->theme_presets = WP_Theme_JSON_Resolver::get_theme_data()->get_settings();
			$this->default_presets = WP_Theme_JSON_Resolver::get_core_data()->get_settings();
			$this->stackable_presets = $this->load_presets( __DIR__ . '/presets.json');

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

		/**
		 * Generate CSS variables based on preset type (e.g., fontSizes, spacing)
		 *
		 * @param array $presests 
		 * @param array $prefix 
		 * @return mixed
		 */
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
		 * Get the value from an array deeply with an array of keys
		 *
		 * @param array $array 
		 * @param array $keys 
		 * @return mixed
		 */
		public function deepGet( $array, $keys ) {
			return array_reduce( $keys, fn( $value, $key ) => $value[ $key ] ?? null, $array );
		}

		/**
		 * Add our global preset control styles.
		 *
		 * @param String $current_css
		 * @return String
		 */
		public function add_preset_controls_styles( $current_css ) {
			$preset_keys = array(
				'spacing-size' => array( 'spacing', 'spacingSizes' ),
				'font-size' => array( 'typography', 'fontSizes' ),
			);

			$generated_css = ":root {\n";

			foreach ( $preset_keys as $key => $value ) {
				if ( ! empty( $this->deepGet( $this->theme_presets, $value )[ 'theme' ] ) ) {
					$generated_css .= $this->generate_css_variables( 
						$this->deepGet( $this->theme_presets, $value )[ 'theme' ], 
						$key,
					);
				} elseif ( ! empty( $this->deepGet( $this->default_presets, $value )[ 'default' ] ) ) {
					$generated_css .= $this->generate_css_variables( 
						$this->deepGet( $this->default_presets, $value )[ 'default' ], 
						$key,
					);
				} else {
					$generated_css .= $this->generate_css_variables( 
						$this->deepGet( $this->stackable_presets, $value ), 
						$key,
					);
				}
			}

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