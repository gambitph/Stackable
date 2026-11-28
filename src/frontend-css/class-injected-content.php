<?php
/**
 * Blocks rendered over AJAX or the REST API, to be added to a page by a
 * script, e.g. "load more" buttons, infinite scroll, or a theme's
 * fetch() of a post.
 *
 * Part of step 5 of the frontend CSS loading (see src/frontend-css.php).
 *
 * Before v3.21.0, that content printed no CSS: the page's big stylesheet
 * already styled it. Now the page only has the rules for its own blocks,
 * so the content brings the rules it needs in a <style> before it. Those
 * rules must not restyle the blocks already on the page, so:
 *
 * - The outermost element of each block gets the stk-injected-content class.
 * - Every rule is limited to that element and the elements inside it, with
 *   :where() so the specificity stays the same. Example:
 *
 *       .stk-block-heading{margin:0}
 *   becomes
 *       .stk-block-heading:where(.stk-injected-content,.stk-injected-content *){margin:0}
 *
 * - Custom properties set on :root (e.g. the design system) are set on the
 *   outermost elements only, and the elements inside inherit them, like they
 *   inherit them from :root on the page. Example:
 *
 *       :root{--stk-icon-size:32px}
 *   becomes
 *       :where(:root) :where(.stk-injected-content){--stk-icon-size:32px}
 *
 *   (Setting them on every element inside would undo the values blocks
 *   pass down to their children, e.g. a smaller icon size in an accordion.)
 *
 * @since 3.21.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Frontend_CSS_Injected_Content' ) ) {

	class Stackable_Frontend_CSS_Injected_Content {

		/**
		 * Added to the outermost element of injected blocks.
		 */
		const CSS_CLASS = 'stk-injected-content';

		/**
		 * The CSS printed so far when each post content started rendering.
		 * A list, since a post content can render another one inside it.
		 *
		 * @var array
		 */
		private static $printed_css_at_content_start = array();

		public static function add_hooks() {
			// One <style> per post content, before its blocks.
			add_filter( 'the_content', array( __CLASS__, 'remember_printed_css' ), 0 );
			add_filter( 'the_content', array( __CLASS__, 'merge_content_css' ), PHP_INT_MAX );
		}

		/**
		 * Whether this is a REST API request. fetch() calls often don't send
		 * a JSON Accept header, so REST_REQUEST is checked too.
		 *
		 * @return bool
		 */
		public static function is_rest_request() {
			return wp_is_json_request() || ( defined( 'REST_REQUEST' ) && REST_REQUEST );
		}

		/**
		 * Whether this REST request is from the block editor (previews of
		 * server-rendered blocks, or posts loaded for editing). The editor
		 * loads all our styles, so it doesn't need CSS with the content.
		 *
		 * @return bool
		 */
		public static function is_editor_rest_request() {
			$route = isset( $GLOBALS['wp']->query_vars['rest_route'] ) ? $GLOBALS['wp']->query_vars['rest_route'] : '';
			if ( strpos( $route, '/wp/v2/block-renderer' ) === 0 ) {
				return true;
			}
			return isset( $_GET['context'] ) && $_GET['context'] === 'edit'; // phpcs:ignore WordPress.Security.NonceVerification
		}

		/**
		 * Whether this AJAX or REST request renders content for a page.
		 *
		 * @return bool
		 */
		public static function is_injected_request() {
			if ( wp_doing_ajax() ) {
				return true;
			}
			return self::is_rest_request() && ! self::is_editor_rest_request();
		}

		/**
		 * Adds the stk-injected-content class to the first element of an
		 * outermost block, when rendered over AJAX / REST. Skips the <style>
		 * we may have printed before it.
		 *
		 * @param string $html The HTML of a top-level block.
		 * @return string
		 */
		public static function maybe_mark_content( $html ) {
			if ( ! self::is_injected_request() || ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
				return $html;
			}
			$tags = new WP_HTML_Tag_Processor( $html );
			while ( $tags->next_tag() ) {
				if ( in_array( $tags->get_tag(), array( 'STYLE', 'SCRIPT', 'LINK', 'META' ), true ) ) {
					continue;
				}
				$tags->add_class( self::CSS_CLASS );
				return $tags->get_updated_html();
			}
			return $html;
		}

		/**
		 * Remembers the CSS printed so far when a post content starts.
		 *
		 * @param string $content
		 * @return string The same content.
		 */
		public static function remember_printed_css( $content ) {
			self::$printed_css_at_content_start[] = Stackable_Frontend_CSS_Printer::get_printed_css();
			return $content;
		}

		/**
		 * In AJAX / REST responses, puts the CSS of the whole post content in
		 * its first <style>, and removes the others.
		 *
		 * Each top-level block that needs more rules prints a <style> before
		 * it, with the rules from the first new one onwards. So later
		 * <style> tags come after the blocks before them, and could override
		 * their inline block styles. With one <style> at the start, all our
		 * rules come before the blocks, like the page's stylesheet in the
		 * <head> did before.
		 *
		 * (For whole pages, Stackable_Frontend_CSS_Printer::move_late_css_to_first_style()
		 * does this.)
		 *
		 * @param string $content
		 * @return string
		 */
		public static function merge_content_css( $content ) {
			$printed_css_at_start = array_pop( self::$printed_css_at_content_start );
			if ( ! is_string( $content ) || strpos( $content, 'stk-frontend-css-' ) === false ) {
				return $content;
			}
			if ( ! wp_doing_ajax() && ! self::is_rest_request() ) {
				return $content;
			}

			$printed_css = Stackable_Frontend_CSS_Printer::get_printed_css();
			if ( $printed_css_at_start ) {
				$css = Stackable_Frontend_CSS_Printer::get_css_from_first_change( $printed_css_at_start, $printed_css );
			} else {
				$css = $printed_css;
			}
			$css = self::scope_css( $css );

			$merged_content = Stackable_Frontend_CSS_Printer::merge_style_tags( $content, $css );
			return $merged_content === false ? $content : $merged_content;
		}

		/**
		 * Limits every style rule to the injected content (see the top of
		 * this file). Rules inside @media, @supports and similar are limited
		 * too. @font-face and @keyframes are left as they are.
		 *
		 * @param string $css
		 * @return string
		 */
		public static function scope_css( $css ) {
			$where = ':where(.' . self::CSS_CLASS . ',.' . self::CSS_CLASS . ' *)';
			return self::scope_css_rules( $css, $where );
		}

		/**
		 * Goes through the CSS one rule at a time, and adds $where to the
		 * selectors of each style rule.
		 *
		 * @param string $css
		 * @param string $where e.g. :where(.stk-injected-content,.stk-injected-content *)
		 * @return string
		 */
		private static function scope_css_rules( $css, $where ) {
			$scoped_css = '';
			$length = strlen( $css );
			$position = 0;
			while ( $position < $length ) {
				// The part before the "{", e.g. ".a .b" or "@media (min-width:768px)".
				$prelude_end = self::find_prelude_end( $css, $position );
				$prelude = substr( $css, $position, $prelude_end - $position );
				if ( $prelude_end >= $length ) {
					$scoped_css .= $prelude;
					break;
				}

				// A statement ending with ";" (e.g. @import) or a stray "}".
				$char = $css[ $prelude_end ];
				if ( $char !== '{' ) {
					$scoped_css .= $prelude . $char;
					$position = $prelude_end + 1;
					continue;
				}

				// The part between "{" and its matching "}".
				$block_start = $prelude_end + 1;
				$block_end = self::find_matching_brace( $css, $block_start );
				$block = substr( $css, $block_start, $block_end - $block_start );

				$scoped_css .= self::scope_rule( $prelude, $block, $where );
				$position = $block_end + 1;
			}
			return $scoped_css;
		}

		/**
		 * Scopes one rule.
		 *
		 * @param string $prelude The part before the "{".
		 * @param string $block The part between the braces.
		 * @param string $where
		 * @return string
		 */
		private static function scope_rule( $prelude, $block, $where ) {
			$trimmed_prelude = ltrim( $prelude );
			$is_at_rule = $trimmed_prelude !== '' && $trimmed_prelude[0] === '@';
			if ( ! $is_at_rule ) {
				return self::scope_selector_list( $prelude, $where ) . '{' . $block . '}';
			}
			// At-rules with style rules inside them.
			if ( preg_match( '/^@(media|supports|container|layer|document|-moz-document)\b/i', $trimmed_prelude ) ) {
				$block = self::scope_css_rules( $block, $where );
			}
			return $prelude . '{' . $block . '}';
		}

		/**
		 * Where the prelude starting at $position ends: at the next "{", ";"
		 * or "}" that isn't in a string, a comment, brackets or parentheses.
		 *
		 * @param string $css
		 * @param int $position
		 * @return int The position of the "{", ";" or "}", or the CSS length.
		 */
		private static function find_prelude_end( $css, $position ) {
			$length = strlen( $css );
			$bracket_depth = 0;
			$quote = '';
			for ( $i = $position; $i < $length; $i++ ) {
				$char = $css[ $i ];
				if ( $quote !== '' ) {
					if ( $char === '\\' ) {
						$i++;
					} elseif ( $char === $quote ) {
						$quote = '';
					}
				} elseif ( $char === '"' || $char === "'" ) {
					$quote = $char;
				} elseif ( $char === '/' && isset( $css[ $i + 1 ] ) && $css[ $i + 1 ] === '*' ) {
					// Skip the comment, the loop moves past its "/".
					$comment_end = strpos( $css, '*/', $i + 2 );
					$i = $comment_end === false ? $length : $comment_end + 1;
				} elseif ( $char === '(' || $char === '[' ) {
					$bracket_depth++;
				} elseif ( $char === ')' || $char === ']' ) {
					$bracket_depth--;
				} elseif ( $bracket_depth <= 0 && ( $char === '{' || $char === ';' || $char === '}' ) ) {
					return $i;
				}
			}
			return $length;
		}

		/**
		 * Finds the "}" that closes the block starting at $position, skipping
		 * nested blocks and strings.
		 *
		 * @param string $css
		 * @param int $position Just after the "{".
		 * @return int The position of the "}" (or the CSS length if missing).
		 */
		private static function find_matching_brace( $css, $position ) {
			$length = strlen( $css );
			$depth = 1;
			$quote = '';
			for ( $i = $position; $i < $length; $i++ ) {
				$char = $css[ $i ];
				if ( $quote !== '' ) {
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
						return $i;
					}
				}
			}
			return $length;
		}

		/**
		 * Adds $where to each selector in a list, e.g.
		 * ".a .b, .c::before" becomes ".a .b$where,.c$where::before".
		 *
		 * @param string $selectors
		 * @param string $where
		 * @return string
		 */
		public static function scope_selector_list( $selectors, $where ) {
			// Comments are not part of a selector, e.g. "/* Block style inheritance */:root".
			$selectors = preg_replace( '#/\*.*?\*/#s', '', $selectors );
			$scoped_selectors = array();
			foreach ( self::split_selector_list( $selectors ) as $selector ) {
				$scoped_selectors[] = self::scope_selector( trim( $selector ), $where );
			}
			return implode( ',', $scoped_selectors );
		}

		/**
		 * Splits a selector list at its commas, but not the commas inside
		 * :is(), :not() and similar, or attribute selectors.
		 *
		 * @param string $selectors
		 * @return array
		 */
		private static function split_selector_list( $selectors ) {
			$list = array();
			$current = '';
			$depth = 0;
			$quote = '';
			$length = strlen( $selectors );
			for ( $i = 0; $i < $length; $i++ ) {
				$char = $selectors[ $i ];
				if ( $quote !== '' ) {
					if ( $char === $quote ) {
						$quote = '';
					}
				} elseif ( $char === '"' || $char === "'" ) {
					$quote = $char;
				} elseif ( $char === '(' || $char === '[' ) {
					$depth++;
				} elseif ( $char === ')' || $char === ']' ) {
					$depth--;
				} elseif ( $char === ',' && $depth === 0 ) {
					$list[] = $current;
					$current = '';
					continue;
				}
				$current .= $char;
			}
			$list[] = $current;
			return $list;
		}

		/**
		 * Adds $where to the element a selector styles (the last part).
		 *
		 * Examples:
		 *
		 *     .a .b          => .a .b$where
		 *     .a::before     => .a$where::before
		 *     :root          => :where(:root) :where(.stk-injected-content)
		 *     .x :root       => .x :root (unchanged)
		 *
		 * @param string $selector
		 * @param string $where
		 * @return string
		 */
		private static function scope_selector( $selector, $where ) {
			$last_part_start = self::find_last_compound_selector( $selector );
			$last_part = substr( $selector, $last_part_start );
			if ( $selector === '' || $last_part === '' ) {
				return $selector;
			}

			// Custom properties on :root, html or body would change the
			// page's own blocks, so set them on the outermost injected
			// elements instead. Their children inherit them, the same way
			// all elements inherit them from :root. Both parts are in
			// :where() so that any block style still wins, like it does
			// over a value inherited from :root.
			if ( preg_match( '/^(:root|html|body)(?![\w-])/i', $last_part ) ) {
				$is_whole_selector = $last_part_start === 0;
				return $is_whole_selector ? ':where(' . $selector . ') :where(.' . self::CSS_CLASS . ')' : $selector;
			}

			// $where goes before a pseudo-element, e.g. ::before.
			$insert_at = strlen( $selector );
			if ( preg_match( '/(::?(before|after|first-line|first-letter|marker|placeholder|selection|backdrop|file-selector-button)\b|::-?[a-z-]+).*$/i', $last_part, $match, PREG_OFFSET_CAPTURE ) ) {
				$insert_at = $last_part_start + $match[0][1];
			}
			return substr( $selector, 0, $insert_at ) . $where . substr( $selector, $insert_at );
		}

		/**
		 * Where the last compound selector starts (after the last space, >,
		 * + or ~ that's not inside brackets or parentheses).
		 *
		 * @param string $selector e.g. ".a > .b:not(.c .d)"
		 * @return int e.g. the position of ".b"
		 */
		private static function find_last_compound_selector( $selector ) {
			$start = 0;
			$depth = 0;
			$length = strlen( $selector );
			for ( $i = 0; $i < $length; $i++ ) {
				$char = $selector[ $i ];
				if ( $char === '(' || $char === '[' ) {
					$depth++;
				} elseif ( $char === ')' || $char === ']' ) {
					$depth--;
				} elseif ( $depth === 0 && ( $char === ' ' || $char === '>' || $char === '+' || $char === '~' ) ) {
					$start = $i + 1;
				}
			}
			return $start;
		}
	}
}
