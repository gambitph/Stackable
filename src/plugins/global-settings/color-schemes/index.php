<?php
/**
 * Global Color Schemes
 */

use function PHPSTORM_META\map;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Global_Color_Schemes' ) ) {

	/**
	 * Stackable Global Color Schemes
	 */
    class Stackable_Global_Color_Schemes {

		public $block_background_schemes = array(); // List of non-default background color schemes used by blocks.

		public $block_container_schemes = array(); // List of non-default container color schemes used by blocks.

		public $color_schemes = array(); // List of all color schemes

		/**
		 * Initialize
		 */

  		function __construct() {
			// Register our settings.
			add_action( 'register_stackable_global_settings', array( $this, 'register_color_schemes' ) );
			if ( is_frontend() ) {

				/**
				 * Global Color Schemes hooks
				 */
				// Add the Global Color Schemes styles in the frontend only.
				add_filter( 'stackable_inline_styles_nodep', array( $this, 'add_global_color_schemes_styles' ) );

				// Add render_block filter to get the non-default background and container color schemes used by our blocks.
				add_filter( 'render_block', array( $this, 'get_block_schemes' ), 1, 2 );
			}
		}

		/**
		 * Register the settings we need for global color schemes.
		 *
		 * @return void
		 */
		public function register_color_schemes() {
			$string_properties = Stackable_Global_Settings::get_string_properties();

			register_setting(
				'stackable_global_settings',
				'stackable_global_color_schemes',
				array(
					'type' => 'array',
					'description' => __( 'Stackable Global Color Schemes', STACKABLE_I18N ),
					'sanitize_callback' => array( $this, 'sanitize_array_setting' ),
					'show_in_rest' => array(
						'schema' => array(
							'items' => array(
								'type'=>'object',
								'properties'=> array(
									'name' => array( 'type' => 'string' ),
									'key' => array( 'type' => 'string' ),
									'colorScheme' => array(
										'type' => 'object',
										'properties' => Stackable_Global_Color_Schemes::get_color_scheme_properties( $string_properties )
									),
								)
							)
						)
					),
					'default' => '',
				)
			);

			register_setting(
				'stackable_global_settings',
				'stackable_global_hide_color_scheme_colors',
				array(
					'type' => 'boolean',
					'description' => __( 'Hide color scheme colors in the Stackable color picker', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);

			register_setting(
				'stackable_global_settings',
				'stackable_global_base_color_scheme',
				array(
					'type' => 'string',
					'description' => __( 'Stackable Global Base Color Scheme', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);

			register_setting(
				'stackable_global_settings',
				'stackable_global_background_mode_color_scheme',
				array(
					'type' => 'string',
					'description' => __( 'Stackable Global Background Mode Color Scheme', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);

			register_setting(
				'stackable_global_settings',
				'stackable_global_container_mode_color_scheme',
				array(
					'type' => 'string',
					'description' => __( 'Stackable Global Container Mode Color Scheme', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);
		}

		public static function sanitize_array_setting( $input ) {
			return ! is_array( $input ) ? array( array() ) : $input;
		}

		/**
		 * Get the Color Scheme Properties/Settings
		 *
		 * @param 	any $values
		 * if $values is null, return an array. Otherwise, return an associative array
		 * where the keys are the Color Scheme properties and the values are $values.
		 *
		 * Note: All keys will have the value $values.
		 * ( E.g., if $values = array('desktop' => ''), then
		 *  properties[ 'backgroundColor' ] = array('desktop' => '' ),
		 *  properties[ 'headingColor' ] = array('desktop' => '' ),
		 *  etc. )
		 *
		 * @return 	Array
		 */
		public static function get_color_scheme_properties( $values = null ) {
			$properties = [
				'backgroundColor',
				'headingColor',
				'textColor',
				'linkColor',
				'accentColor',
				'buttonBackgroundColor',
				'buttonTextColor',
				'buttonOutlineColor'
			];

			if ( $values == null ) {
				return $properties;
			}

			$_properties = array();
			foreach ( $properties as $key ) {
				$_properties[ $key ] = $values;
			}

			return $_properties;
		}

		/**-----------------------------------------------------------------------------
		 * Global Color Scheme functions
		 *-----------------------------------------------------------------------------*/
		/**
		 * Add the default global color schemes in the frontend (Base, Default Background, Default Container).
		 * Other color schemes used by blocks will be added on `render_block` filter.
		 *
		 * @param String 	$current_css
		 * @return String
		 */
		public function add_global_color_schemes_styles( $current_css ) {
			$schemes_array = is_array( get_option( 'stackable_global_color_schemes' ) ) ? get_option( 'stackable_global_color_schemes' ) : [];

			// Get all color schemes, including custom color schemes if any
			$all_color_schemes = apply_filters( 'stackable_global_color_schemes.get_color_schemes', $schemes_array );

			if ( ! is_array( $all_color_schemes ) ) {
				return $current_css;
			}

			$this->color_schemes = $this->convert_to_assoc_array( $all_color_schemes );

			$base_default = isset( $this->color_schemes[ get_option( 'stackable_global_base_color_scheme' ) ] ) ? get_option( 'stackable_global_base_color_scheme' ) : 'scheme-default-1';
			$background_default = isset( $this->color_schemes[ get_option( 'stackable_global_background_mode_color_scheme' ) ] )  ? get_option( 'stackable_global_background_mode_color_scheme' ) : 'scheme-default-2';
			$container_default = isset( $this->color_schemes[ get_option( 'stackable_global_container_mode_color_scheme' ) ] )  ? get_option( 'stackable_global_container_mode_color_scheme' ) : 'scheme-default-1';

			$styles = array();

			if ( isset( $this->color_schemes[$base_default] ) ) {
				$declarations = $this->generate_css_rules( $this->color_schemes[$base_default] );
				$styles[] = array(
					'selector'     => ':root',
					'declarations' => $declarations
				);
			}

			if ( isset( $this->color_schemes[$background_default] ) ) {
				$declarations = $this->generate_css_rules( $this->color_schemes[$background_default], 'background' );
				$styles[] = array(
					'selector'     => '.stk-block-background',
					'declarations' => $declarations
				);
			}

			if ( isset( $this->color_schemes[$container_default] ) ) {
				$declarations = $this->generate_css_rules( $this->color_schemes[$container_default], 'container' );
				$styles[] = array(
					'selector'     => '.stk-container:where(:not(.stk--no-background))',
					'declarations' => $declarations
				);
			}

			$generated_css = wp_style_engine_get_stylesheet_from_css_rules( $styles );
			if ( $generated_css != '' ) {
				$current_css .= "\n/* Global Color Schemes */\n";
				$current_css .= $generated_css;
			}

			return apply_filters( 'stackable_frontend_css' , $current_css );
		}

		/**
		 * This converts the Color Schemes from the database to an associative array where
		 * the key is the color scheme slug and the value is the color scheme array itself.
		 *
		 * This allows us to easily check if the color scheme exists
		 * and retrieve the color scheme by slug
		 *
		 * @param Array 	$schemes_array
		 * @return Array
		 */
		public function convert_to_assoc_array( $schemes_array ) {
			$schemes = array();

			foreach( $schemes_array as $scheme ) {
				$schemes[ $scheme['key'] ] = $scheme[ 'colorScheme' ];
			}

			return $schemes;
		}

		/**
		 * This converts the camel-cased properties to kebab case for CSS custom properties.
		 * E.g., headingColor ==> --stk-heading-color
		 *
		 * @param String 	$property
		 * @return String
		 */
		public function css_property_camel_to_kebab_case( $property ) {
			$result = preg_replace('/([a-z0-9])([A-Z])/', '$1-$2', $property);

			// Convert the result to lowercase and return
			return '--stk-' . strtolower($result);
		}

		/**
		 * This returns an associative array of the color scheme properties where
		 * the key is the camel-cased Property and the value is the kebab-cased CSS custom property
		 *
		 * @param String 	$mode ('', 'background', 'container')
		 * @return Array
		 */
		public function get_css_custom_properties( $mode = '' ) {
			$properties = array();
			$keys = Stackable_Global_Color_Schemes::get_color_scheme_properties();

			foreach( $keys as $key ) {
				if ( $key === 'backgroundColor' ) {
					if ( $mode ) {
						$prefix = $mode === 'background' ? 'block' : 'container';
						$properties[ $key ] = "--stk-$prefix-background-color";
					}
					continue;
				}
				$properties[ $key ] = $this->css_property_camel_to_kebab_case( $key );
			}

			return $properties;
		}

		/**
		 * This returns the CSS declarations for the CSS rules.
		 *
		 * @param Array 	$scheme
		 * @param String 	$mode ('', 'background', 'container')
		 * @return Array
		 */
		public function generate_css_rules( $scheme, $mode = '' ) {
			$decls = array();
			$css_custom_properties = $this->get_css_custom_properties( $mode );

			foreach ($css_custom_properties as $property => $css_property ) {
				if ( isset( $scheme[ $property ] )
					&& isset( $scheme[ $property ][ 'desktop' ] )
					&& $scheme[ $property ][ 'desktop' ] !== ''
				) {
					$decls[ $css_property ] = $scheme[ $property ][ 'desktop' ];
				}
			}

			return $decls;
		}

		/**
		 * This is the render_block filter callback.
		 * This checks if the block uses a non-default background/container color scheme.
		 */
		public function get_block_schemes( $block_content, $block ) {
			if ( ! isset( $block['blockName'] ) || strpos( $block['blockName'], 'stackable/' ) === false ) {
				return $block_content;
			}

			$attributes = $block[ 'attrs' ];

			// Check if the block's backgroundColorScheme has been added to $block_background_schemes
			// and add the custom background color scheme to the global styles once
			if ( isset( $attributes[ 'backgroundColorScheme' ] ) &&
				! in_array( $attributes[ 'backgroundColorScheme' ], $this->block_background_schemes ) ) {
				$this->block_background_schemes[] = $attributes[ 'backgroundColorScheme' ];
				$this->add_block_color_schemes_styles( 'background', $attributes[ 'backgroundColorScheme' ] );
			}

			// Check if the block's containerColorScheme has been added to $block_container_schemes
			// and add the custom container color scheme to the global styles once
			if ( isset( $attributes[ 'containerColorScheme' ] ) &&
				! in_array( $attributes[ 'containerColorScheme' ], $this->block_container_schemes ) ) {
				$this->block_container_schemes[] = $attributes[ 'containerColorScheme' ];
				$this->add_block_color_schemes_styles( 'container', $attributes[ 'containerColorScheme' ] );
			}

			return $block_content;
		}

		/**
		 * This appends the custom color schemes used by our blocks to the global styles.
		 *
		 * @param String 	$mode ('', 'background', 'container')
		 * @param Array 	$scheme
		 * @return Array
		 */
		public function add_block_color_schemes_styles( $mode, $scheme ) {
			if ( isset( $this->color_schemes[ $scheme ] ) ) {
				$declarations = $this->generate_css_rules( $this->color_schemes[ $scheme ], $mode );
				$styles[] = array(
					'selector'     => '.' .$mode . '-' . $scheme,
					'declarations' => $declarations
				);

				$generated_css = "/* Global Color Schemes ($mode-$scheme) */\n";
				$generated_css .= wp_style_engine_get_stylesheet_from_css_rules( $styles );
				$css = apply_filters( 'stackable_frontend_css' , $generated_css );
				wp_add_inline_style( 'ugb-style-css-nodep', $css );
			}
		}
	}

	new Stackable_Global_Color_Schemes();
}
