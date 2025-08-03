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
		const API_VERSION = 'v4';

		/**
		 * Constructor
		 */
		public function __construct() {
			add_action( 'rest_api_init', array( $this, 'register_route' ) );

			add_action( 'stackable_delete_design_library_cache', array( $this, 'delete_cache_v3' ) );
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

		public static function validate_url( $value, $request, $param ) {
			if ( ! filter_var( $value, FILTER_VALIDATE_URL ) || ! wp_http_validate_url( $value ) ) {
				return new WP_Error( 'invalid_param', sprintf( esc_html__( '%s must be a valid URL.', STACKABLE_I18N ), $param ) );
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
			register_rest_route( 'stackable/v3', '/design_library_image', array(
				'methods' => 'POST',
				'callback' => array( $this, 'get_design_library_image' ),
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
				'args' => array(
					'image_url' => array(
						'required' => true,
						'sanitize_callback' => 'esc_url_raw',
						'validate_callback' => __CLASS__ . '::validate_url'
					),
				),
			) );
		}

		/**
		 * Deletes all design library v3 caches.
		 */
		public function delete_cache_v3() {
			// Delete design library.
			delete_transient( 'stackable_get_design_library' );

			// Delete designs.
			global $wpdb;
			// This should be okay without using caching since function is used to clear cache.
			$transients = $wpdb->get_col( "SELECT option_name FROM $wpdb->options WHERE option_name LIKE '_transient_stackable_get_design_%'" );

			if ( $transients ) {
				foreach ( $transients as $transient ) {
					$transient = preg_replace( '/^_transient_/i', '', $transient );
					delete_transient( $transient );
				}
			}
		}

		public function delete_cache() {
			// Delete design library.
			delete_transient( 'stackable_get_design_library_json_v4' );
			delete_transient( 'stackable_get_design_library_v4' );

			do_action( 'stackable_delete_design_library_cache' );
		}

		public function get_design_library_image( $request ) {
			if ( ! function_exists( 'media_handle_sideload' ) ) {
				require_once ABSPATH . 'wp-admin/includes/media.php';
			}
			if ( ! function_exists( 'download_url' ) ) {
				require_once ABSPATH . 'wp-admin/includes/file.php';
			}
			if ( ! function_exists( 'wp_read_image_metadata' ) ) {
				require_once ABSPATH . 'wp-admin/includes/image.php';
			}

			$url = $request->get_param( 'image_url' );

			$basename = sanitize_file_name( wp_basename( parse_url( $url, PHP_URL_PATH ) ) );

			$args = array(
				'post_type' 		=> 'attachment',
				'post_status'		=> 'inherit',
				'posts_per_page'	=> 1,
				'meta_query'		=> array(
					array(
						'key' => '_wp_attached_file',
						'value' => $basename,
						'compare' => 'LIKE'
					)
				)
			);

			$attachments = new WP_Query( $args );

			if ( $attachments->have_posts() ) {
				$attachments->the_post();
				$media_id = get_the_ID();
				$media_url = wp_get_attachment_url( $media_id );

				wp_reset_postdata();

				return new WP_REST_Response( array(
					'success' => true,
					'new_url' => $media_url,
					'old_url' => $url
				), 200 );
			}

			$temp_filepath = download_url( $url );

			if ( is_wp_error( $temp_filepath ) ) {
				return new WP_REST_Response( array(
					'success' => false,
					'message' => $temp_filepath->get_error_message()
				), 500 );
			}

			if ( ! file_exists( $temp_filepath ) || ! wp_filesize( $temp_filepath ) ) {
				wp_delete_file( $temp_filepath );
				return new WP_REST_Response( array(
					'success' => false,
					// This is a custom check so we return a custom error message.
					'message' => 'Invalid file content retrieved from the provided URL.'
				), 400 );
			}

			$valid_mimes = [ 'image/jpeg' => 1, 'image/jpg' => 1, 'image/png' => 1, 'image/gif' => 1, 'image/webp' => 1, 'video/mp4' => 1 ];

			$file_array = array(
				'name' => $basename,
				'type' => mime_content_type( $temp_filepath ),
				'tmp_name' => $temp_filepath,
				'size' => wp_filesize( $temp_filepath )
			);

			if ( ! isset( $valid_mimes[ $file_array[ 'type' ] ] )
				|| ( strpos( $file_array[ 'type' ], 'image/' ) === 0
					&& ! wp_getimagesize( $temp_filepath )
				)
			) {
				wp_delete_file( $temp_filepath );
				return new WP_REST_Response( array(
					'success' => false,
					// This is a custom check so we return a custom error message.
					'message' => 'The file is not a valid image/video.'
				), 400 );
			}

			$media_id = media_handle_sideload( $file_array, 0, null, array(
				'post_mime_type' => $file_array[ 'type' ],
				'post_title' => sanitize_text_field( pathinfo( $file_array[ 'name' ], PATHINFO_FILENAME ) ),
				'post_status' => 'inherit'
			) );

			if ( file_exists( $temp_filepath ) ) {
				wp_delete_file( $temp_filepath );
			}

			if ( is_wp_error( $media_id ) ) {
				return new WP_REST_Response( array(
					'success' => false,
					'message' =>  $media_id->get_error_message()
				), 500 );
			}

			$media_url = wp_get_attachment_url( $media_id );

			return new WP_REST_Response( array(
				'success' => true,
				'new_url' => $media_url,
				'old_url' => $url
			), 200 );
		}

		public function get_design_library_from_cloud() {
			$designs = get_transient( 'stackable_get_design_library_v4' );

			// Fetch designs.
			if ( empty( $designs ) ) {
				$designs = array();
				$content = null;

				$response = wp_remote_get( self::get_cdn_url() . 'library-v4/library.json' );

				if ( is_wp_error( $response ) ) {
					// Add our error message so we can see it in the network tab.
					$designs['wp_remote_get_error'] = array(
						'code' => $response->get_error_code(),
						'message' => $response->get_error_message(),
					);
				} else {
					$content_body = wp_remote_retrieve_body( $response );
					$designs = apply_filters( 'stackable_design_library_retreive_body', $content_body );
					$designs = json_decode( $designs, true );

					$content = array();
					foreach ( $designs as $design_id => $design ) {
						$content[ $design_id ] = array(
							'title'			=> $design[ 'label' ],
							'content' 		=> $design[ 'template' ],
							'category'	 	=> $design[ 'category' ],
							'description'	=> $design[ 'description' ],
							'plan'			=> $design[ 'plan' ],
							'designId'		=> $design_id
						);
					}

					// Add our error message so we can see it in the network tab.
					if ( empty( $content ) ) {
						$designs['content_error'] = array(
							'message' => $content_body,
						);
					}

				}

				// We add the latest designs in the `v4` area.
				$designs[ self::API_VERSION ] = $content;

				// Allow deprecated code to fetch other designs
				$designs = apply_filters( 'stackable_fetch_design_library', $designs );

				// Cache results.
				set_transient( 'stackable_get_design_library_v4', $designs, 7 * DAY_IN_SECONDS );
			}

			return apply_filters( 'stackable_design_library', $designs );
		}

		/**
		 * Gets and caches library designs.
		 */
		public function get_design_library( $request ) {
			$reset = $request->get_param( 'reset' );
			if ( $reset ) {
				$this->delete_cache();
			}

			return rest_ensure_response( $this->get_design_library_from_cloud() );
		}


		/**
		 * Gets the URL of the CDN where to load our design library data.  When
		 * developer mode for the design library is turned on, the URL of the
		 * design library internal exporter tool will be used instead.
		 */
		public static function get_cdn_url() {
			return trailingslashit( STACKABLE_DESIGN_LIBRARY_URL );
		}
	}

	new Stackable_Design_Library();
}
