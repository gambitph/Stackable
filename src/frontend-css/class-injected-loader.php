<?php
/**
 * Prints the injected-block loader.
 *
 * Step 5 of the frontend CSS loading (see src/frontend-css.php).
 *
 * The page only has the CSS rules its own blocks use. If a script adds
 * Stackable blocks after the page loaded (e.g. HTML copied from another
 * page), they would be unstyled. The loader (src/frontend-css/injected-loader.js)
 * watches for added blocks and loads their full stylesheets.
 *
 * It's printed only on pages where we printed CSS, and not in the legacy
 * mode or when all styles are loaded, since the old big stylesheet already
 * styles every block. Turn it off with:
 *
 *     add_filter( 'stackable_frontend_css_injected_loader', '__return_false' );
 *
 * @since 3.21.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Frontend_CSS_Injected_Loader' ) ) {

	class Stackable_Frontend_CSS_Injected_Loader {

		/**
		 * The built loader script.
		 */
		const SCRIPT_FILE = 'dist/frontend_css_injected_loader.js';

		/**
		 * The body classes that mean the design system stylesheet is used.
		 */
		const DESIGN_SYSTEM_BODY_CLASSES = array(
			'stk-has-design-system-spacing-and-borders',
			'stk-has-design-system-buttons-and-icons',
		);

		public static function add_hooks() {
			add_action( 'wp_footer', array( __CLASS__, 'print_loader' ), PHP_INT_MAX );
		}

		/**
		 * Whether the page needs the loader.
		 *
		 * @return bool
		 */
		private static function is_needed() {
			if ( ! Stackable_Frontend_CSS::is_enabled() || Stackable_Frontend_CSS_Block_Styles::is_loading_all() ) {
				return false;
			}
			// Only pages that load Stackable.
			if ( ! Stackable_Frontend_CSS_Printer::has_printed_css() ) {
				return false;
			}
			// AJAX / REST content is added to a page that has its own loader.
			if ( Stackable_Frontend_CSS_Injected_Content::is_injected_request() ) {
				return false;
			}
			return apply_filters( 'stackable_frontend_css_injected_loader', true );
		}

		/**
		 * Prints the loader with its settings.
		 */
		public static function print_loader() {
			if ( ! self::is_needed() ) {
				return;
			}
			$script = file_get_contents( plugin_dir_path( STACKABLE_FILE ) . self::SCRIPT_FILE );
			if ( ! $script ) {
				return;
			}
			$config = wp_json_encode( self::get_config(), JSON_UNESCAPED_SLASHES );
			$script = str_replace( '__STK_CONFIG__', $config, trim( $script ) );

			if ( function_exists( 'wp_print_inline_script_tag' ) ) {
				wp_print_inline_script_tag( $script, array( 'id' => 'stk-injected-css-loader' ) );
			} else {
				// Below WordPress 5.7.
				echo '<script id="stk-injected-css-loader">' . $script . '</script>'; // phpcs:ignore WordPress.Security.EscapeOutput
			}
		}

		/**
		 * The settings of the loader. The files are relative to the dist/
		 * folder, e.g. frontend_core.css.
		 *
		 * @return array
		 */
		private static function get_config() {
			$shared_files = Stackable_Frontend_CSS_Stylesheets::get_shared_style_files();
			$color_schemes_file = empty( $shared_files['ugb-style-css-color-schemes'] ) ? '' : self::get_dist_file_name( $shared_files['ugb-style-css-color-schemes'] );

			return array(
				'distUrl' => plugins_url( 'dist/', STACKABLE_FILE ),
				'version' => STACKABLE_VERSION,
				'sharedFiles' => self::get_shared_files_for_blocks( $shared_files ),
				'colorSchemesFile' => $color_schemes_file,
				'premiumBlocks' => self::get_premium_blocks(),
				'blocksWithoutCss' => self::get_blocks_without_css(),
			);
		}

		/**
		 * The shared stylesheets every block needs.
		 *
		 * @param array $shared_files handle => file, see Stackable_Frontend_CSS_Stylesheets::get_shared_style_files()
		 * @return array
		 */
		private static function get_shared_files_for_blocks( $shared_files ) {
			$handles = array( 'ugb-style-css', 'ugb-style-css-theme' );

			// The responsive stylesheet file has the default breakpoints. With
			// custom breakpoints, its adjusted rules are already on the page.
			if ( ! Stackable_Frontend_CSS_Breakpoints::has_custom_breakpoints() ) {
				$handles[] = 'ugb-style-css-responsive';
			}

			$body_classes = Stackable_Frontend_CSS_Page_Content::get_global_body_classes();
			if ( count( array_intersect( self::DESIGN_SYSTEM_BODY_CLASSES, $body_classes ) ) ) {
				$handles[] = 'ugb-style-css-design-system';
			}

			$files = array();
			foreach ( $handles as $handle ) {
				if ( ! empty( $shared_files[ $handle ] ) ) {
					$files[] = self::get_dist_file_name( $shared_files[ $handle ] );
				}
			}
			return $files;
		}

		/**
		 * The blocks with a Premium stylesheet.
		 *
		 * @return array e.g. array( 'card', 'posts' )
		 */
		private static function get_premium_blocks() {
			if ( ! function_exists( 'stackable_premium_get_css_manifest' ) ) {
				return array();
			}
			$blocks = array();
			$manifest = stackable_premium_get_css_manifest();
			foreach ( $manifest['styles'] as $style ) {
				if ( $style['type'] === 'block' ) {
					$blocks[] = $style['name'];
				}
			}
			return $blocks;
		}

		/**
		 * The registered Stackable blocks that have no free stylesheet, so
		 * the loader doesn't request a file that doesn't exist.
		 *
		 * @return array e.g. array( 'column' )
		 */
		private static function get_blocks_without_css() {
			$manifest = Stackable_Frontend_CSS_Stylesheets::get_manifest();
			$blocks = array();
			foreach ( WP_Block_Type_Registry::get_instance()->get_all_registered() as $name => $block_type ) {
				if ( strpos( $name, 'stackable/' ) !== 0 ) {
					continue;
				}
				$block = substr( $name, strlen( 'stackable/' ) );
				if ( ! isset( $manifest['blocks'][ $block ] ) ) {
					$blocks[] = $block;
				}
			}
			return $blocks;
		}

		/**
		 * @param string $file e.g. dist/frontend_core.css
		 * @return string e.g. frontend_core.css
		 */
		private static function get_dist_file_name( $file ) {
			return substr( $file, strlen( 'dist/' ) );
		}
	}
}
