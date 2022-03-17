<?php
/**
 * Saved Block Styles: Default block styles and new layouts.
 *
 * @since 3.3.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Saved_Block_Styles' ) ) {

	/**
	 * Stackable Saved Block Styles.
	 */
    class Stackable_Saved_Block_Styles {

		/**
		 * Initialize
		 */
		function __construct() {
			// Register our settings.
			add_action( 'init', array( $this, 'register_block_style_settings' ) );

			// Register our management rest routes
			add_action( 'rest_api_init', array( $this, 'register_route' ) );
		}

		/**
		 * Register the settings we need for saving block styles.
		 *
		 * @return void
		 */
		public function register_block_style_settings() {

			// Schema example:
			/**
			 * [
			 * { block: 'stackable/heading', styles: [{ name: 'default', data: 'some-serialized-data', slug: 'default' }] },
			 * { block: 'stackable/hero', styles: [{ name: 'Horizontal', data: 'some-serialized-data', slug: 'horizontal' }] },
			 * ]
			 */
			register_setting(
				'stackable_block_styles',
				'stackable_block_styles',
				array(
					'type' => 'array',
					'description' => __( 'Stackable User Block Styles', STACKABLE_I18N ),
					'sanitize_callback' => array( $this, 'sanitize_array_setting' ),
					'show_in_rest' => array(
						'schema' => array(
							'items' => array(
								'type' => 'object',
								'properties' => array(
									'block' => array( // The block name e.g. stackable/heading
										'type' => 'string',
									),
									'styles' => array( // The block styles
										'type' => 'array',
										'items' => array(
											'type' => 'object',
											'properties' => array(
												'slug' => array( // A unique identifier for the style e.g. default, horizontal
													'type' => 'string',
												),
												'name' => array( // The name of the block style e.g. Default, Horizontal
													'type' => 'string',
												),
												'data' => array( // Serialized block data
													'type' => 'string',
												),
											)
										),
									),
								),
							),
						)
					),
					'default' => '',
				)
			);
		}

		public function sanitize_array_setting( $input ) {
			return ! is_array( $input ) ? array( array() ) : $input;
		}

		public function register_route() {
			register_rest_route( 'stackable/v2', '/update_block_style', array(
				'methods' => 'POST',
				'callback' => array( $this, 'update_block_style' ),
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
				'args' => array(
					'block' => array(
						'validate_callback' => __CLASS__ . '::validate_string',
					),
					'slug' => array(
						'validate_callback' => __CLASS__ . '::validate_string',
					),
					'name' => array(
						'validate_callback' => __CLASS__ . '::validate_string',
					),
					'data' => array(
						'validate_callback' => __CLASS__ . '::validate_string',
					),
				),
			) );

			register_rest_route( 'stackable/v2', '/delete_block_style', array(
				'methods' => 'POST',
				'callback' => array( $this, 'delete_block_style' ),
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
				'args' => array(
					'block' => array(
						'validate_callback' => __CLASS__ . '::validate_string',
					),
					'slug' => array(
						'validate_callback' => __CLASS__ . '::validate_string',
					),
				),
			) );
		}

		public static function validate_string( $value, $request, $param ) {
			if ( ! is_string( $value ) ) {
				return new WP_Error( 'invalid_param', sprintf( esc_html__( '%s must be a string.', STACKABLE_I18N ), $param ) );
			}
			return true;
		}

		public static function validate_boolean( $value, $request, $param ) {
			if ( ! is_bool( $value ) ) {
				return new WP_Error( 'invalid_param', sprintf( esc_html__( '%s must be a boolean.', STACKABLE_I18N ), $param ) );
			}
			return true;
		}

		public function update_block_style( $request ) {
			$block = $request->get_param( 'block' );
			$slug = $request->get_param( 'slug' );
			$name = $request->get_param( 'name' );
			$data = $request->get_param( 'data' );

			// All our stored styles.
			$block_styles = get_option( 'stackable_block_styles', array() );

			// Find the block.
			$block_index = false;
			foreach ( $block_styles as $i => $block_style ) {
				if ( $block_style->block === $block ) {
					$block_index = $i;
					break;
				}
			}
			if ( $block_index === false ) {
				$block_style = new stdClass();
				$block_style->block = $block;
				$block_style->styles = array();
				$block_styles[] = $block_style;
				$block_index = count( $block_styles ) - 1;
			}

			// Find the style if it exists.
			$style_index = false;
			foreach ( $block_styles[ $block_index ]->styles as $k => $style ) {
				if ( $style->slug === $slug ) {
					$style_index = $k;
					break;
				}
			}

			// Modify existing style or append it.
			$style = new stdClass();
			$style->name = $name;
			$style->slug = $slug;
			$style->data = $data;
			if ( $style_index !== false ) {
				$block_styles[ $block_index ]->styles[ $style_index ] = $style;
			} else {
				$block_styles[ $block_index ]->styles[] = $style;
			}

			update_option( 'stackable_block_styles', $block_styles );

			return rest_ensure_response( true );
		}


		public function delete_block_style( $request ) {
			$block = $request->get_param( 'block' );
			$slug = $request->get_param( 'slug' );

			// All our stored styles.
			$block_styles = get_option( 'stackable_block_styles', array() );

			// Find the block.
			$block_index = false;
			foreach ( $block_styles as $i => $block_style ) {
				if ( $block_style->block === $block ) {
					$block_index = $i;
					break;
				}
			}
			if ( $block_index !== false ) {
				// Find the style if it exists.
				foreach ( $block_styles[ $block_index ]->styles as $k => $style ) {
					if ( $style->slug === $slug ) {
						// Remove the style.
						array_splice( $block_styles[ $block_index ]->styles, $k, 1 );
						update_option( 'stackable_block_styles', $block_styles );
						break;
					}
				}
			}

			return rest_ensure_response( true );
		}
	}

	new Stackable_Saved_Block_Styles();
}
