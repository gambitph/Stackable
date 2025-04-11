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
				'prefix' => 'spacing',
			),
			'blockHeights' => array(
				'settings' => array( 'blockHeights' ),
				'prefix' => 'block-height',
			),
			'borderRadius' => array(
				'settings' => array( 'borderRadius' ),
				'prefix' => 'border-radius',
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
			add_filter( 'stackable_inline_styles_nodep', array( $this, 'add_preset_controls_styles' ) );
			add_filter( 'stackable_inline_editor_styles', array( $this, 'add_preset_controls_styles' ) );
		}

		public function load_presets() {
			$this->custom_presets = get_option( 'stackable_global_custom_preset_controls' );
			$this->theme_presets = WP_Theme_JSON_Resolver::get_theme_data()->get_settings();
			$this->default_presets = WP_Theme_JSON_Resolver::get_core_data()->get_settings();
			$this->stackable_presets = $this->load_json_file( __DIR__ . '/presets.json');
		}

		public static function sanitize_array_setting( $input ) {
			return ! is_array( $input ) ? array( array() ) : $input;
		}

		private function load_json_file( $json_path ) {
			if ( file_exists( $json_path ) ) {
				$decoded_data = wp_json_file_decode( $json_path, [
					'associative' => true,
				] );
				return $decoded_data[ 'settings' ] ?? [];
			}
			return [];
		}

		/**
		 * Generate CSS variable style defintions based on the property (e.g., fontSizes, spacing).
		 * The given presets will be overriden it match with a preset from custom.
		 * 
		 * @param array $property 
		 * @param array $presets 
		 * @param array $prefix 
		 * @param bool $isTheme
		 * @return mixed
		 */
		public function generate_css_variables_styles( $property, $presets, $prefix, $isTheme = false ) {
			$filter_name =  current_filter();
			$custom_presets = $this->custom_presets[ $property ] ?? [];

			$presets_by_slug = [];
			// Convert presets into an associative array with key 'slug'
			foreach ( $presets as $preset ) {
				$presets_by_slug[ $preset[ 'slug' ] ] = $preset;
			}

			// There is no need to generate custom presets in the editor.
			// The custom presets are generated dynamically.
			if ( $filter_name !== 'stackable_inline_editor_styles' ) {
				// Override values in base presets if it exist in custom presets
				foreach ( $custom_presets as $custom ) {
					$custom[ '__is_custom' ] = true;
					$presets_by_slug[ $custom[ 'slug' ] ] = $custom;
				}
			}

			// Build the CSS variables array.
			// If custom presets or using stackable presets, use the given size.
			// If using theme presets, use WP generated --wp-preset to support theme.json specific
			// configuration (fluid, clamping, etc.)
			$css_vars = [];
			foreach ( $presets_by_slug as $slug => $preset ) {
				$is_custom = $preset['__is_custom'] ?? false;
		
				$value = $is_custom || ! $isTheme
					? $preset['size']
					: "var(--wp--preset--$prefix--$slug)";
		
				$css_vars[ "--stk--preset--$prefix--$slug" ] = $value;
			}
	
			return array(
				'selector' => ':root',
				'declarations' => $css_vars,
			);
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
			$this->load_presets();
			$generated_styles = array();

			foreach ( self::PRESET_MAPPING as $key => $value ) {
				if ( ! empty( $this->deepGet( $this->theme_presets, $value[ 'settings' ] )[ 'theme' ] ) ) {
					$styles = $this->generate_css_variables_styles( 
						$key,
						$this->deepGet( $this->theme_presets, $value[ 'settings' ] )[ 'theme' ], 
						$value[ 'prefix' ],
						true
					);
					$generated_styles[] = $styles;

				} elseif ( ! empty( $this->deepGet( $this->default_presets, $value[ 'settings' ] )[ 'default' ] ) ) {
					$styles = $this->generate_css_variables_styles( 
						$key,
						$this->deepGet( $this->default_presets, $value[ 'settings' ] )[ 'default' ], 
						$value[ 'prefix' ],
						true
					);
					$generated_styles[] = $styles;
				} else {
					$styles = $this->generate_css_variables_styles( 
						$key,
						$this->deepGet( $this->stackable_presets, $value[ 'settings' ] ), 
						$value[ 'prefix' ],
					);
					$generated_styles[] = $styles;
				}
			}

			$generated_css = wp_style_engine_get_stylesheet_from_css_rules( $generated_styles );
			if ( ! $generated_css ) {
				return $current_css;
			}

			$current_css .= "\n/* Global Preset Controls */\n";
			$current_css .= $generated_css;
			
			return apply_filters( 'stackable_frontend_css' , $current_css );
		}
	}

	new Stackable_Size_And_Spacing_Preset_Controls();
}