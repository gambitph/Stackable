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
		public const PRESET_MAPPING = array(
			'fontSizes' => array(
				'settings' => array('typography', 'fontSizes' ),
				'prefix' => 'font-size',
			),
			'spacingSizes' => array(
				'settings' => array( 'spacing', 'spacingSizes' ),
				'prefix' => 'spacing-size',
			),
		);

		public $custom_presets;
		public $theme_presets;
		public $default_presets;
		public $stackable_presets;

		/**
		 * Initialize
		 */
  		function __construct() {
			$this->custom_presets = get_option( 'stackable_global_custom_preset_controls' );
			$this->theme_presets = WP_Theme_JSON_Resolver::get_theme_data()->get_settings();
			$this->default_presets = WP_Theme_JSON_Resolver::get_core_data()->get_settings();
			$this->stackable_presets = $this->load_presets( __DIR__ . '/presets.json');

			add_filter( 'stackable_inline_styles_nodep', array( $this, 'add_preset_controls_styles' ) );
			add_filter( 'stackable_inline_editor_styles', array( $this, 'add_preset_controls_styles' ) );
		}

		public static function sanitize_array_setting( $input ) {
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
		 * Generate CSS variables based on the property (e.g., fontSizes, spacing).
		 * The given presets will be overriden it match with a preset from custom.
		 * 
		 * @param array $property 
		 * @param array $presets 
		 * @param array $prefix 
		 * @return mixed
		 */
		public function generate_css_variables( $property, $presets, $prefix ) {
			$custom_presets = $this->custom_presets[ $property ] ?? [];
			
			$css = "";

			// Convert presets into an associative array with key 'slug'
			$presets_by_slug = [];
			foreach ( $presets as $preset ) {
				$presets_by_slug[ $preset[ 'slug' ] ] = $preset;
			}
			// Override values in base presets if it exist in custom presets
			foreach ( $custom_presets as $custom ) {
				$presets_by_slug[ $custom[ 'slug' ] ] = $custom;
			}
			
			foreach ( $presets_by_slug as $preset ) {
				$slug = $preset[ 'slug' ];
				$size = $preset[ 'size' ];
				$css .= "--stk--preset--$prefix--{$preset['slug']}: {$preset['size']};\n";
			}
	
			return $css;
		}

		/**
		 * Get the value from an array with an array of keys
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
			$generated_css = "\n/* Global Preset Controls */\n";
			$generated_css .= ":root {\n";

			foreach ( self::PRESET_MAPPING as $key => $value ) {
				if ( ! empty( $this->deepGet( $this->theme_presets, $value[ 'settings' ] )[ 'theme' ] ) ) {
					$generated_css .= $this->generate_css_variables( 
						$key,
						$this->deepGet( $this->theme_presets, $value[ 'settings' ] )[ 'theme' ], 
						$value[ 'prefix' ],
					);
				} elseif ( ! empty( $this->deepGet( $this->default_presets, $value[ 'settings' ] )[ 'default' ] ) ) {
					$generated_css .= $this->generate_css_variables( 
						$key,
						$this->deepGet( $this->default_presets, $value[ 'settings' ] )[ 'default' ], 
						$value[ 'prefix' ],
					);
				} else {
					$generated_css .= $this->generate_css_variables( 
						$key,
						$this->deepGet( $this->stackable_presets, $value[ 'settings' ] ), 
						$value[ 'prefix' ],
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