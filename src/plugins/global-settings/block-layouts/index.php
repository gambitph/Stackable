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
					'top' => array( 'type' => 'number', 'default' => '' ),
					'right' => array( 'type' => 'number', 'default' => '' ),
					'bottom' => array( 'type' => 'number', 'default' => '' ),
					'left' => array( 'type' => 'number', 'default' => '' ),
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

								'--stk-button-min-height' => $number_properties,
								'--stk-button-padding' => $four_range_properties,
								'--stk-icon-button-padding' => $four_range_properties,
								'--stk-button-border-style' => $string_properties,
								'--stk-button-border-width' => $four_range_properties,
								'--stk-button-ghost-border-width' => $four_range_properties,
								'--stk-button-border-radius' => $four_range_properties,
								'--stk-button-box-shadow' => $string_properties,
								'--stk-button-icon-size' => $number_properties,
								'--stk-button-icon-gap' => $number_properties,
								'--stk-button-column-gap' => $number_properties,
								'--stk-button-row-gap' => $number_properties,

								'--stk-icon-list-size' => $number_properties,
								'--stk-icon-list-row-gap' => $number_properties,
								'--stk-icon-list-icon-gap' => $number_properties,
								'--stk-icon-list-indentation' => $number_properties,

								'--stk-icon-size' => $number_properties
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

		public function get_unit( $block_layouts, $property, $state ) {
			return $block_layouts[ $property ][ $state . 'Unit' ] ?? 'px';
		}

		public function get_states( $state ) {
			return strpos( $state, 'Unit' ) === false;
		}

		public function get_defaults( $property, $device ) {
			$defaults = json_decode( file_get_contents( plugin_dir_path( __FILE__ ) . 'defaults.json' ), true );

			if ( ! isset( $defaults[ $property ] ) ) {
				return array( 'top' => 0, 'right' => 0, 'bottom' => 0, 'left' => 0 );
			}

			if ( ! isset( $defaults[ $property ][ $device ] ) ) {
				return $defaults[ $property ][ 'desktop' ];
			}

			return $defaults[ $property ][ $device ];
		}

		/**-----------------------------------------------------------------------------
		 * Block Layouts functions
		 *-----------------------------------------------------------------------------*/
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

			foreach ( $block_layouts as $property => $values ) {
				$states = array_filter( $values, array( $this, 'get_states' ), ARRAY_FILTER_USE_KEY );

				foreach ( $states as $state => $value ) {
					$unit = $this->get_unit( $block_layouts, $property, $state );

					$device = strpos( $state, 'desktop' ) !== false ? 'desktop' : ( strpos( $state, 'tablet' ) !== false ? 'tablet' : 'mobile' );
					$hover_state = strpos( $state, 'ParentHover' ) !== false ? 'parent-hover' : ( strpos( $state, 'Hover' ) !== false ? 'hover' : 'normal' );

					$custom_property = $property;

					if ( $hover_state !== 'normal' ) {
						$custom_property .= '-' . $hover_state;
					}

					if ( is_string( $value ) ) {
						$style = $value;
					} else if ( is_array( $value ) ) {
						$default_value = $this->get_defaults( $property, $device );
						$top = isset( $value[ 'top' ] ) ? $value[ 'top' ] : $default_value[ 'top' ];
						$right = isset( $value[ 'right' ] ) ? $value[ 'right' ] : $default_value[ 'right' ];
						$bottom = isset( $value[ 'bottom' ] ) ? $value[ 'bottom' ] : $default_value[ 'bottom' ];
						$left = isset( $value[ 'left' ] ) ? $value[ 'left' ] : $default_value[ 'left' ];

						$style = $top . $unit . ' ' . $right . $unit . ' ' .  $bottom . $unit . ' ' .  $left  . $unit;
					} else {
						$style = $value . $unit;
					}

					$css[ $device ][ $custom_property ] = $style;
				}
			}

			$styles = array();
			$generated_css = '';

			if ( ! empty( $css[ 'desktop' ] ) || ! empty( $css[ 'tablet' ] ) || ! empty( $css[ 'mobile' ] ) ) {
				$generated_css .= "\n/* Global block layouts */\n";
			}

			if ( ! empty( $css['desktop'] ) ) {
				$styles[] = array(
						'selector'     => ':root',
						'declarations' => $css[ 'desktop' ]
				);
			}

			if ( ! empty( $css['tablet'] ) ) {
				$styles[] = array(
						'rules_group'  => '@media (max-width:' . $tablet_breakpoint .'px)',
						'selector'     => ':root',
						'declarations' => $css[ 'tablet' ]
				);
			}

			if ( ! empty( $css['mobile'] ) ) {
				$styles[] = array(
					'rules_group'  => '@media (max-width:' . $mobile_breakpoint .'px)',
					'selector'     => ':root',
					'declarations' => $css[ 'mobile' ]
				);
			}

			$generated_css .= wp_style_engine_get_stylesheet_from_css_rules( $styles );
			$current_css .= $generated_css;
			return apply_filters( 'stackable_global_frontend_css' , $current_css );
		}
	}

	new Stackable_Global_Block_Layouts();
}
