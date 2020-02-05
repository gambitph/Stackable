<?php
/**
 * Design Library
 *
 * @since 	2.3
 * @package Stackable
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Design_Library' ) ) {
	/**
	 * Class Stackable Design Library
	 */
	class Stackable_Design_Library {

		/**
		 * Constructor
		 */
		public function __construct() {
			add_action( 'rest_api_init', array( $this, 'register_route' ) );
		}

		public static function validate_string( $value = '', $request, $param ) {
			if ( ! is_string( $value ) ) {
				return new WP_Error( 'invalid_param', sprintf( esc_html__( '%s must be a string.', 'jetpack' ), $param ) );
			}
			return true;
		}

		/**
		 * Register Rest API routes for the design library.
		 */
		public function register_route() {
			register_rest_route( 'wp/v2', '/stk_design_library(?:/(?P<reset>reset))?', array(
				'methods' => 'GET',
				'callback' => array( $this, 'get_design_library' ),
				'args' => array( 'reset' ),
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				}
			) );

			register_rest_route( 'wp/v2', '/stk_block_designs/(?P<block>[\w\d-]+)', array(
				'methods' => 'GET',
				'callback' => array( $this, 'get_block_designs' ),
				'args' => array(
					'block' => array(
						'validate_callback' => __CLASS__ . '::validate_string'
					),
				),
			) );

			register_rest_route( 'wp/v2', '/stk_design/(?P<design>[\w\d-]+)', array(
				'methods' => 'GET',
				'callback' => array( $this, 'get_design' ),
				'args' => array(
					'design' => array(
						'validate_callback' => __CLASS__ . '::validate_string'
					),
				),
			) );
		}

		/**
		 * Deletes all caches.
		 */
		public function delete_cache() {
			// Delete design library.
			delete_transient( 'stackable_get_design_library' );

			// Delete block designs.
			global $wpdb;
			$transients = $wpdb->get_col( "SELECT option_name FROM $wpdb->options WHERE option_name LIKE '_transient_stackable_get_block_designs_%'" );

			if ( $transients ) {
				foreach ( $transients as $transient ) {
					$transient = preg_replace( '/^_transient_/i', '', $transient );
					delete_transient( $transient );
				}
			}

			// Delete designs.
			$transients = $wpdb->get_col( "SELECT option_name FROM $wpdb->options WHERE option_name LIKE '_transient_stackable_get_design_%'" );

			if ( $transients ) {
				foreach ( $transients as $transient ) {
					$transient = preg_replace( '/^_transient_/i', '', $transient );
					delete_transient( $transient );
				}
			}
		}

		public function _get_design_library() {
			$designs = get_transient( 'stackable_get_design_library' );

			// Fetch designs.
			if ( empty( $designs ) ) {

				$response = wp_remote_get( trailingslashit( STACKABLE_CLOUDFRONT_URL ) . 'library/library.json' );
				$content = wp_remote_retrieve_body( $response );
				$designs = json_decode( $content, true );

				// Cache results.
				set_transient( 'stackable_get_design_library', $designs, DAY_IN_SECONDS );
			}

			return apply_filters( 'stackable_design_library', $designs );
		}

		/**
		 * Gets and caches library designs.
		 */
		public function get_design_library( $request ) {
			if ( $request->get_param( 'reset' ) ) {
				$this->delete_cache();
			}

			return rest_ensure_response( $this->_get_design_library() );
		}

		public function get_block_designs( $request ) {
			$block = $request->get_param( 'block' );

			$designs = get_transient( 'stackable_get_block_designs_' . $block );

			// Fetch designs.
			if ( empty( $designs ) ) {

				$response = wp_remote_get( trailingslashit( STACKABLE_CLOUDFRONT_URL ) . 'library/block-' . $block . '.json' );
				$content = wp_remote_retrieve_body( $response );
				$designs = json_decode( $content, true );

				// Cache results.
				set_transient( 'stackable_get_block_designs_' . $block, $designs, DAY_IN_SECONDS );
			}

			$designs = apply_filters( 'stackable_block_design_' . $block, $designs );

			return rest_ensure_response( $designs );
		}

		public function get_design( $request ) {
			$design_id = $request->get_param( 'design' );

			$design = get_transient( 'stackable_get_design_' . $design_id );

			// Fetch designs.
			if ( empty( $design ) ) {

				// Get the template Url.
				$designs = $this->_get_design_library();
				$template_url = $designs[ $design_id ]['template'];

				$response = wp_remote_get( $template_url );
				$content = wp_remote_retrieve_body( $response );
				$design = json_decode( $content, true );

				// Cache results.
				set_transient( 'stackable_get_design_' . $design_id, $design, DAY_IN_SECONDS );
			}

			$design = apply_filters( 'stackable_design_' . $design_id, $design );

			return rest_ensure_response( $design );
		}
	}

	new Stackable_Design_Library();
}
