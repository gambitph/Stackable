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

			add_filter( 'stackable_design_library_get_premium_designs', array( $this, 'get_designs_with_disabled_blocks' ) );
			add_filter( 'stackable_design_library_get_premium_designs', array( $this, 'get_premium_designs' ) );
			add_action( 'init', array( $this, 'register_design_pattern' ) );
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
			$designs = $this->get_design_library_from_cloud();

			$library = $designs[ self::API_VERSION ];
			foreach ( $library as $design_id => $design ) {
				if ( WP_Block_Patterns_Registry::get_instance()->is_registered( 'stackable_' . $design_id ) ) {
					$res = unregister_block_pattern( 'stackable_' . $design_id );
				}

				if ( WP_Block_Pattern_Categories_Registry::get_instance()->is_registered( 'stackable_' . $design[ 'category' ] ) ) {
					$res = unregister_block_pattern_category( 'stackable_' . $design[ 'category' ] );
				}
			}
			// Delete design library.
			delete_transient( 'stackable_get_design_library_v4' );
			delete_transient( 'stackable_get_design_library_json_v4' );

			$this->register_design_pattern();

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

		public function filter_patterns( $pattern ) {
			return strpos( $pattern[ 'name' ], 'stackable_' ) !== false;
		}

		public function get_design_library_from_cloud() {
			$designs = get_transient( 'stackable_get_design_library_json_v4' );

			// Fetch designs.
			if ( empty( $designs ) ) {
				$designs = array();
				$content = null;

				// Add ignoreCache to retrieve the updated file
				$response = wp_remote_get( self::get_cdn_url() . 'library-v4/library.json?ignoreCache=1' );

				if ( is_wp_error( $response ) ) {
					// Add our error message so we can see it in the network tab.
					$designs['wp_remote_get_error'] = array(
						'code' => $response->get_error_code(),
						'message' => $response->get_error_message(),
					);
				} else {
					$content_body = wp_remote_retrieve_body( $response );
					$content = apply_filters( 'stackable_design_library_retreive_body', $content_body );
					$content = json_decode( $content, true );

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
				set_transient( 'stackable_get_design_library_json_v4', $designs, DAY_IN_SECONDS );
			}

			return apply_filters( 'stackable_design_library', $designs );
		}

		public function _get_design_library( $outside_init = false ) {
			$designs = get_transient( 'stackable_get_design_library_v4' );
			// Fetch designs.
			if ( empty( $designs ) ) {
				$designs = array();
				$content = array();

				$block_patterns = WP_Block_Patterns_Registry::get_instance()->get_all_registered( $outside_init );
				foreach ( $block_patterns as $pattern ) {
					if ( strpos( $pattern[ 'name' ], 'stackable_' ) !== false ) {
						$pattern[ 'title' ] = str_replace( sprintf( __( 'Stackable ', STACKABLE_I18N ) ), '', $pattern[ 'title' ] );
						$content[ $pattern[ 'designId' ] ] = $pattern;
					}
				}

				// Get premium designs for v4
				$content = apply_filters( 'stackable_design_library_get_premium_designs', $content );

				// We add the latest designs in the `v4` area.
				$designs[ self::API_VERSION ] = $content;

				// Allow deprecated code to fetch other designs
				$designs = apply_filters( 'stackable_fetch_design_library', $designs );

				// Cache results.
				set_transient( 'stackable_get_design_library_v4', $designs, DAY_IN_SECONDS );

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

			return rest_ensure_response( $this->_get_design_library( $reset ) );
		}

		public function get_disabled_blocks() {
			$disabled_blocks = get_option( 'stackable_block_states' );

			if ( $disabled_blocks == false ) {
				return false;
			}

			$disabled_blocks = array_filter( $disabled_blocks, function ( $block_state ) { return $block_state == 3; } );
			if ( count( $disabled_blocks ) ) {
				$disabled_blocks = array_keys( $disabled_blocks );
				$disabled_blocks = array_map( function ( $block ) { return preg_quote( $block, '/' ); }, $disabled_blocks );
				$disabled_blocks = '/' . implode( '|', $disabled_blocks ) . '/i';
				return $disabled_blocks;
			}

			return false;
		}

		public function check_for_disabled_block( $design, $disabled_blocks ) {
			if ( preg_match( $disabled_blocks, $design ) ) {
				return true;
			}

			return false;
		}

		public function get_premium_designs( $content ) {
			$designs = $this->get_design_library_from_cloud();

			$library = $designs[ self::API_VERSION ];

			$premium_designs = array();
			foreach ( $library as $design_id => $design ) {
				if ( $design[ 'plan' ] === 'premium' && sugb_fs()->can_use_premium_code() && STACKABLE_BUILD === 'premium' ) {
					continue;
				}

				$premium_designs[ $design_id ] = array(
					'title'			=> $design[ 'label' ],
					'content' 		=> $design[ 'template' ],
					'category'	 	=> $design[ 'category' ],
					'description'	=> $design[ 'description' ],
					'plan'			=> $design[ 'plan' ],
					'designId'		=> $design_id
				);
			}

			$merged = array_merge( $content, $premium_designs );

			uasort($merged, function( $design_1, $design_2 ) {
				return strnatcmp( $design_1[ 'title' ], $design_2[ 'title' ] );
			});

			return $merged;
		}

		public function get_designs_with_disabled_blocks( $content ) {
			$designs = $this->get_design_library_from_cloud();

			$library = $designs[ self::API_VERSION ];

			$designs_with_disabled = array();
			foreach ( $library as $design_id => $design ) {
				if ( isset( $content[ $design_id ] ) ) {
					continue;
				}

				$designs_with_disabled[ $design_id ] = array(
					'title'			=> $design[ 'label' ],
					'content' 		=> $design[ 'template' ],
					'category' 		=> $design[ 'category' ],
					'description'	=> $design[ 'description' ],
					'plan'			=> $design[ 'plan' ],
					'designId'		=> $design_id,
				);
			}

			$merged = array_merge( $content, $designs_with_disabled );

			uasort($merged, function( $design_1, $design_2 ) {
				return strnatcmp( $design_1[ 'title' ], $design_2[ 'title' ] );
			});

			return $merged;
		}

		public function get_category_kebab_case( $category ) {
			$category = trim( strtolower( $category ) );
			return preg_replace( '/[^a-z0-9-]+/', '-', $category );
		}

		public function get_template_with_placeholders( $template, $category ) {
			if ( ! class_exists( 'Stackable_Design_Library_Placeholders' ) ) {
				return $template;
			}

			$default_placeholders = Stackable_Design_Library_Placeholders::get_default();

			if ( ! isset( $default_placeholders[ $category ] ) ) {
				return $template;
			}

			foreach( $default_placeholders[ $category ] as $placeholder => $value ) {
				if ( ! is_string( $value ) ) {
					continue;
				}
				$template = str_replace( $placeholder, $value, $template );
			}

			return $template;
		}

		public function register_design_pattern() {
			$designs = $this->get_design_library_from_cloud();

			$library = $designs[ self::API_VERSION ];

			if ( ! $library ) {
				return;
			}


			$disabled_blocks = $this->get_disabled_blocks();


			if ( ! WP_Block_Pattern_Categories_Registry::get_instance()->is_registered( 'stackable' ) ) {
				register_block_pattern_category( 'stackable', [
					'label' => __( 'Stackable', STACKABLE_I18N ),
					'description' => __( 'Patterns for Stackable Design Library', STACKABLE_I18N ),
				] );
			}

			foreach ( $library as $design_id => $design ) {
				if ( $design[ 'plan' ] === 'premium' && ( ! sugb_fs()->can_use_premium_code() || STACKABLE_BUILD === 'free' ) ) {
					continue;
				}

				if ( $disabled_blocks ) {
					$has_disabled = $this->check_for_disabled_block( $design[ 'template' ], $disabled_blocks );
					if ( $has_disabled ) continue;
				}

				register_block_pattern_category( 'stackable_' . $this->get_category_kebab_case( $design[ 'category' ] ), [
					'label' => sprintf( __( 'Stackable %s', STACKABLE_I18N ), $design[ 'category' ] ),
					'description' => sprintf( __( '%s patterns for Stackable Design Library', STACKABLE_I18N ), $design[ 'category' ] ),
				] );

				register_block_pattern(
						'stackable_' . $design_id,
						array(
							'title'			=> sprintf( __( 'Stackable %s', STACKABLE_I18N ), $design[ 'label' ] ),
							'content' 		=> $this->get_template_with_placeholders( $design[ 'template' ], $design[ 'category' ] ),
							'categories' 	=> array( 'stackable_' . $this->get_category_kebab_case( $design[ 'category' ] ), 'stackable' ), // used in Patterns
							'category'		=> $design[ 'category' ], // used in Design Library
							'description'	=> $design[ 'description' ],
							'plan'			=> $design[ 'plan' ],
							'designId'		=> $design_id
						)
					);
			}
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
