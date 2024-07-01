<?php
// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Theme_Fonts' ) ) {
	class Stackable_Theme_Fonts {

		function __construct() {
			add_action( 'rest_api_init', array( $this, 'register_rest_fields' ) );
		}

		public function register_rest_fields() {
			// API endpoint for getting theme fonts
			register_rest_route( 'stackable/v3', '/get_theme_fonts', array(
				'methods' => 'GET',
				'callback' => array( $this, 'get_theme_fonts' ),
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			) );
		}

		/**
		 * REST Callback. Get all theme fonts.
		 *
		 * @return array
		 */
		public static function get_theme_fonts() {
			if ( ! method_exists( 'WP_Font_Face_Resolver', 'get_fonts_from_theme_json' ) ) {
				return false;
			}

			$theme_fonts = WP_Font_Face_Resolver::get_fonts_from_theme_json();

			$response = array();
			foreach ( $theme_fonts as $key => $value ) {
				$response[] = array(
					'label' => $value[ 0 ][ 'font-family' ],
					'value' => $value[ 0 ][ 'font-family' ],
				);
			}

			return new WP_REST_Response( $response, 200 );
		}

	}

	new Stackable_Theme_Fonts();
}
