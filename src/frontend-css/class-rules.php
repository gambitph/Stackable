<?php
/**
 * Keeps only the CSS rules that can match the page.
 *
 * Step 3 of the frontend CSS loading (see src/frontend-css.php).
 *
 * Next to each stylesheet, the build writes a .rules file (see
 * .config/frontend-css-rules.js) with one CSS rule per line, and for each
 * selector, the Stackable classes an element needs for it to match. For
 * example, this line (the columns are separated by tabs):
 *
 *     r    (max-width:767px)    stk-block-heading    .stk-block-heading h2    margin:0
 *
 * means: a rule inside @media (max-width:767px), with the selector
 * ".stk-block-heading h2", that can only match if the stk-block-heading
 * class is on the page. If it isn't, we don't print the rule.
 *
 * @since 3.21.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Frontend_CSS_Rules' ) ) {

	class Stackable_Frontend_CSS_Rules {

		/**
		 * Separates the selectors (and their conditions) of one rule.
		 */
		const SELECTOR_SEPARATOR = "\x1f";

		/**
		 * The CSS of a stylesheet, with only the rules that can match.
		 *
		 * @param string $path The stylesheet file.
		 * @param array $classes The classes on the page, class => true.
		 * @param int $max_columns The most columns a Columns block on the page has.
		 * @return string
		 */
		public static function get_matching_css( $path, $classes, $max_columns ) {
			$rules_file = substr( $path, 0, -strlen( '.css' ) ) . '.rules';
			// No rule data (e.g. a stylesheet of another plugin): use it all.
			if ( substr( $path, -strlen( '.css' ) ) !== '.css' || ! file_exists( $rules_file ) ) {
				return (string) file_get_contents( $path );
			}
			$rules = file_get_contents( $rules_file );
			if ( ! $rules ) {
				return '';
			}

			$css = '';
			$current_media = '';
			// The result of each condition, see get_matching_selectors().
			$condition_results = array( '' => true );

			// strtok() reads one line at a time, so we don't make an array of all the lines.
			for ( $line = strtok( $rules, "\n" ); $line !== false; $line = strtok( "\n" ) ) {
				$columns = explode( "\t", $line, 5 );
				if ( count( $columns ) !== 5 ) {
					continue;
				}
				list( $kind, $media, $conditions, $selectors, $declarations ) = $columns;

				if ( $kind === 'x' ) {
					// Other at-rules (e.g. @font-face, @keyframes) are always printed.
					$rule = $declarations;
				} else {
					$selectors = explode( self::SELECTOR_SEPARATOR, $selectors );
					$conditions = explode( self::SELECTOR_SEPARATOR, $conditions );
					$matching_selectors = self::get_matching_selectors( $selectors, $conditions, $classes, $max_columns, $condition_results );
					if ( ! count( $matching_selectors ) ) {
						continue;
					}
					// A rule with vendor-prefixed selectors (e.g. ::-moz-selection)
					// is ignored by browsers that don't know one of them. Keep all
					// of its selectors so it works the same way as before.
					if ( $kind === 'h' ) {
						$matching_selectors = $selectors;
					}
					$rule = implode( ',', $matching_selectors ) . '{' . $declarations . '}';
				}

				// Close the previous @media and / or open a new one.
				if ( $media !== $current_media ) {
					if ( $current_media !== '' ) {
						$css .= '}';
					}
					if ( $media !== '' ) {
						$css .= '@media ' . $media . '{';
					}
					$current_media = $media;
				}
				$css .= $rule;
			}

			if ( $current_media !== '' ) {
				$css .= '}';
			}
			return $css;
		}

		/**
		 * The selectors of a rule whose conditions match the page.
		 *
		 * @param array $selectors e.g. array( '.stk-a .stk-b', '.stk-c' )
		 * @param array $conditions The condition of each selector, e.g. array( 'stk-a stk-b', 'stk-c' )
		 * @param array $classes The classes on the page, class => true.
		 * @param int $max_columns
		 * @param array $condition_results The results so far, condition => bool. Conditions repeat a lot.
		 * @return array
		 */
		private static function get_matching_selectors( $selectors, $conditions, $classes, $max_columns, &$condition_results ) {
			$matching_selectors = array();
			foreach ( $conditions as $i => $condition ) {
				if ( ! isset( $condition_results[ $condition ] ) ) {
					$condition_results[ $condition ] = self::condition_matches( $condition, $classes, $max_columns );
				}
				if ( $condition_results[ $condition ] && isset( $selectors[ $i ] ) ) {
					$matching_selectors[] = $selectors[ $i ];
				}
			}
			return $matching_selectors;
		}

		/**
		 * Whether the condition of a selector matches the page.
		 *
		 * A condition is a list of parts separated by spaces, all of them
		 * must match:
		 *
		 * - stk-foo        the class must be on the page
		 * - stk-a|stk-b    one of the classes must be on the page (from :is() / :where())
		 * - #3             a Columns block with at least 3 columns must be on the page
		 *
		 * @param string $condition e.g. "stk-block-columns #3"
		 * @param array $classes The classes on the page, class => true.
		 * @param int $max_columns
		 * @return bool
		 */
		public static function condition_matches( $condition, $classes, $max_columns ) {
			foreach ( explode( ' ', $condition ) as $part ) {
				if ( $part[0] === '#' ) {
					$columns_needed = (int) substr( $part, 1 );
					if ( $max_columns < $columns_needed ) {
						return false;
					}
				} elseif ( strpos( $part, '|' ) !== false ) {
					if ( ! self::has_any_class( explode( '|', $part ), $classes ) ) {
						return false;
					}
				} elseif ( ! isset( $classes[ $part ] ) ) {
					return false;
				}
			}
			return true;
		}

		/**
		 * Whether one of these classes is on the page.
		 *
		 * @param array $class_names
		 * @param array $classes The classes on the page, class => true.
		 * @return bool
		 */
		private static function has_any_class( $class_names, $classes ) {
			foreach ( $class_names as $class_name ) {
				if ( isset( $classes[ $class_name ] ) ) {
					return true;
				}
			}
			return false;
		}
	}
}
