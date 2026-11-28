<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Dynamic_Breakpoints' ) ) {
	class Stackable_Dynamic_Breakpoints {

		// Holds the value of the saved or default breakpoints
		private $dynamic_breakpoints = false;
		private $has_custom_breakpoints = false;

		/**
		 * Add our hooks.
		 */
		function __construct() {
			// Register breakpoint settings.
			add_action( 'admin_init', array( $this, 'register_settings' ) );
			add_action( 'rest_api_init', array( $this, 'register_settings' ) );

			if ( is_frontend() ) {
				// Add a filter for replacing shortcut media queries before the breakpoint adjustment.
				add_filter( 'stackable_frontend_css', array( $this, 'replace_shortcut_media_queries' ), 9 );

				// Add our filter that adjusts all CSS that we print out.
				add_filter( 'stackable_frontend_css', array( $this, 'adjust_breakpoints' ) );

				// Let the frontend CSS loader know if it needs to adjust the breakpoints of our stylesheets.
				add_filter( 'stackable_frontend_css_has_custom_breakpoints', array( $this, 'has_custom_breakpoints' ) );

				// Adjust the styles outputted by Stackable blocks.
				// 11 Priority, do this last because changing style can affect inline css optimization.
				add_filter( 'render_block', array( $this, 'adjust_block_styles' ), 11, 2 );
			}

			// Add the default breakpoints to the localized settings.
			add_filter( 'stackable_localize_settings_script', array( $this, 'add_default_breakpoints' ) );
		}

		/**
		 * Get the dynamic breakpoints saved by the user.
		 *
		 * @return Array
		 */
		public function get_dynamic_breakpoints() {
			// Allow others to set default breakpoints.
			$breakpoints = apply_filters( 'stackable_responsive_breakpoints', array(
				'tablet' => '',
				'mobile' => '',
			) );

			// Check if there are saved custom breakpoints from our settings.
			$saved_breakpoints = get_option( 'stackable_dynamic_breakpoints' );
			if ( ! empty( $saved_breakpoints ) ) {
				// Set breakpoints for tablet and mobile if they are set.
				if ( ! empty( $saved_breakpoints['tablet'] ) ) {
					$breakpoints['tablet'] = $saved_breakpoints['tablet'];
				}
				if ( ! empty( $saved_breakpoints['mobile'] ) ) {
					$breakpoints['mobile'] = $saved_breakpoints['mobile'];
				}
			}

			$this->dynamic_breakpoints = $breakpoints;
			$this->has_custom_breakpoints = ! empty( $breakpoints['tablet'] ) || ! empty( $breakpoints['mobile'] );
		}

		/**
		 * Add the default breakpoints to the localized settings to be used for
		 * the default placeholder in the settings.
		 *
		 * @param Array $args
		 * @return Array
		 */
		public function add_default_breakpoints( $args ) {
			$args['defaultBreakpoints'] = apply_filters( 'stackable_responsive_breakpoints', array(
				'tablet' => '1024',
				'mobile' => '768',
			) );
			return $args;
		}

		/**
		 * Register the setting where the user's dynamic breakpoints will be
		 * saved.
		 *
		 * @return void
		 */
		public function register_settings() {
			register_setting(
				'stackable_dynamic_breakpoints',
				'stackable_dynamic_breakpoints',
				array(
					'type' => 'object',
					'description' => __( 'Custom dynamic breakpoints', STACKABLE_I18N ),
					'sanitize_callback' => array( $this, 'sanitize_array_setting' ),
					'show_in_rest' => array(
						'schema' => array(
							'type' => 'object',
							'properties' => array(
								'tablet' => array(
									'type' => 'string',
								),
								'mobile' => array(
									'type' => 'string',
								),
							)
						)
					),
					'default' => array(
						'tablet' => '',
						'mobile' => '',
					),
				)
			);
		}

		public function sanitize_array_setting( $input ) {
			return ! is_array( $input ) ? array( array() ) : $input;
		}

		/**
		 * True if there are any custom breakpoints assigned by the user.
		 *
		 * @return boolean
		 */
		public function has_custom_breakpoints() {
			if ( $this->dynamic_breakpoints === false ) {
				$this->get_dynamic_breakpoints();
			}
			return $this->has_custom_breakpoints;
		}

		/**
		 * Replace shortcut media queries in the given CSS.
		 *
		 * @param String $css
		 * @return String adjusted CSS
		 */
		public function replace_shortcut_media_queries( $css ) {
			$css = str_replace( '@media tablet', '@media only screen and (max-width: 1024px)', $css );
			$css = str_replace( '@media mobile', '@media only screen and (max-width: 768px)', $css );

			return $css;
		}

		/**
		 * Adjust media query breakpoints in the given CSS.
		 *
		 * @param String $css
		 * @return String adjusted CSS
		 */
		public function adjust_breakpoints( $css ) {
			if ( ! $this->has_custom_breakpoints() ) {
				return $css;
			}

			$breakpoints = $this->dynamic_breakpoints;
			$new_tablet = $breakpoints['tablet'];
			$new_mobile = $breakpoints['mobile'];


			if ( $new_tablet === '1024' && $new_mobile === '768' ) {
				return $css;
			}

			// Handle CSS optimized values where there are no spaces between the
			// colon and the value and if there is a space between the colon and
			// the value.
			if ( ! empty( $new_tablet ) ) {
				// Check if the style generated contains old breakpoints that we need to replace.
				$has_old_tablet = strpos( $css, 'width: 1024px)' ) !== false ||
				                  strpos( $css, 'width:1024px)' ) !== false;
				$has_old_tablet_minus_1 = strpos( $css, 'width: 1023px)' ) !== false ||
				                          strpos( $css, 'width:1023px)' ) !== false;

				if ( $has_old_tablet ) {
					$css = preg_replace( "/(@media[^{]+)width:\s*1024px/m", "$1width:" . $new_tablet . "px", $css );
				}
				if ( $has_old_tablet_minus_1 ) {
					$css = preg_replace( "/(@media[^{]+)width:\s*1023px/m", "$1width:" . ( $new_tablet - 1 ) . "px", $css );
				}
			}

			// Mobile version
			if ( ! empty( $new_mobile ) ) {

				// Check if the style generated contains old breakpoints that we need to replace.
				$has_old_mobile = strpos( $css, 'width: 768px)' ) !== false ||
				                  strpos( $css, 'width:768px)' ) !== false;
				$has_old_mobile_minus_1 = strpos( $css, 'width: 767px)' ) !== false ||
				                          strpos( $css, 'width:767px)' ) !== false;

				if ( $has_old_mobile ) {
					$css = preg_replace( "/(@media[^{]+)width:\s*768px/m", "$1width:" . $new_mobile . "px", $css );
				}
				if ( $has_old_mobile_minus_1 ) {
					$css = preg_replace( "/(@media[^{]+)width:\s*767px/m", "$1width:" . ( $new_mobile - 1 ) . "px", $css );
				}
			}

			return $css;
		}

		/**
		 * Run our block output on the css filter.
		 *
		 * @param String $block_content
		 * @param Array $block
		 * @return void
		 */
		public function adjust_block_styles( $block_content, $block ) {
			// Don't remove this filter while blocks are rendered: removing the
			// only callback of a priority inside nested render_block calls
			// makes WordPress (below 6.9) skip the later render_block
			// callbacks of the parent block.
			if ( ! $this->has_custom_breakpoints() ) {
				return $block_content;
			}

			if ( $block_content === null ) {
				return $block_content;
			}

			if ( ! isset( $block['blockName'] ) || strpos( $block['blockName'], 'stackable/' ) === false ) {
				return $block_content;
			}

			return apply_filters( 'stackable_frontend_css', $block_content );
		}
	}

	new Stackable_Dynamic_Breakpoints();
}
