<?php
/**
 * Prints our CSS as one inline <style>.
 *
 * Step 4 of the frontend CSS loading (see src/frontend-css.php).
 *
 * WordPress would print each of our stylesheets as its own <link>. Instead,
 * we take them out of WordPress's list, and print one inline
 * <style id="stk-frontend-css-inline-css"> with the CSS of all of them, in
 * print order, trimmed to the rules that can match the page.
 *
 * Blocks can be rendered after the <head> was printed, e.g. widgets in
 * classic themes, or blocks in the footer. If they need more rules, we print
 * a second <style> (stk-frontend-css-2-inline-css) before them. When the
 * page is done, we move all the CSS back into the first <style>, so our CSS
 * comes before the theme's CSS, like the old big stylesheet did. WordPress
 * 6.9+ gives us the finished page through its template output buffer, below
 * 6.9 we buffer the page ourselves.
 *
 * @since 3.21.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Frontend_CSS_Printer' ) ) {

	class Stackable_Frontend_CSS_Printer {

		/**
		 * The id of the late <style> tags, e.g. stk-frontend-css-2-inline-css.
		 */
		const LATE_STYLE_ID_PATTERN = '/^stk-frontend-css-\d+-inline-css$/';

		/**
		 * Our stylesheet handles waiting to be printed or already printed.
		 *
		 * @var array
		 */
		private static $handles = array();

		/**
		 * All the CSS printed so far, in print order.
		 *
		 * @var string
		 */
		private static $printed_css = '';

		/**
		 * The handles and page content when the CSS was last made, to skip
		 * making it again when nothing changed.
		 *
		 * @var string
		 */
		private static $last_state = '';

		/**
		 * How many <style> tags were printed.
		 *
		 * @var int
		 */
		private static $print_count = 0;

		/**
		 * Whether the first <style> was printed in the <head>.
		 *
		 * @var bool
		 */
		private static $first_print_in_head = false;

		public static function add_hooks() {
			add_filter( 'print_styles_array', array( __CLASS__, 'combine_styles' ), 20 );

			// Buffer the page so the CSS of late blocks can be moved to the
			// first <style>. WordPress 6.9+ only buffers the page if a filter
			// is added before the template is loaded.
			add_action( 'wp_before_include_template', array( __CLASS__, 'buffer_page' ), 10 );
			if ( ! function_exists( 'wp_start_template_enhancement_output_buffer' ) ) {
				add_filter( 'template_include', array( __CLASS__, 'buffer_page_below_wp_6_9' ), PHP_INT_MAX );
			}
		}

		/**
		 * Whether some of our CSS was printed.
		 *
		 * @return bool
		 */
		public static function has_printed_css() {
			return self::$print_count > 0;
		}

		/**
		 * All the CSS printed so far.
		 *
		 * @return string
		 */
		public static function get_printed_css() {
			return self::$printed_css;
		}

		/**
		 * Replaces our stylesheets in the list WordPress is about to print
		 * with one inline <style>, placed where the first of them was.
		 *
		 * @param array $handles The stylesheets WordPress will print.
		 * @return array
		 */
		public static function combine_styles( $handles ) {
			global $wp_styles;

			$our_handles = array();
			$first_position = null;
			foreach ( $handles as $position => $handle ) {
				$is_combined_style = strpos( $handle, 'stk-frontend-css' ) === 0;
				$is_ours = Stackable_Frontend_CSS_Stylesheets::get_print_order( $handle ) !== false;
				if ( $is_combined_style || ! $is_ours ) {
					continue;
				}
				$our_handles[] = $handle;
				if ( $first_position === null ) {
					$first_position = $position;
				}
				// We print it, so WordPress shouldn't.
				if ( ! in_array( $handle, $wp_styles->done, true ) ) {
					$wp_styles->done[] = $handle;
				}
			}

			$handles = array_values( array_diff( $handles, $our_handles ) );
			self::$handles = array_unique( array_merge( self::$handles, $our_handles ) );
			if ( ! count( self::$handles ) ) {
				return $handles;
			}

			$combined_handle = self::register_combined_style( self::$handles );
			if ( $combined_handle ) {
				$position = $first_position === null ? count( $handles ) : min( $first_position, count( $handles ) );
				array_splice( $handles, $position, 0, array( $combined_handle ) );
			}
			return $handles;
		}

		/**
		 * Registers an inline style with the combined CSS, if it changed
		 * since the last time it was printed.
		 *
		 * @param array $handles Our stylesheets.
		 * @return string|false The style handle, or false if nothing to print.
		 */
		private static function register_combined_style( $handles ) {
			$css = self::get_new_css( $handles );
			if ( $css === false ) {
				return false;
			}
			// stk-frontend-css, then stk-frontend-css-2, stk-frontend-css-3, ...
			$handle = 'stk-frontend-css' . ( self::$print_count > 1 ? '-' . self::$print_count : '' );
			wp_register_style( $handle, false, array(), null );
			wp_add_inline_style( $handle, $css );
			return $handle;
		}

		/**
		 * The CSS to print now, or false if nothing changed since the last print.
		 *
		 * The first time, it's all the CSS. After that, it's the CSS from
		 * the first new rule onwards (see get_css_from_first_change()).
		 *
		 * @param array $handles Our stylesheets.
		 * @return string|false
		 */
		private static function get_new_css( $handles ) {
			$state = implode( ',', $handles ) . '|' . Stackable_Frontend_CSS_Page_Content::get_change_marker();
			if ( $state === self::$last_state ) {
				return false;
			}
			self::$last_state = $state;

			$css = self::get_combined_css( $handles );
			if ( $css === self::$printed_css || $css === '' ) {
				return false;
			}

			$previous_css = self::$printed_css;
			self::$printed_css = $css;
			self::$print_count++;
			if ( self::$print_count === 1 ) {
				self::$first_print_in_head = doing_action( 'wp_head' );
			}
			return $previous_css ? self::get_css_from_first_change( $previous_css, $css ) : $css;
		}

		/**
		 * The CSS of our stylesheets in print order, with only the rules
		 * that can match the page.
		 *
		 * @param array $handles Our stylesheets.
		 * @return string
		 */
		public static function get_combined_css( $handles ) {
			$classes = Stackable_Frontend_CSS_Page_Content::get_classes();
			$handles = self::add_shared_handles( $handles );
			$handles = Stackable_Frontend_CSS_Stylesheets::sort_by_print_order( array_unique( $handles ) );

			$css = '';
			foreach ( $handles as $handle ) {
				if ( ! self::is_stylesheet_needed( $handle ) ) {
					continue;
				}
				$css .= self::get_stylesheet_css( $handle, $classes );
			}
			return $css;
		}

		/**
		 * Adds the optional shared stylesheets (color schemes, design
		 * system, theme). We print only their rules that match, so it's safe
		 * to always add them.
		 *
		 * @param array $handles
		 * @return array
		 */
		private static function add_shared_handles( $handles ) {
			if ( ! in_array( 'ugb-style-css', $handles, true ) ) {
				return $handles;
			}
			foreach ( Stackable_Frontend_CSS_Stylesheets::get_shared_style_files() as $handle => $file ) {
				if ( $file && ! in_array( $handle, $handles, true ) ) {
					$handles[] = $handle;
				}
			}
			return $handles;
		}

		/**
		 * Block stylesheets are only needed for blocks on the page.
		 *
		 * @param string $handle
		 * @return bool
		 */
		private static function is_stylesheet_needed( $handle ) {
			$block = Stackable_Frontend_CSS_Stylesheets::get_block_name_from_handle( $handle );
			if ( $block === false || Stackable_Frontend_CSS_Block_Styles::is_loading_all() ) {
				return true;
			}
			return Stackable_Frontend_CSS_Page_Content::has_block( $block );
		}

		/**
		 * The CSS of one stylesheet: its inline styles added before it, its
		 * file (trimmed), and its inline styles added after it.
		 *
		 * @param string $handle
		 * @param array $classes The classes on the page.
		 * @return string
		 */
		private static function get_stylesheet_css( $handle, $classes ) {
			global $wp_styles;
			$css = '';

			$inline_before = isset( $wp_styles ) ? $wp_styles->get_data( $handle, 'before' ) : false;
			if ( is_array( $inline_before ) ) {
				$css .= implode( '', array_filter( $inline_before, 'is_string' ) );
			}

			$path = Stackable_Frontend_CSS_Stylesheets::get_file_path( $handle );
			if ( $path ) {
				if ( Stackable_Frontend_CSS_Block_Styles::is_loading_all() ) {
					$file_css = Stackable_Frontend_CSS_Color_Schemes::use_old_selectors( (string) file_get_contents( $path ) );
				} else {
					$file_css = Stackable_Frontend_CSS_Rules::get_matching_css( $path, $classes, Stackable_Frontend_CSS_Page_Content::get_max_columns() );
				}
				$css .= Stackable_Frontend_CSS_Breakpoints::adjust_css( $handle, $file_css );
			}

			$inline_after = isset( $wp_styles ) ? $wp_styles->get_data( $handle, 'after' ) : false;
			if ( is_array( $inline_after ) ) {
				$css .= implode( '', array_filter( $inline_after, 'is_string' ) );
			}
			return $css;
		}

		/**
		 * The CSS from the first new rule onwards.
		 *
		 * Our CSS is always in print order and only gets more rules. When we
		 * print again, the rules before the first new one were already
		 * printed in the same order, so printing from there gives the same
		 * cascade as printing everything again. Example:
		 *
		 *     printed before: .a{} .c{}
		 *     the CSS now:    .a{} .b{} .c{}
		 *     we print:       .b{} .c{}
		 *
		 * @param string $printed_css The CSS printed before.
		 * @param string $css The CSS now.
		 * @return string
		 */
		public static function get_css_from_first_change( $printed_css, $css ) {
			$length = min( strlen( $printed_css ), strlen( $css ) );
			// Where the last whole rule (or @media block) before the first
			// difference ends.
			$cut = 0;
			$depth = 0;
			$quote = '';
			for ( $i = 0; $i < $length && $printed_css[ $i ] === $css[ $i ]; $i++ ) {
				$char = $css[ $i ];
				if ( $quote !== '' ) {
					// Inside a string, e.g. content:"}"
					if ( $char === '\\' ) {
						$i++;
					} elseif ( $char === $quote ) {
						$quote = '';
					}
				} elseif ( $char === '"' || $char === "'" ) {
					$quote = $char;
				} elseif ( $char === '{' ) {
					$depth++;
				} elseif ( $char === '}' ) {
					$depth--;
					if ( $depth === 0 ) {
						$cut = $i + 1;
					}
				}
			}
			return substr( $css, $cut );
		}

		/**
		 * For a block rendered after the <head> styles were printed, or
		 * rendered over AJAX / REST: prints the extra CSS it needs (if any)
		 * in a <style> before it.
		 *
		 * @param string $block_content The HTML of a top-level block.
		 * @return string
		 */
		public static function maybe_print_late_css( $block_content ) {
			$is_late = did_action( 'wp_print_footer_scripts' );
			$is_injected = Stackable_Frontend_CSS_Injected_Content::is_injected_request();
			if ( ! $is_late && ! $is_injected ) {
				return $block_content;
			}

			// admin-ajax is an admin request, our frontend styles (and the
			// global settings styles printed with them) aren't registered there.
			if ( $is_injected && ! wp_style_is( 'ugb-style-css-nodep', 'registered' ) && is_callable( array( 'Stackable_Init', 'register_frontend_assets' ) ) ) {
				Stackable_Init::register_frontend_assets();
			}

			self::$handles = self::get_handles_for_late_css();
			$css = self::get_new_css( self::$handles );
			if ( $css === false ) {
				return $block_content;
			}
			if ( $is_injected ) {
				$css = Stackable_Frontend_CSS_Injected_Content::scope_css( $css );
			}
			return sprintf( "<style id='stk-frontend-css-%d-inline-css'>%s</style>", self::$print_count, $css ) . $block_content;
		}

		/**
		 * Our stylesheets needed for the blocks found so far.
		 *
		 * @return array
		 */
		private static function get_handles_for_late_css() {
			global $wp_styles;
			$handles = array( 'ugb-style-css', 'ugb-style-css-responsive' );

			// The global settings styles, if they have any.
			foreach ( array( 'ugb-block-style-inheritance-nodep', 'ugb-style-css-nodep' ) as $handle ) {
				if ( isset( $wp_styles->registered[ $handle ] ) && $wp_styles->get_data( $handle, 'after' ) ) {
					$handles[] = $handle;
				}
			}

			$registry = WP_Block_Type_Registry::get_instance();
			foreach ( Stackable_Frontend_CSS_Page_Content::get_block_names() as $name ) {
				$block_type = $registry->get_registered( 'stackable/' . $name );
				if ( $block_type && ! empty( $block_type->style_handles ) ) {
					$handles = array_merge( $handles, $block_type->style_handles );
				} elseif ( Stackable_Frontend_CSS_Stylesheets::get_block_style_handle( 'stackable/' . $name ) ) {
					$handles[] = Stackable_Frontend_CSS_Stylesheets::get_block_style_handle( 'stackable/' . $name );
				}
			}

			$our_handles = array();
			foreach ( array_unique( array_merge( self::$handles, $handles ) ) as $handle ) {
				if ( Stackable_Frontend_CSS_Stylesheets::get_print_order( $handle ) !== false ) {
					$our_handles[] = $handle;
				}
			}
			return $our_handles;
		}

		/**
		 * Buffers the page, so move_late_css_to_first_style() gets the whole
		 * page (WordPress 6.9+).
		 */
		public static function buffer_page() {
			if ( self::can_buffer_page() ) {
				add_filter( 'wp_template_enhancement_output_buffer', array( __CLASS__, 'move_late_css_to_first_style' ), 20 );
			}
		}

		/**
		 * Buffers the page ourselves (WordPress below 6.9).
		 *
		 * @param string $template
		 * @return string The same template.
		 */
		public static function buffer_page_below_wp_6_9( $template ) {
			if ( is_string( $template ) && $template !== '' && self::can_buffer_page() ) {
				ob_start( array( __CLASS__, 'move_late_css_to_first_style' ) );
			}
			return $template;
		}

		/**
		 * Whether we can buffer the page. The stackable_frontend_css_finalize_in_buffer
		 * filter turns it off, e.g. if it conflicts with another plugin
		 * that buffers the page. The late CSS then stays where it was printed.
		 *
		 * @return bool
		 */
		private static function can_buffer_page() {
			return apply_filters( 'stackable_frontend_css_finalize_in_buffer', true );
		}

		/**
		 * Moves the CSS of the late <style> tags into the first one, so the
		 * CSS cascade is the same as if all of it was in the <head>.
		 *
		 * Only if the first <style> is in the <head>. If it was printed late
		 * (e.g. only a widget has Stackable blocks in a classic theme), the
		 * old big stylesheet was printed late too.
		 *
		 * @param string $html The whole page.
		 * @return string
		 */
		public static function move_late_css_to_first_style( $html ) {
			if ( self::$print_count < 2 || ! self::$first_print_in_head || ! is_string( $html ) ) {
				return $html;
			}
			$merged_html = self::merge_style_tags( $html, self::$printed_css, 'stk-frontend-css-inline-css' );
			return $merged_html === false ? $html : $merged_html;
		}

		/**
		 * Puts $css in the first of our <style> tags in the HTML and removes
		 * our later <style> tags.
		 *
		 * @param string $html
		 * @param string $css
		 * @param string|null $first_style_id The id the first of our <style> tags must
		 *                                    have, or null for the first late one.
		 * @return string|false The new HTML, or false if there was nothing to merge.
		 */
		public static function merge_style_tags( $html, $css, $first_style_id = null ) {
			if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
				return false;
			}
			$tags = new WP_HTML_Tag_Processor( $html );
			// Below WordPress 6.7, the text of a <style> can't be changed.
			if ( ! method_exists( $tags, 'set_modifiable_text' ) ) {
				return false;
			}

			$found_first = false;
			$emptied_count = 0;
			while ( $tags->next_tag( 'STYLE' ) ) {
				$id = $tags->get_attribute( 'id' );
				if ( ! is_string( $id ) || strpos( $id, 'stk-frontend-css' ) !== 0 ) {
					continue;
				}
				$is_late_style = preg_match( self::LATE_STYLE_ID_PATTERN, $id ) === 1;

				if ( ! $found_first ) {
					if ( $first_style_id === null && ! $is_late_style ) {
						continue;
					}
					// Printed in another way, leave the page as it is.
					if ( $first_style_id !== null && $id !== $first_style_id ) {
						return false;
					}
					if ( ! $tags->set_modifiable_text( $css ) ) {
						return false;
					}
					$found_first = true;
				} elseif ( $is_late_style ) {
					$tags->set_modifiable_text( '' );
					$emptied_count++;
				}
			}
			if ( ! $found_first || ! $emptied_count ) {
				return false;
			}

			// Remove the emptied <style> tags.
			return preg_replace( '/<style id=([\'"])stk-frontend-css-\d+-inline-css\1[^>]*>\s*<\/style>\n?/', '', $tags->get_updated_html() );
		}
	}
}
