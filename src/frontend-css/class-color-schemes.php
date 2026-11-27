<?php
/**
 * The color scheme marker class.
 *
 * The color scheme rules in the old big stylesheet start with a long list of
 * selectors ($stk-has-color-schemes-selector in src/styles/cssvars.scss), e.g.
 *
 *     :where([class*='stk--background-scheme'], ..., .stk--has-container-scheme .stk-container:not(.stk--no-background)) .stk-block p { ... }
 *
 * Attribute selectors like [class*='stk--background-scheme'] can't be
 * trimmed by class (see class-rules.php), so the split stylesheets use one
 * marker class instead:
 *
 *     :where(.stk-has-scheme) .stk-block p { ... }
 *
 * and here we add that marker class to every element the long list matched.
 * The <body> gets it from the color schemes setting when there's a base
 * scheme (see Stackable_Global_Color_Schemes::get_color_scheme_body_classes()).
 *
 * @since 3.21.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Frontend_CSS_Color_Schemes' ) ) {

	class Stackable_Frontend_CSS_Color_Schemes {

		/**
		 * The marker class (the build uses the same name, see gulpfile.js).
		 */
		const MARKER = 'stk-has-scheme';

		/**
		 * The selector list the marker replaces. A test checks that it's the
		 * same as $stk-has-color-schemes-selector in src/styles/cssvars.scss.
		 */
		const OLD_SELECTORS = "[class*='stk--background-scheme'],[class*='stk--container-scheme'],.stk--has-base-scheme,.stk--has-background-scheme .stk-block-background,.stk--has-container-scheme .stk-container:not(.stk--no-background)";

		/**
		 * Which color schemes are set, see get_scheme_flags().
		 *
		 * @var array|null
		 */
		private static $scheme_flags = null;

		public static function add_hooks() {
			// Premium runs this on posts it renders itself (load more button).
			add_filter( 'stackable_process_frontend_html', array( __CLASS__, 'add_markers' ) );
			add_filter( 'stackable_color_scheme_body_classes', array( __CLASS__, 'add_body_marker' ) );
		}

		/**
		 * The base scheme styles the <body>, so the <body> gets the marker
		 * class too.
		 *
		 * @param array $classes The color scheme body classes, e.g. array( 'stk--has-base-scheme' )
		 * @return array e.g. array( 'stk--has-base-scheme', 'stk-has-scheme' )
		 */
		public static function add_body_marker( $classes ) {
			if ( in_array( 'stk--has-base-scheme', $classes, true ) ) {
				$classes[] = self::MARKER;
			}
			return $classes;
		}

		/**
		 * Adds the marker class to every element the old selector list matched:
		 *
		 * - elements with a color scheme class: [class*='stk--background-scheme'], [class*='stk--container-scheme']
		 * - .stk--has-background-scheme .stk-block-background
		 * - .stk--has-container-scheme .stk-container:not(.stk--no-background)
		 *
		 * (.stk--has-base-scheme is the <body>, it gets the marker with its classes.)
		 *
		 * @param string $html
		 * @return string
		 */
		public static function add_markers( $html ) {
			if ( ! is_string( $html ) || $html === '' ) {
				return $html;
			}

			// The default background / container schemes apply to all
			// backgrounds / containers. Elements with a color scheme class
			// always get the marker, the old selector list matched them even
			// without global color schemes.
			$flags = self::get_scheme_flags();
			$has_scheme_classes = strpos( $html, '-scheme' ) !== false;
			$check_backgrounds = $flags['background'] && strpos( $html, 'stk-block-background' ) !== false;
			$check_containers = $flags['container'] && strpos( $html, 'stk-container' ) !== false;
			if ( ! $has_scheme_classes && ! $check_backgrounds && ! $check_containers ) {
				return $html;
			}

			$tags = new WP_HTML_Tag_Processor( $html );
			while ( $tags->next_tag() ) {
				$class = $tags->get_attribute( 'class' );
				if ( ! is_string( $class ) || $class === '' ) {
					continue;
				}
				$has_scheme_class = strpos( $class, 'stk--background-scheme' ) !== false || strpos( $class, 'stk--container-scheme' ) !== false;
				$is_background = $check_backgrounds && $tags->has_class( 'stk-block-background' );
				$is_container = $check_containers && $tags->has_class( 'stk-container' ) && ! $tags->has_class( 'stk--no-background' );
				if ( $has_scheme_class || $is_background || $is_container ) {
					$tags->add_class( self::MARKER );
				}
			}
			return $tags->get_updated_html();
		}

		/**
		 * Which default color schemes are set, like the color scheme body
		 * classes stk--has-background-scheme and stk--has-container-scheme.
		 *
		 * @return array [ 'background' => bool, 'container' => bool ]
		 */
		public static function get_scheme_flags() {
			// The <body> was printed: use its classes. They don't have the
			// color scheme classes if the global styles loaded after it
			// (e.g. only a page builder renders the blocks).
			$printed_body_classes = Stackable_Frontend_CSS_Page_Content::get_printed_body_classes();
			if ( $printed_body_classes !== null && ! wp_doing_ajax() ) {
				return array(
					'background' => in_array( 'stk--has-background-scheme', $printed_body_classes, true ),
					'container' => in_array( 'stk--has-container-scheme', $printed_body_classes, true ),
				);
			}

			if ( self::$scheme_flags === null ) {
				$color_scheme_css = get_option( 'stackable_global_color_scheme_generated_css' );
				$classes = $color_scheme_css ? Stackable_Global_Color_Schemes::get_color_scheme_body_classes( $color_scheme_css ) : array();
				self::$scheme_flags = array(
					'background' => in_array( 'stk--has-background-scheme', $classes, true ),
					'container' => in_array( 'stk--has-container-scheme', $classes, true ),
				);
			}
			return self::$scheme_flags;
		}

		/**
		 * Puts the old selector list back in place of the marker.
		 *
		 * Used when all styles are loaded (stackable_force_css_load): then
		 * scripts can add Stackable markup after the page loads, and that
		 * markup doesn't have the marker class PHP adds. The marker is always
		 * inside :where(), so the specificity stays the same.
		 *
		 * @param string $css
		 * @return string
		 */
		public static function use_old_selectors( $css ) {
			$marker = ':where(.' . self::MARKER . ')';
			if ( strpos( $css, $marker ) === false ) {
				return $css;
			}
			return str_replace( $marker, ':where(' . self::OLD_SELECTORS . ')', $css );
		}
	}
}
