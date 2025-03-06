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
								'--stk-container-border-style' => $string_properties,
								'--stk-container-border-width' => $four_range_properties,
								'--stk-container-border-radius' => $four_range_properties,
								'--stk-container-box-shadow' => $string_properties,
								'--stk-container-padding' => $four_range_properties,

								'--stk-block-background-border-style' => $string_properties,
								'--stk-block-background-border-width' => $four_range_properties,
								'--stk-block-background-border-radius' => $four_range_properties,
								'--stk-block-background-box-shadow' => $string_properties,
								'--stk-block-background-padding' => $four_range_properties,

								'--stk-block-margin-bottom' => $number_properties,

								'--stk-column-margin' => $number_properties,
								'--stk-columns-column-gap' => $number_properties,
								'--stk-columns-row-gap' => $number_properties,

								'--stk-image-drop-shadow' => $string_properties,
								'--stk-image-border-radius' => $four_range_properties,
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
			$defaults = json_decode( file_get_contents( plugin_dir_path( __FILE__ ) . 'defaults.json' ), true );

			$generated_css = Stackable_Global_Settings::generate_global_block_styles( 'stackable_global_spacing_and_borders', 'Global Spacing and Borders', $defaults );

			if ( ! $generated_css ) {
				return $current_css;
			}

			$current_css .= $generated_css;
			return apply_filters( 'stackable_global_frontend_css' , $current_css );
		}
	}

	new Stackable_Global_Spacing_And_Borders();
}
