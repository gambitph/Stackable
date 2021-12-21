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
		 * The current version of the API we're using.
		 * @var String
		 */
		const API_VERSION = 'v3';

		/**
		 * Constructor
		 */
		public function __construct() {
			add_action( 'rest_api_init', array( $this, 'register_route' ) );
			add_filter( 'stackable_design_library_retreive_body', array( $this, 'replace_dev_mode_urls' ) );
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

		/**
		 * Register Rest API routes for the design library.
		 */
		public function register_route() {
			register_rest_route( 'stackable/v2', '/design_library(?:/(?P<reset>reset))?', array(
				'methods' => 'GET',
				'callback' => array( $this, 'get_design_library' ),
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
				'args' => array(
					'reset' => array(
						'validate_callback' => __CLASS__ . '::validate_string'
					),
				),
			) );

			register_rest_route( 'stackable/v2', '/design/(?P<version>[\w\d-]*)/(?P<design>[\w\d-]+)', array(
				'methods' => 'GET',
				'callback' => array( $this, 'get_design' ),
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
				'args' => array(
					'version' => array(
						'validate_callback' => __CLASS__ . '::validate_string'
					),
					'design' => array(
						'validate_callback' => __CLASS__ . '::validate_string'
					),
				),
			) );

			register_rest_route( 'stackable/v2', '/design_library_dev_mode', array(
				'methods' => 'POST',
				'callback' => array( $this, 'set_dev_mode' ),
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
				'args' => array(
					'devmode' => array(
						'validate_callback' => __CLASS__ . '::validate_boolean'
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

			// Delete designs.
			global $wpdb;
			$transients = $wpdb->get_col( "SELECT option_name FROM $wpdb->options WHERE option_name LIKE '_transient_stackable_get_design_%'" );

			if ( $transients ) {
				foreach ( $transients as $transient ) {
					$transient = preg_replace( '/^_transient_/i', '', $transient );
					delete_transient( $transient );
				}
			}

			do_action( 'stackable_delete_design_library_cache' );
		}

		public function _get_design_library() {
			$designs = get_transient( 'stackable_get_design_library_v3' );

			// Fetch designs.
			if ( empty( $designs ) ) {
				$response = wp_remote_get( self::get_cdn_url() . 'library-v3/library.json' );
				$content = wp_remote_retrieve_body( $response );
				$content = apply_filters( 'stackable_design_library_retreive_body', $content );

				// We add the latest designs in the `v3` area.
				$designs = array(
					self::API_VERSION => json_decode( $content, true ),
				);

				// Allow deprecated code to fetch other designs
				$designs = apply_filters( 'stackable_fetch_design_library', $designs );

				// Cache results.
				set_transient( 'stackable_get_design_library_v3', $designs, DAY_IN_SECONDS );
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

		public function get_design( $request ) {
			$design_id = $request->get_param( 'design' );
			// We don't do anything with this one yet.
			$library_version = $request->get_param( 'version' );

			$design = get_transient( 'stackable_get_design_' . $design_id );

			// Fetch designs.
			if ( empty( $design ) ) {

				// Get the template Url.
				$designs = $this->_get_design_library();
				$template_url = $designs[ self::API_VERSION ][ $design_id ]['template'];

				$response = wp_remote_get( $template_url );
				$content = wp_remote_retrieve_body( $response );
				$content = apply_filters( 'stackable_design_library_retreive_body', $content );
				$design = json_decode( $content, true );

				// Cache results.
				set_transient( 'stackable_get_design_' . $design_id, $design, DAY_IN_SECONDS );
			}

			$design = apply_filters( 'stackable_design_' . $design_id, $design );

			return rest_ensure_response( $design );
		}

		/**
		 * Replaces all the URLs that use the CDN with local ones if dev mode is turned on.
		 */
		public function replace_dev_mode_urls( $content ) {
			if ( self::is_dev_mode() ) {
				$content = str_replace(
					trailingslashit( STACKABLE_CLOUDFRONT_URL ),
					trailingslashit( plugin_dir_url( STACKABLE_DLH_LIBRARY_FILE ) ),
					$content
				);
			}
			return $content;
		}

		/**
		 * Gets the URL of the CDN where to load our design library data.  When
		 * developer mode for the design library is turned on, the URL of the
		 * design library internal exporter tool will be used instead.
		 */
		public static function get_cdn_url() {
			if ( self::is_dev_mode() ) {
				return trailingslashit( plugin_dir_url( STACKABLE_DLH_LIBRARY_FILE ) );
			} else {
				return trailingslashit( STACKABLE_CLOUDFRONT_URL );
			}
		}

		public static function is_dev_mode() {
			$dev_env = defined( 'WP_ENV' ) ? WP_ENV === 'development' : false;
			$export_tool_installed = defined( 'STACKABLE_DLH_LIBRARY_FILE' );
			$library_dev_mode_toggled = !! get_option( 'stackable_library_dev_mode' );
			return $dev_env && $export_tool_installed && $library_dev_mode_toggled;
		}

		/**
		 * Set developer mode for the design library. When in developer mode,
		 * the library that will be loaded will be from the design library
		 * internal exporter tool.
		 */
		public function set_dev_mode( $request ) {
			$dev_mode = $request->get_param( 'devmode' );
			update_option( 'stackable_library_dev_mode', $dev_mode );

			return rest_ensure_response( true );
		}
	}

	new Stackable_Design_Library();
}
