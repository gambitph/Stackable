<?php
/**
 * Global Spacing and Borders
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Global_Buttons_And_Icons' ) ) {

	/**
	 * Stackable Global Block Spacing and Borders
	 */
    class Stackable_Global_Buttons_And_Icons {

		/**
		 * Initialize
		 */
  		function __construct() {
			// Register our settings.
			add_action( 'register_stackable_global_settings', array( $this, 'register_buttons_and_icons' ) );

			if ( is_frontend() ) {

				/**
				 * Global Spacing and Borders hooks
				 */
				// Add the Global Spacing and Borders styles in the frontend only.
				add_filter( 'stackable_inline_styles_nodep', array( $this, 'add_global_buttons_and_icons_styles' ) );
			}
		}

		/**
		 * Register the settings we need for global spacing and borders.
		 *
		 * @return void
		 */
		public function register_buttons_and_icons() {
			$four_range_properties = Stackable_Global_Settings::get_four_range_properties();
			$string_properties = Stackable_Global_Settings::get_string_properties();
			$number_properties = Stackable_Global_Settings::get_number_properties();

			register_setting(
				'stackable_global_settings',
				'stackable_global_buttons_and_icons',
				array(
					'type' => 'object',
					'description' => __( 'Stackable global buttons and icons', STACKABLE_I18N ),
					'sanitize_callback' => array( $this, 'sanitize_array_setting' ),
					'show_in_rest' => array(
						'schema' => array(
							'properties' => array(
								'button-min-height' => $number_properties,
								'button-padding' => $four_range_properties,
								'icon-button-padding' => $four_range_properties,
								'button-border-style' => $string_properties,
								'button-border-width' => $four_range_properties,
								'button-ghost-border-width' => $four_range_properties,
								'button-border-radius' => $four_range_properties,
								'button-box-shadow' => $string_properties,
								'button-icon-size' => $number_properties,
								'button-icon-gap' => $number_properties,
								'button-column-gap' => $number_properties,
								'button-row-gap' => $number_properties,

								'icon-list-icon-size' => $number_properties,
								'icon-list-row-gap' => $number_properties,
								'icon-list-icon-gap' => $number_properties,
								'icon-list-indentation' => $number_properties,

								'icon-size' => $number_properties
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
		 * Global Buttons and Icons functions
		 *-----------------------------------------------------------------------------*/
		/**
		 * Add our global buttons and Icons styles in the frontend.
		 *
		 * @param String $current_css
		 * @return String
		 */
		public function add_global_buttons_and_icons_styles( $current_css ) {
			$generated_css = Stackable_Global_Settings::generate_global_block_layouts( 'stackable_global_buttons_and_icons', 'Global Buttons and Icons' );

			if ( ! $generated_css ) {
				return $current_css;
			}

			// Add a body class if there are any global buttons and icons styles.
			if ( $generated_css !== '' ) {
				add_filter( 'body_class', array( $this, 'add_body_class_buttons_and_icons' ) );
			}

			$current_css .= $generated_css;
			return apply_filters( 'stackable_frontend_css' , $current_css );
		}

		public function add_body_class_buttons_and_icons( $classes ) {
			$classes[] = 'stk-has-design-system-buttons-and-icons';
			return $classes;
		}
	}

	new Stackable_Global_Buttons_And_Icons();
}
