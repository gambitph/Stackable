<?php
/**
 * Global Spacing and Borders
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Global_Spacing_And_Borders' ) ) {

	/**
	 * Stackable Global Block Spacing and Borders
	 */
    class Stackable_Global_Spacing_And_Borders {

		/**
		 * Initialize
		 */
  		function __construct() {
			// Register our settings.
			add_action( 'register_stackable_global_settings', array( $this, 'register_spacing_and_borders' ) );

			if ( is_frontend() ) {

				/**
				 * Global Spacing and Borders hooks
				 */
				// Add the Global Spacing and Borders styles in the frontend only.
				add_filter( 'stackable_inline_styles_nodep', array( $this, 'add_global_spacing_and_borders_styles' ) );
			}
		}

		/**
		 * Register the settings we need for global spacing and borders.
		 *
		 * @return void
		 */
		public function register_spacing_and_borders() {
			$four_range_properties = Stackable_Global_Settings::get_four_range_properties();
			$string_properties = Stackable_Global_Settings::get_string_properties();
			$number_properties = Stackable_Global_Settings::get_number_properties();

			register_setting(
				'stackable_global_settings',
				'stackable_global_spacing_and_borders',
				array(
					'type' => 'object',
					'description' => __( 'Stackable global spacing and borders', STACKABLE_I18N ),
					'sanitize_callback' => array( $this, 'sanitize_array_setting' ),
					'show_in_rest' => array(
						'schema' => array(
							'properties' => array(
								'container-border-style' => $string_properties,
								'container-border-width' => $four_range_properties,
								'container-border-radius' => $four_range_properties,
								'container-box-shadow' => $string_properties,
								'container-padding' => $four_range_properties,

								'block-background-border-style' => $string_properties,
								'block-background-border-width' => $four_range_properties,
								'block-background-border-radius' => $four_range_properties,
								'block-background-box-shadow' => $string_properties,
								'block-background-padding' => $four_range_properties,

								'block-margin-bottom' => $number_properties,

								'column-margin' => $number_properties,
								'columns-column-gap' => $number_properties,
								'columns-row-gap' => $number_properties,

								'image-drop-shadow' => $string_properties,
								'image-border-radius' => $four_range_properties,
							)
						)
					),
					'default' => '',
				)
			);
		}

		public function sanitize_array_setting( $input ) {
			return ! is_array( $input ) ? array( array() ) : $input;
		}

		/**-----------------------------------------------------------------------------
		 * Global Spacing and Borders functions
		 *-----------------------------------------------------------------------------*/
		/**
		 * Add our global spacing and borders styles in the frontend.
		 *
		 * @param String $current_css
		 * @return String
		 */
		public function add_global_spacing_and_borders_styles( $current_css ) {
			$generated_css = Stackable_Global_Settings::generate_global_block_layouts( 'stackable_global_spacing_and_borders', 'Global Spacing and Borders' );

			if ( ! $generated_css ) {
				return $current_css;
			}

			// Add a body class if there are any global spacing and borders styles.
			if ( $generated_css !== '' ) {
				add_filter( 'body_class', array( $this, 'add_body_class_spacing_and_borders' ) );
			}

			$current_css .= $generated_css;
			return apply_filters( 'stackable_frontend_css' , $current_css );
		}

		public function add_body_class_spacing_and_borders( $classes ) {
			$classes[] = 'stk-has-design-system-spacing-and-borders';
			return $classes;
		}
	}

	new Stackable_Global_Spacing_And_Borders();
}
