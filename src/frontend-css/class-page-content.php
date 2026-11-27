<?php
/**
 * What's on the page: the Stackable blocks and the Stackable CSS classes.
 *
 * Step 1 of the frontend CSS loading (see src/frontend-css.php). We collect:
 *
 * - the Stackable blocks on the page (to pick the block stylesheets),
 * - the Stackable CSS classes in the HTML, e.g. stk-block-heading (to keep
 *   only the CSS rules that can match),
 * - the most columns a Columns block has (for rules like
 *   .stk-block-column:nth-child(3)).
 *
 * They come from two places: the content we know about before the <head>
 * is printed (the post content and the block widgets, see
 * add_known_content()), and every block when it's rendered.
 *
 * @since 3.21.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Frontend_CSS_Page_Content' ) ) {

	class Stackable_Frontend_CSS_Page_Content {

		/**
		 * The Stackable blocks on the page, e.g. [ 'heading' => true ]
		 *
		 * @var array
		 */
		private static $blocks = array();

		/**
		 * The Stackable CSS classes on the page, e.g. [ 'stk-block-heading' => true ]
		 *
		 * @var array
		 */
		private static $classes = array();

		/**
		 * The most columns a Columns block on the page has.
		 *
		 * @var int
		 */
		private static $max_columns = 0;

		/**
		 * The classes of the printed <body> tag, null until it's printed.
		 *
		 * @var array|null
		 */
		private static $printed_body_classes = null;

		/**
		 * The body classes from get_body_class(), read once.
		 *
		 * @var array|null
		 */
		private static $body_classes = null;

		/**
		 * How deep the block being rendered is (1 = a top-level block), so we
		 * only process the HTML of top-level blocks (it has the HTML of the
		 * blocks inside them).
		 *
		 * @var int
		 */
		private static $block_depth = 0;

		public static function add_hooks() {
			add_filter( 'body_class', array( __CLASS__, 'remember_body_classes' ), PHP_INT_MAX );
			add_filter( 'render_block_data', array( __CLASS__, 'before_block_render' ), 1, 3 );
			add_filter( 'render_block', array( __CLASS__, 'after_block_render' ), 999, 2 );
		}

		/**
		 * Whether a Stackable block is on the page.
		 *
		 * @param string $name e.g. heading
		 * @return bool
		 */
		public static function has_block( $name ) {
			return isset( self::$blocks[ $name ] );
		}

		/**
		 * The Stackable blocks on the page.
		 *
		 * @return array e.g. [ 'heading', 'columns' ]
		 */
		public static function get_block_names() {
			return array_keys( self::$blocks );
		}

		/**
		 * The most columns a Columns block on the page has.
		 *
		 * @return int
		 */
		public static function get_max_columns() {
			return self::$max_columns;
		}

		/**
		 * A short text that changes when more blocks, classes or columns are
		 * found. The printer uses it to skip work when nothing changed.
		 *
		 * @return string
		 */
		public static function get_change_marker() {
			return count( self::$classes ) . '|' . count( self::$blocks ) . '|' . self::$max_columns;
		}

		/**
		 * Content we know will be on the page before the <head> is printed
		 * (the post content, and block widgets in classic themes). Its CSS
		 * can then be printed in the <head> right away.
		 *
		 * @param string $content Block markup.
		 */
		public static function add_known_content( $content ) {
			if ( ! Stackable_Frontend_CSS::is_enabled() || ! is_string( $content ) ) {
				return;
			}
			$block_names = Stackable_Frontend_CSS_Block_Styles::get_block_names_in_content( $content );
			if ( count( $block_names ) ) {
				foreach ( $block_names as $block_name ) {
					self::$blocks[ substr( $block_name, strlen( 'stackable/' ) ) ] = true;
				}
				// Nested columns are counted together, that only keeps more rules.
				$columns = substr_count( $content, '<!-- wp:stackable/column ' ) + substr_count( $content, '<!-- wp:stackable/column -->' );
				self::$max_columns = max( self::$max_columns, $columns );
			}
			self::add_classes_from_html( $content );
		}

		/**
		 * Adds the Stackable classes in some HTML.
		 *
		 * @param string $html
		 */
		public static function add_classes_from_html( $html ) {
			if ( ! preg_match_all( '/\sclass=(?:"([^"]*)"|\'([^\']*)\')/', $html, $matches ) ) {
				return;
			}
			foreach ( $matches[1] as $i => $class_attribute ) {
				// The class was in single quotes.
				if ( $class_attribute === '' ) {
					$class_attribute = $matches[2][ $i ];
				}
				$has_our_classes = strpos( $class_attribute, 'stk-' ) !== false ||
					strpos( $class_attribute, 'ugb-' ) !== false ||
					strpos( $class_attribute, 'has-text-align-' ) !== false;
				if ( ! $has_our_classes ) {
					continue;
				}
				foreach ( preg_split( '/\s+/', $class_attribute, -1, PREG_SPLIT_NO_EMPTY ) as $class ) {
					self::$classes[ $class ] = true;
				}
			}
		}

		/**
		 * The classes on the page so far, including the <body> classes.
		 * Classes our own scripts add are already counted in the rule data.
		 *
		 * @return array class => true
		 */
		public static function get_classes() {
			$classes = self::$classes;
			foreach ( self::get_body_classes() as $class ) {
				$classes[ $class ] = true;
			}
			return $classes;
		}

		/**
		 * The classes of the <body> tag.
		 *
		 * @return array
		 */
		private static function get_body_classes() {
			$is_page = ! wp_doing_ajax() && function_exists( 'get_body_class' ) && did_action( 'wp' );

			// AJAX / REST: there's no <body>. The content is added to a page
			// that has one, so use the classes we add to every page.
			if ( ! $is_page ) {
				return array_merge( Stackable_Init::get_theme_compatibility_classes(), self::get_global_body_classes() );
			}

			// The <body> was printed: only its classes can match. Our global
			// settings may add their classes too late for it, e.g. when only
			// a page builder renders the blocks, after the <body> tag.
			if ( self::$printed_body_classes !== null ) {
				return self::$printed_body_classes;
			}

			if ( self::$body_classes === null ) {
				self::$body_classes = get_body_class();
			}
			return self::$body_classes;
		}

		/**
		 * Remembers the classes of the <body> tag. The <body> is printed
		 * after wp_head and before wp_body_open. Later get_body_class()
		 * calls (e.g. in the footer) aren't for the <body> tag.
		 *
		 * @param array $classes
		 * @return array The same classes.
		 */
		public static function remember_body_classes( $classes ) {
			if ( did_action( 'wp_head' ) && ! did_action( 'wp_body_open' ) ) {
				self::$printed_body_classes = array_values( array_filter( (array) $classes, 'is_string' ) );
			}
			return $classes;
		}

		/**
		 * The classes of the printed <body> tag.
		 *
		 * @return array|null Null if the <body> wasn't printed yet.
		 */
		public static function get_printed_body_classes() {
			return self::$printed_body_classes;
		}

		/**
		 * The body classes our global settings add to every page (design
		 * system and color schemes). Used where there's no <body>, like
		 * AJAX and REST responses. An extra class only keeps more rules.
		 *
		 * @return array
		 */
		public static function get_global_body_classes() {
			$classes = array();
			if ( get_option( 'stackable_global_spacing_and_borders' ) ) {
				$classes[] = 'stk-has-design-system-spacing-and-borders';
			}
			if ( get_option( 'stackable_global_buttons_and_icons' ) ) {
				$classes[] = 'stk-has-design-system-buttons-and-icons';
			}
			$color_scheme_css = get_option( 'stackable_global_color_scheme_generated_css' );
			if ( $color_scheme_css && class_exists( 'Stackable_Global_Color_Schemes' ) ) {
				$classes = array_merge( $classes, Stackable_Global_Color_Schemes::get_color_scheme_body_classes( $color_scheme_css ) );
			}
			return $classes;
		}

		/**
		 * Runs before a block is rendered: one level deeper.
		 *
		 * @param array $parsed_block
		 * @param array $source_block
		 * @param WP_Block|null $parent_block
		 * @return array The same block.
		 */
		public static function before_block_render( $parsed_block, $source_block = null, $parent_block = null ) {
			// A top-level block: start from 0 again, in case a block before
			// it never finished rendering (a plugin can skip that).
			$is_top_level = $parent_block === null && func_num_args() >= 3;
			if ( $is_top_level ) {
				self::$block_depth = 0;
			}
			self::$block_depth++;
			return $parsed_block;
		}

		/**
		 * Runs after a block is rendered: notes the block, and for top-level
		 * blocks, processes their HTML.
		 *
		 * @param string $block_content
		 * @param array $block
		 * @return string
		 */
		public static function after_block_render( $block_content, $block ) {
			self::$block_depth = max( 0, self::$block_depth - 1 );
			if ( ! Stackable_Frontend_CSS::is_enabled() ) {
				return $block_content;
			}

			$block_name = isset( $block['blockName'] ) ? $block['blockName'] : '';
			if ( $block_name && strpos( $block_name, 'stackable/' ) === 0 ) {
				self::add_rendered_block( $block );
			}

			$is_top_level = self::$block_depth === 0;
			if ( ! $is_top_level || ! is_string( $block_content ) || strpos( $block_content, 'stk-' ) === false ) {
				return $block_content;
			}

			$block_content = Stackable_Frontend_CSS_Color_Schemes::add_markers( $block_content );
			self::add_classes_from_html( $block_content );
			$block_content = Stackable_Frontend_CSS_Injected_Content::maybe_mark_content( $block_content );
			return Stackable_Frontend_CSS_Printer::maybe_print_late_css( $block_content );
		}

		/**
		 * Notes a rendered Stackable block and its number of columns.
		 *
		 * @param array $block
		 */
		private static function add_rendered_block( $block ) {
			self::$blocks[ substr( $block['blockName'], strlen( 'stackable/' ) ) ] = true;
			if ( empty( $block['innerBlocks'] ) ) {
				return;
			}
			$columns = 0;
			foreach ( $block['innerBlocks'] as $inner_block ) {
				if ( isset( $inner_block['blockName'] ) && $inner_block['blockName'] === 'stackable/column' ) {
					$columns++;
				}
			}
			self::$max_columns = max( self::$max_columns, $columns );
		}
	}
}
