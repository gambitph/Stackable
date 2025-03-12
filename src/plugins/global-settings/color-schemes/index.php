<?php
/**
 * Global Color Schemes
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Global_Color_Schemes' ) ) {

	/**
	 * Stackable Global Color Schemes
	 */
    class Stackable_Global_Color_Schemes {

		/**
		 * Initialize
		 */
  		function __construct() {
			// Register our settings.
			add_action( 'register_stackable_global_settings', array( $this, 'register_color_schemes' ) );
			add_action( 'stackable_early_version_upgraded', array( $this, 'set_global_color_scheme_default_values' ), 10, 2 );

			if ( is_frontend() ) {

				/**
				 * Global Color Schemes hooks
				 */
				// Add the Global Color Schemes styles in the frontend only.
				add_filter( 'stackable_inline_styles_nodep', array( $this, 'add_global_color_schemes_styles' ) );
			}
		}

		/**
		 * Register the settings we need for global spacing and borders.
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
										'properties' => array(
											'backgroundColor' => $string_properties,
											'headingColor' => $string_properties,
											'textColor' => $string_properties,
											'linkColor' => $string_properties,
											'accentColor' => $string_properties,
											'buttonColor' => $string_properties,
											'buttonTextColor' => $string_properties,
											'buttonOutlineColor' => $string_properties
										)
									)
								)
							)
						)
					),
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
		 * When upgrading to v3.15.0 and above, the default color schemes (default and color scheme 2) are empty.
		 * If new installation, the default color schemes have values.
		 *
		 */
		function set_global_color_scheme_default_values( $old_version, $new_version ) {
			// If upgrading and there's no global color schemes, values in default color schemes are empty
			if ( ! empty( $old_version ) && version_compare( $old_version, "3.15.0", "<" ) && ! get_option( 'stackable_global_color_schemes' ) ) {
				$empty_color_scheme = array(
					'backgroundColor' => array( 'desktop' => '' ),
					'headingColor' => array( 'desktop' => '' ),
					'textColor' => array( 'desktop' => '' ),
					'linkColor' => array( 'desktop' => '' ),
					'accentColor' => array( 'desktop' => '' ),
					'buttonColor' => array( 'desktop' => '' ),
					'buttonTextColor' => array( 'desktop' => '' ),
					'buttonOutlineColor' => array( 'desktop' => '' )
				);

				$default = array(
					array(
						'name' => 'Default Scheme',
						'key' => 'scheme-default-1',
						'colorScheme' => $empty_color_scheme
					),
					array(
						'name' => 'Color Scheme 2',
						'key' => 'scheme-default-2',
						'colorScheme' => $empty_color_scheme
					),
				);

				update_option( 'stackable_global_color_schemes', $default );
			} else if ( empty( $old_version ) ) {
				// If new install, add default values in color schemes
				$default = array(
					array(
						'name' => 'Default Scheme',
						'key' => 'scheme-default-1',
						'colorScheme' => array(
							'backgroundColor' => array( 'desktop' => '#fff' ),
							'headingColor' => array( 'desktop' => '' ),
							'textColor' => array( 'desktop' => '' ),
							'linkColor' => array( 'desktop' => '' ),
							'accentColor' => array( 'desktop' => '#a6a6a6' ),
							'buttonColor' => array( 'desktop' => '#008de4' ),
							'buttonTextColor' => array( 'desktop' => '#fff' ),
							'buttonOutlineColor' => array( 'desktop' => '#008de4' )
						)
					),
					array(
						'name' => 'Color Scheme 2',
						'key' => 'scheme-default-2',
						'colorScheme' => array(
							'backgroundColor' => array( 'desktop' => '#f1f1f1' ),
							'headingColor' => array( 'desktop' => '' ),
							'textColor' => array( 'desktop' => '' ),
							'linkColor' => array( 'desktop' => '' ),
							'accentColor' => array( 'desktop' => '#a6a6a6' ),
							'buttonColor' => array( 'desktop' => '#008de4' ),
							'buttonTextColor' => array( 'desktop' => '#fff' ),
							'buttonOutlineColor' => array( 'desktop' => '#008de4' )
						)
					),
				);

				update_option( 'stackable_global_color_schemes', $default );
			}
		}

		/**-----------------------------------------------------------------------------
		 * Global Color Scheme functions
		 *-----------------------------------------------------------------------------*/
		/**
		 * Add our global color schemes styles in the frontend.
		 *
		 * @param String $current_css
		 * @return String
		 */
		public function add_global_color_schemes_styles( $current_css ) {
			// $generated_css = Stackable_Global_Settings::generate_global_block_layouts( 'stackable_global_spacing_and_borders', 'Global Spacing and Borders' );

			// if ( ! $generated_css ) {
			// 	return $current_css;
			// }

			// $current_css .= $generated_css;
			return apply_filters( 'stackable_frontend_css' , $current_css );
		}
	}

	new Stackable_Global_Color_Schemes();
}
