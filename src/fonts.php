<?php
/**
 * Loads the Google Fonts used in Stackable blocks in the frontend.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'str_ends_with' ) ) {
	/**
	 * This function is only available in PHP 8.0 and above.
	 *
	 * @param {string} $haystack
	 * @param {string} $needle
	 * @return {boolean}
	 */
    function str_ends_with( $haystack, $needle ) {
        $needle_len = strlen( $needle );
        return ( $needle_len === 0 || 0 === substr_compare( $haystack, $needle, - $needle_len ) );
    }
}

if ( ! class_exists( 'Stackable_Theme_Fonts' ) ) {
	class Stackable_Theme_Fonts {

		public static $theme_fonts = false;

		function __construct() {
			add_action( 'rest_api_init', array( $this, 'register_rest_fields' ) );
		}


		public static function gather_theme_fonts() {
			if ( self::$theme_fonts !== false ) {
				return self::$theme_fonts;
			}
			self::$theme_fonts = [];

			if ( ! method_exists( 'WP_Font_Face_Resolver', 'get_fonts_from_theme_json' ) ) {
				return self::$theme_fonts;
			}

			$theme_fonts = WP_Font_Face_Resolver::get_fonts_from_theme_json();

			foreach ( $theme_fonts as $key => $value ) {
				self::$theme_fonts[] = $value[ 0 ][ 'font-family' ];
			}

			return self::$theme_fonts;
		}

		public static function is_theme_font( $font_name ) {
			return in_array( strtolower( $font_name ), self::gather_theme_fonts() );
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
			$response = self::gather_theme_fonts();

			return new WP_REST_Response( $response, 200 );
		}

	}

	new Stackable_Theme_Fonts();
}


if ( ! class_exists( 'Stackable_Google_Fonts' ) ) {
  class Stackable_Google_Fonts {

		public static $google_fonts = [];

		function __construct() {
			if ( is_frontend() ) {
				add_filter( 'render_block', array( $this, 'gather_google_fonts' ), 10, 2 );
			}
		}

		public function gather_google_fonts( $block_content, $block ) {
			if ( $block_content === null ) {
				return $block_content;
			}

			if ( ! isset( $block['blockName'] ) || ( strpos( $block['blockName'], 'stackable/' ) === false && strpos( $block['blockName'], 'ugb/' ) === false ) ) {
				return $block_content;
			}

			if ( stripos( $block_content, 'family' ) !== false ) {
				foreach ( $block['attrs'] as $attr_name => $font_name ) {
					// Check if the attribute name ends with 'fontfamily'.
					if ( strcasecmp( substr( $attr_name, -10 ), 'fontfamily' ) === 0 ) {
						self::register_font( $font_name );
					}
				}
			}

			return $block_content;
		}

		public static function enqueue_frontend_block_fonts() {
			self::enqueue_google_fonts( array_unique( self::$google_fonts ) );
		}

		public static function is_web_font( $font_name ) {
			return ! in_array( strtolower( $font_name ), [ 'serif', 'sans-serif', 'monospace', 'serif-alt' ] );
		}

		public function is_stackable_block( $block_name ) {
			if ( ! empty( $block_name ) ) {
				return strpos( $block_name, 'ugb/' ) === 0 || strpos( $block_name, 'stackable/' ) === 0;
			}
			return false;
		}

		public static function register_font( $font_name ) {
			if ( ! self::is_web_font( $font_name ) ) {
				return;
			}

			if ( Stackable_Theme_Fonts::is_theme_font( $font_name ) ) {
				return;
			}

			if ( ! in_array( $font_name, self::$google_fonts ) ) {
				// Allow themes to disable enqueuing fonts, helpful for custom fonts.
				if ( apply_filters( 'stackable_enqueue_font', true, $font_name ) ) {
					self::$google_fonts[] = $font_name;

					// Enqueue the fonts in the footer.
					add_filter( 'wp_footer', array( 'Stackable_Google_Fonts', 'enqueue_frontend_block_fonts' ) );
				}
			}
		}

		/**
		 * Based on: https://github.com/elementor/elementor/blob/bc251b81afb626c4c47029aea8a762566524a811/includes/frontend.php#L647
		 */
		public static function enqueue_google_fonts( $google_fonts, $handle = 'stackable-google-fonts' ) {
			if ( ! count( $google_fonts ) ) {
				return;
			}

			foreach ( $google_fonts as &$font ) {
				if ( ! empty( $font ) ) {
					$font = str_replace( ' ', '+', $font ) . ':100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic';
				}
			}

			$fonts_url = sprintf( 'https://fonts.googleapis.com/css?family=%s&display=swap', implode( rawurlencode( '|' ), $google_fonts ) );

			$subsets = [
				'ru_RU' => 'cyrillic',
				'bg_BG' => 'cyrillic',
				'he_IL' => 'hebrew',
				'el' => 'greek',
				'vi' => 'vietnamese',
				'uk' => 'cyrillic',
				'cs_CZ' => 'latin-ext',
				'ro_RO' => 'latin-ext',
				'pl_PL' => 'latin-ext',
			];

			$locale = get_locale();
			if ( isset( $subsets[ $locale ] ) ) {
				$fonts_url .= '&subset=' . $subsets[ $locale ];
			}

			wp_enqueue_style( $handle, $fonts_url ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
		}

	}

	new Stackable_Google_Fonts();
}
