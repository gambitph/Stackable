<?php
/**
 * Which block stylesheets WordPress loads.
 *
 * Step 2 of the frontend CSS loading (see src/frontend-css.php). Each
 * Stackable block has its own stylesheet (stk-block-{block}), registered as
 * the block's `style`. Usually WordPress only loads the stylesheets of the
 * blocks it renders ("on demand"). This class:
 *
 * - registers the block stylesheets,
 * - loads the stylesheets of the blocks in the post content early, so they
 *   are known when the <head> is printed,
 * - loads them all when the stackable_force_css_load filter is on,
 * - handles sites where WordPress loads every block stylesheet on every page.
 *
 * @since 3.21.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Frontend_CSS_Block_Styles' ) ) {

	class Stackable_Frontend_CSS_Block_Styles {

		/**
		 * True when every block stylesheet is loaded (the
		 * stackable_force_css_load filter is on). Rules are then not trimmed.
		 *
		 * @var bool
		 */
		private static $is_loading_all = false;

		/**
		 * The block stylesheets we loaded ourselves, handle => true.
		 *
		 * @var array
		 */
		private static $wanted_block_styles = array();

		public static function add_hooks() {
			add_action( 'init', array( __CLASS__, 'register_block_styles' ), 9 );
			add_action( 'enqueue_block_assets', array( __CLASS__, 'dequeue_unused_block_styles' ), 11 );
			add_filter( 'render_block', array( __CLASS__, 'enqueue_rendered_block_style' ), 10, 2 );
		}

		/**
		 * Whether every block stylesheet is loaded (stackable_force_css_load).
		 *
		 * @return bool
		 */
		public static function is_loading_all() {
			return self::$is_loading_all;
		}

		/**
		 * Registers the block stylesheets early, so blocks can use them as
		 * their `style` when they are registered.
		 */
		public static function register_block_styles() {
			$manifest = Stackable_Frontend_CSS_Stylesheets::get_manifest();
			$print_order = Stackable_Frontend_CSS_Stylesheets::ORDER_BLOCKS;
			foreach ( array_keys( $manifest['blocks'] ) as $name ) {
				$handle = 'stk-block-' . $name;
				$file = 'dist/blocks/' . $name . '.css';
				wp_register_style( $handle, plugins_url( $file, STACKABLE_FILE ), array( 'ugb-style-css' ), STACKABLE_VERSION );
				Stackable_Frontend_CSS_Stylesheets::add_file_path( $handle, plugin_dir_path( STACKABLE_FILE ) . $file );
				// The manifest lists the blocks in the order of the old big stylesheet.
				wp_style_add_data( $handle, Stackable_Frontend_CSS_Stylesheets::PRINT_ORDER_KEY, $print_order );
				$print_order++;
			}
		}

		/**
		 * Loads the stylesheets of these blocks.
		 *
		 * @param array $block_names e.g. [ 'stackable/heading' ]
		 */
		public static function enqueue_block_styles( $block_names ) {
			if ( ! Stackable_Frontend_CSS::is_enabled() ) {
				return;
			}
			$registry = WP_Block_Type_Registry::get_instance();
			foreach ( array_unique( $block_names ) as $block_name ) {
				$block_type = $registry->get_registered( $block_name );
				if ( ! $block_type || empty( $block_type->style_handles ) ) {
					continue;
				}
				foreach ( $block_type->style_handles as $handle ) {
					self::$wanted_block_styles[ $handle ] = true;
					wp_enqueue_style( $handle );
				}
			}
		}

		/**
		 * Loads the stylesheets of every Stackable block. Used by the
		 * stackable_force_css_load filter, for sites where scripts add
		 * Stackable blocks we can't know about.
		 */
		public static function enqueue_all_block_styles() {
			self::$is_loading_all = true;
			$block_names = array();
			foreach ( array_keys( WP_Block_Type_Registry::get_instance()->get_all_registered() ) as $block_name ) {
				if ( strpos( $block_name, 'stackable/' ) === 0 ) {
					$block_names[] = $block_name;
				}
			}
			self::enqueue_block_styles( $block_names );
		}

		/**
		 * The Stackable block names in some block markup.
		 *
		 * @param string $content Block markup, e.g. the post content.
		 * @return array e.g. [ 'stackable/heading', 'stackable/columns' ]
		 */
		public static function get_block_names_in_content( $content ) {
			if ( ! is_string( $content ) || ! preg_match_all( '/<!-- wp:stackable\/([a-z0-9-]+)/', $content, $matches ) ) {
				return array();
			}
			$block_names = array();
			foreach ( $matches[1] as $name ) {
				// "<!-- wp:stackable/icon-list-" is the start of
				// "stackable/icon-list-item", not a block.
				$block_names[] = 'stackable/' . rtrim( $name, '-' );
			}
			return array_values( array_unique( $block_names ) );
		}

		/**
		 * The content of the block widgets that have Stackable blocks.
		 *
		 * Classic themes print the widgets after the <head>, so we read
		 * them early to know their blocks when the <head> is printed. Block
		 * themes have no widgets.
		 *
		 * @return array Block markup of each widget.
		 */
		public static function get_block_widgets_with_stackable_blocks() {
			if ( ! Stackable_Frontend_CSS::is_enabled() || wp_is_block_theme() ) {
				return array();
			}
			$widgets = get_option( 'widget_block' );
			if ( ! is_array( $widgets ) ) {
				return array();
			}
			$contents = array();
			$has_stackable_blocks = false;
			foreach ( $widgets as $widget ) {
				if ( ! is_array( $widget ) || empty( $widget['content'] ) ) {
					continue;
				}
				$contents[] = $widget['content'];
				if ( count( self::get_block_names_in_content( $widget['content'] ) ) ) {
					$has_stackable_blocks = true;
				}
			}
			return $has_stackable_blocks ? $contents : array();
		}

		/**
		 * Whether WordPress loads block stylesheets only for the blocks it
		 * renders (block themes, and classic themes since WordPress 6.9).
		 *
		 * @return bool
		 */
		public static function block_assets_on_demand() {
			if ( function_exists( 'wp_should_load_block_assets_on_demand' ) ) {
				return wp_should_load_block_assets_on_demand();
			}
			return wp_should_load_separate_core_block_assets();
		}

		/**
		 * When block assets aren't loaded on demand, WordPress loads the
		 * stylesheets of all registered blocks on every page. Before, pages
		 * without Stackable blocks had no Stackable CSS at all, so remove the
		 * block stylesheets we didn't ask for. They also need the shared
		 * stylesheet, which isn't registered on pages without Stackable
		 * blocks (WordPress 6.9.1+ shows a notice for that). Example: an
		 * Elementor page with the Hello theme.
		 *
		 * The stylesheets of blocks that are rendered later are loaded again
		 * by enqueue_rendered_block_style().
		 */
		public static function dequeue_unused_block_styles() {
			if ( ! is_frontend() || self::$is_loading_all || self::block_assets_on_demand() ) {
				return;
			}
			global $wp_styles;
			if ( empty( $wp_styles ) ) {
				return;
			}
			foreach ( $wp_styles->queue as $handle ) {
				$is_block_style = strpos( $handle, 'stk-block-' ) === 0;
				if ( $is_block_style && empty( self::$wanted_block_styles[ $handle ] ) ) {
					wp_dequeue_style( $handle );
				}
			}
		}

		/**
		 * Loads the stylesheet of a rendered Stackable block, when WordPress
		 * doesn't do it itself (block assets not loaded on demand).
		 *
		 * @param string $block_content
		 * @param array $block
		 * @return string The same content.
		 */
		public static function enqueue_rendered_block_style( $block_content, $block ) {
			$is_stackable_block = ! empty( $block['blockName'] ) && strpos( $block['blockName'], 'stackable/' ) === 0;
			if ( ! $is_stackable_block || self::$is_loading_all || ! is_frontend() || self::block_assets_on_demand() ) {
				return $block_content;
			}
			self::enqueue_block_styles( array( $block['blockName'] ) );
			return $block_content;
		}
	}
}
