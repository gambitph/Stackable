<?php
/**
 * Global Block Layouts
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Global_Block_Layouts' ) ) {

	/**
	 * Stackable Global Block Layouts
	 */
    class Stackable_Global_Block_Layouts {

		/**
		 * Initialize
		 */
  		function __construct() {
			// Register our settings.
			add_action( 'register_stackable_global_settings', array( $this, 'register_block_layouts' ) );

			if ( is_frontend() ) {

				/**
				 * Block layout hooks
				 */
				// Add the Block layout styles in the frontend only.
				add_filter( 'stackable_inline_styles_nodep', array( $this, 'add_global_block_layout_styles' ) );
			}
		}

		private function create_schema( $type ) {
			return array(
				'type' => 'object',
				'properties' => array(
					'desktop' => $type,
					'tablet' => $type,
					'mobile' => $type,
					'desktopHover' => $type,
					'tabletHover' => $type,
					'mobileHover' => $type,
					'desktopParentHover' => $type,
					'tabletParentHover' => $type,
					'mobileParentHover' => $type,
					'desktopUnit' => array( 'type' => 'string' ),
					'tabletUnit' => array( 'type' => 'string' ),
					'mobileUnit' => array( 'type' => 'string' ),
					'desktopHoverUnit' => array( 'type' => 'string' ),
					'tabletHoverUnit' => array( 'type' => 'string' ),
					'mobileHoverUnit' => array( 'type' => 'string' ),
					'desktopParentHoverUnit' => array( 'type' => 'string' ),
					'tabletParentHoverUnit' => array( 'type' => 'string' ),
					'mobileParentHoverUnit' => array( 'type' => 'string' ),
				)
			);
		}
		/**
		 * Register the settings we need for global block layouts.
		 *
		 * @return void
		 */
		public function register_block_layouts() {
			$type_four_range = array(
				'type' => 'object',
				'properties' => array(
					'top' => array( 'type' => 'number' ),
					'right' => array( 'type' => 'number' ),
					'bottom' => array( 'type' => 'number' ),
					'left' => array( 'type' => 'number' ),
				)
			);

			$type_string = array( 'type' => 'string' );
			$type_number = array( 'type' => 'number' );

			$four_range_properties = $this->create_schema( $type_four_range );
			$string_properties = $this->create_schema( $type_string );
			$number_properties = $this->create_schema( $type_number );

			register_setting(
				'stackable_global_settings',
				'stackable_global_block_layouts',
				array(
					'type' => 'object',
					'description' => __( 'Stackable global block layouts', STACKABLE_I18N ),
					'sanitize_callback' => array( $this, 'sanitize_array_setting' ),
					'show_in_rest' => array(
						'schema' => array(
							'properties' => array(
								'--stk-container-border-radius' => $four_range_properties,
								'--stk-container-box-shadow' => $string_properties,
								'--stk-container-padding' => $four_range_properties,
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

		public function generate_style( $property, $value, $unit ) {
			if ( is_array( $value ) ) {
				return $property . ': ' . $value[ 'top' ] . $unit . ' ' . $value[ 'right' ] . $unit . ' ' .  $value[ 'bottom' ] . $unit . ' ' .  $value[ 'left' ] . $unit . ' ' . ';';
			}

			return $property . ': ' . $value . $unit . ';';
		}

		/**-----------------------------------------------------------------------------
		 * Block Layouts functions
		 *-----------------------------------------------------------------------------*/
		// TODO: escape when output
		/**
		 * Add our global block layout styles in the frontend.
		 *
		 * @param String $current_css
		 * @return String
		 */
		public function add_global_block_layout_styles( $current_css ) {
			// Don't do anything if we don't have any global color.
			$block_layouts = get_option( 'stackable_global_block_layouts' );

			if ( ! $block_layouts || ! is_array( $block_layouts ) ) {
				return $current_css;
			}

			$tablet_breakpoint = 1023;
			$mobile_breakpoint = 767;

			$css = array(
				'desktop' => array(),
				'tablet' => array(),
				'mobile' => array(),
			);

			foreach ( $block_layouts as $property => $value ) {
				if ( isset( $value[ 'desktop' ] ) ) {
					$css[ 'desktop' ][] = $this->generate_style( $property, $value[ 'desktop' ], 'px' );
				}

				if ( isset( $value[ 'tablet' ] ) ) {
					$css[ 'tablet' ][] = $this->generate_style( $property, $value[ 'tablet' ], 'px' );
				}

				if ( isset( $value[ 'mobile' ] ) ) {
					$css[ 'mobile' ][] = $this->generate_style( $property, $value[ 'mobile' ], 'px' );
				}
			}

			$generated_css = '';
			if ( ! empty( $css['desktop'] ) ) {
				$generated_css .=  ':root { ' . implode( '', $css['desktop'] ) . ' }';
			}

			if ( ! empty( $css['tablet'] ) ) {
				$generated_css .= '@media screen and (max-width:' . $tablet_breakpoint . 'px) {';
				$generated_css .= ':root { ' . implode( '', $css['tablet'] ) . ' }';
				$generated_css .= '}';
			}
			if ( ! empty( $css['mobile'] ) ) {
				$generated_css .= '@media screen and (max-width:' . $mobile_breakpoint . 'px) {';
				$generated_css .= ':root { ' . implode( '', $css['mobile'] ) . ' }';
				$generated_css .= '}';
			}

			// foreach ( $colors as $color_palette ) {
			// 	if ( ! is_array( $color_palette ) ) {
			// 		continue;
			// 	}

			// 	foreach ( $color_palette as $color ) {
			// 		if ( ! is_array( $color ) ) {
			// 			continue;
			// 		}
			// 		if ( ! array_key_exists( 'slug', $color ) || ! array_key_exists( 'color', $color ) || ! array_key_exists( 'rgb', $color ) ) {
			// 			continue;
			// 		}

			// 		// Only do this for our global colors.
			// 		if ( $color['color'] && $color['slug'] ) {
			// 			// Add the custom css property.
			// 			$css[] = '--' . $color['slug'] . ': ' . $color['color'] . ';';
			// 			$css[] = '--' . $color['slug'] . '-rgba: ' . $color['rgb'] . ';';
			// 		}
			// 	}
			// }

			// if ( count( $css ) ) {
			// 	$generated_color_css = "/* Global colors */\n";
			// 	$generated_color_css .= ':root {' . implode( ' ', $css ) . '}';
			// 	$current_css .= $generated_color_css;
			// }
			$current_css .= $generated_css;
			return apply_filters( 'stackable_global_frontend_css' , $current_css );
		}
	}

	new Stackable_Global_Block_Layouts();
}
