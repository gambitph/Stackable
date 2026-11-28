<?php
/**
 * Our frontend stylesheets: their handles, files and print order.
 *
 * Step 2 of the frontend CSS loading (see src/frontend-css.php). The build
 * (gulp style-split) splits the old big stylesheet into these files:
 *
 * - ugb-style-css                dist/frontend_core.css, the shared styles.
 * - ugb-style-css-responsive     dist/frontend_core_responsive.css, the shared
 *                                styles inside media queries.
 * - ugb-style-css-color-schemes  dist/frontend_color_schemes.css, only used
 *                                when color schemes are used.
 * - ugb-style-css-design-system  dist/frontend_design_system.css, only used
 *                                when the global Spacing & Borders or Buttons
 *                                & Icons are set.
 * - ugb-style-css-theme          dist/frontend_theme_{theme}.css, styles for
 *                                the active theme (if we have any for it).
 * - stk-block-{block}            dist/blocks/{block}.css, one per block.
 *                                Registered as the block's `style`, so
 *                                WordPress loads it only when the block is used.
 *
 * Premium adds its own per-block stylesheets (stk-block-{block}-premium),
 * printed after all of the free ones.
 *
 * @since 3.21.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Frontend_CSS_Stylesheets' ) ) {

	class Stackable_Frontend_CSS_Stylesheets {

		/**
		 * Print order of our stylesheets, lower numbers are printed first.
		 * This is the order of the rules in the old big stylesheet: the
		 * blocks (in the order they were in the big stylesheet, 100, 101,
		 * ...), then the shared styles, then the global settings styles,
		 * then Premium. Keeping this order keeps the CSS cascade the same.
		 */
		const ORDER_BLOCKS = 100;
		const ORDER_CORE = 1000;
		const ORDER_COLOR_SCHEMES = 1010;
		const ORDER_DESIGN_SYSTEM = 1020;
		const ORDER_THEME = 1030;
		const ORDER_RESPONSIVE = 1100;
		const ORDER_INHERITANCE_NODEP = 1200;
		const ORDER_NODEP = 1210;
		const ORDER_PREMIUM = 2000;

		/**
		 * The style data key where we keep the file path of a stylesheet.
		 *
		 * We don't use WordPress's own `path` key: with it, WordPress prints
		 * small stylesheets inline by itself, and we print our CSS ourselves.
		 */
		const FILE_PATH_KEY = 'stk_path';

		/**
		 * The style data key with the print order of a block stylesheet
		 * (see get_print_order()).
		 */
		const PRINT_ORDER_KEY = 'stk_order';

		/**
		 * The generated manifest, see get_manifest().
		 *
		 * @var array|null
		 */
		private static $manifest = null;

		/**
		 * The list of block stylesheets and theme stylesheets made by the
		 * build, from dist/frontend_css_manifest.php
		 *
		 * @return array [ 'blocks' => [ name => size ], 'themes' => [ slug => size ] ]
		 */
		public static function get_manifest() {
			if ( self::$manifest === null ) {
				$file = plugin_dir_path( STACKABLE_FILE ) . 'dist/frontend_css_manifest.php';
				$manifest = file_exists( $file ) ? include( $file ) : array();
				self::$manifest = wp_parse_args( $manifest, array( 'blocks' => array(), 'themes' => array() ) );
			}
			return self::$manifest;
		}

		/**
		 * Whether blocks use the old big stylesheet instead of the split
		 * ones: in the editor, and with the legacy loading (it turns this on
		 * with the stackable_frontend_css_use_big_stylesheet filter).
		 *
		 * @return bool
		 */
		public static function uses_big_stylesheet() {
			$is_editor = is_admin() && ! wp_doing_ajax();
			return (bool) apply_filters( 'stackable_frontend_css_use_big_stylesheet', $is_editor );
		}

		/**
		 * The stylesheet handle of a block.
		 *
		 * @param string $block_name e.g. stackable/heading
		 * @return string|false e.g. stk-block-heading, or false if the block has no styles.
		 */
		public static function get_block_style_handle( $block_name ) {
			$name = str_replace( 'stackable/', '', $block_name );
			$manifest = self::get_manifest();
			if ( ! isset( $manifest['blocks'][ $name ] ) ) {
				return false;
			}
			return 'stk-block-' . $name;
		}

		/**
		 * The block name of a block stylesheet handle (free or Premium).
		 *
		 * @param string $handle e.g. stk-block-posts-premium
		 * @return string|false e.g. posts, or false if it's not a block stylesheet.
		 */
		public static function get_block_name_from_handle( $handle ) {
			if ( strpos( $handle, 'stk-block-' ) !== 0 ) {
				return false;
			}
			$name = substr( $handle, strlen( 'stk-block-' ) );
			if ( substr( $name, -strlen( '-premium' ) ) === '-premium' ) {
				$name = substr( $name, 0, -strlen( '-premium' ) );
			}
			return $name;
		}

		/**
		 * The `style` a block is registered with (see src/blocks.php).
		 *
		 * @param string $block_name e.g. stackable/heading
		 * @return string|array
		 */
		public static function get_block_style( $block_name ) {
			if ( self::uses_big_stylesheet() ) {
				return 'ugb-style-css';
			}
			$handle = self::get_block_style_handle( $block_name );
			return $handle ? array( $handle ) : 'ugb-style-css';
		}

		/**
		 * The files of the shared stylesheets.
		 *
		 * @return array handle => file in the plugin folder, or false when
		 *               the handle has no file (it's then registered empty).
		 */
		public static function get_shared_style_files() {
			// The responsive styles are separate there too, the color scheme,
			// design system and theme styles are inside the big stylesheet.
			if ( self::uses_big_stylesheet() ) {
				return array(
					'ugb-style-css' => 'dist/frontend_blocks.css',
					'ugb-style-css-responsive' => 'dist/frontend_blocks_responsive.css',
					'ugb-style-css-color-schemes' => false,
					'ugb-style-css-design-system' => false,
					'ugb-style-css-theme' => false,
				);
			}

			$theme_file = false;
			$theme = self::get_theme_slug();
			$manifest = self::get_manifest();
			if ( $theme && isset( $manifest['themes'][ $theme ] ) ) {
				$theme_file = 'dist/frontend_theme_' . $theme . '.css';
			}

			return array(
				'ugb-style-css' => 'dist/frontend_core.css',
				'ugb-style-css-responsive' => 'dist/frontend_core_responsive.css',
				'ugb-style-css-color-schemes' => 'dist/frontend_color_schemes.css',
				'ugb-style-css-design-system' => 'dist/frontend_design_system.css',
				'ugb-style-css-theme' => $theme_file,
			);
		}

		/**
		 * The slug of the active theme, if we have compatibility styles for it.
		 *
		 * @return string e.g. twentytwentyone, or empty.
		 */
		public static function get_theme_slug() {
			$classes = Stackable_Init::get_theme_compatibility_classes();
			if ( ! count( $classes ) ) {
				return '';
			}
			// stk--is-twentytwentyone-theme => twentytwentyone
			return preg_replace( '/^stk--is-(.*)-theme$/', '$1', $classes[0] );
		}

		/**
		 * Remembers the file of a stylesheet, so we can read and trim it
		 * when we print it.
		 *
		 * @param string $handle
		 * @param string $path Full path of the file.
		 */
		public static function add_file_path( $handle, $path ) {
			wp_style_add_data( $handle, self::FILE_PATH_KEY, $path );
		}

		/**
		 * The file of one of our stylesheets.
		 *
		 * @param string $handle
		 * @return string|false Full path, or false if there's no file.
		 */
		public static function get_file_path( $handle ) {
			global $wp_styles;
			$path = isset( $wp_styles ) ? $wp_styles->get_data( $handle, self::FILE_PATH_KEY ) : false;

			// Not registered (e.g. the shared styles over admin-ajax).
			if ( ! $path ) {
				$files = self::get_shared_style_files();
				$block_name = self::get_block_name_from_handle( $handle );
				$is_free_block = $block_name !== false && substr( $handle, -strlen( '-premium' ) ) !== '-premium';
				if ( ! empty( $files[ $handle ] ) ) {
					$path = plugin_dir_path( STACKABLE_FILE ) . $files[ $handle ];
				} elseif ( $is_free_block ) {
					$path = plugin_dir_path( STACKABLE_FILE ) . 'dist/blocks/' . $block_name . '.css';
				}
			}

			return $path && file_exists( $path ) ? $path : false;
		}

		/**
		 * The print order of a stylesheet (see the ORDER_ constants).
		 *
		 * @param string $handle
		 * @return int|false False if it's not one of our stylesheets.
		 */
		public static function get_print_order( $handle ) {
			$shared_order = array(
				'ugb-style-css' => self::ORDER_CORE,
				'ugb-style-css-color-schemes' => self::ORDER_COLOR_SCHEMES,
				'ugb-style-css-design-system' => self::ORDER_DESIGN_SYSTEM,
				'ugb-style-css-theme' => self::ORDER_THEME,
				'ugb-style-css-responsive' => self::ORDER_RESPONSIVE,
				'ugb-block-style-inheritance-nodep' => self::ORDER_INHERITANCE_NODEP,
				'ugb-style-css-nodep' => self::ORDER_NODEP,
			);
			if ( isset( $shared_order[ $handle ] ) ) {
				return $shared_order[ $handle ];
			}

			// Block stylesheets have their order in their style data.
			global $wp_styles;
			return $wp_styles->get_data( $handle, self::PRINT_ORDER_KEY );
		}

		/**
		 * Sorts stylesheet handles in print order.
		 *
		 * @param array $handles
		 * @return array
		 */
		public static function sort_by_print_order( $handles ) {
			$handles = array_values( $handles );
			usort( $handles, function( $a, $b ) {
				return self::get_print_order( $a ) - self::get_print_order( $b );
			} );
			return $handles;
		}
	}
}
