<?php
/**
 * Custom breakpoints (Settings > Responsiveness) in our printed CSS.
 *
 * Our stylesheets use the default breakpoints (1024px for tablets, 768px for
 * mobile). When the site has custom breakpoints, src/dynamic-breakpoints.php
 * changes the media queries of the CSS we pass to the stackable_frontend_css
 * filter. This class decides which of our CSS goes through that filter.
 *
 * @since 3.21.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Frontend_CSS_Breakpoints' ) ) {

	class Stackable_Frontend_CSS_Breakpoints {

		/**
		 * Whether the site has custom breakpoints.
		 *
		 * @return bool
		 */
		public static function has_custom_breakpoints() {
			// Answered by Stackable_Dynamic_Breakpoints.
			return (bool) apply_filters( 'stackable_frontend_css_has_custom_breakpoints', false );
		}

		/**
		 * Adjusts the media queries of a stylesheet's CSS to the custom
		 * breakpoints.
		 *
		 * The Premium stylesheets are left as they are: before v3.21.0 the
		 * custom breakpoints were only applied to the free responsive
		 * stylesheet, so the Premium styles always used the default
		 * breakpoints (e.g. horizontal Premium cards stack at 767px).
		 * Adjusting them now would change how existing sites look.
		 *
		 * @param string $handle The stylesheet.
		 * @param string $css Its CSS.
		 * @return string
		 */
		public static function adjust_css( $handle, $css ) {
			$is_premium = strpos( $handle, 'premium' ) !== false;
			if ( $is_premium || strpos( $css, '@media' ) === false || ! self::has_custom_breakpoints() ) {
				return $css;
			}
			return apply_filters( 'stackable_frontend_css', $css );
		}
	}
}
