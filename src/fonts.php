<?php
/**
 * Loads the Google Fonts used in Stackable blocks in the frontend.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Google_Fonts' ) ) {
  class Stackable_Google_Fonts {

		public static $google_fonts = [];

		function __construct() {
			add_filter( 'render_block', array( $this, 'gather_google_fonts' ), 10, 2 );
			add_filter( 'wp_footer', array( $this, 'enqueue_frontend_block_fonts' ) );
		}

		public function gather_google_fonts( $block_content, $block ) {
			if ( $this->is_stackable_block( $block['blockName'] ) && is_array( $block['attrs'] ) ) {
				foreach ( $block['attrs'] as $attr_name => $font_name ) {
					if ( preg_match( '/fontFamily$/i', $attr_name ) ) {
						self::register_font( $font_name );
					}
				}
			}

			return $block_content;
		}

		public function enqueue_frontend_block_fonts() {
			self::enqueue_google_fonts( array_unique( self::$google_fonts ) );
		}

		public static function is_web_font( $font_name ) {
			return ! in_array( strtolower( $font_name ), [ 'serif', 'sans-serif', 'monospace', 'serif-alt' ] );
		}

		public function is_stackable_block( $block_name ) {
			return strpos( $block_name, 'ugb/' ) === 0 || strpos( $block_name, 'stackable/' ) === 0;
		}

		public static function register_font( $font_name ) {
			if ( ! self::is_web_font( $font_name ) ) {
				return;
			}

			if ( ! in_array( $font_name, self::$google_fonts ) ) {
				// Allow themes to disable enqueuing fonts, helpful for custom fonts.
				if ( apply_filters( 'stackable_enqueue_font', true, $font_name ) ) {
					self::$google_fonts[] = $font_name;
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
