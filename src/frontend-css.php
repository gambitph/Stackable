<?php
/**
 * Per-block frontend CSS loading.
 *
 * Instead of loading one big stylesheet whenever a Stackable block is on the
 * page, the frontend loads:
 *
 * - ugb-style-css               Shared styles (dist/frontend_core.css)
 * - ugb-style-css-responsive    Shared responsive styles (dist/frontend_core_responsive.css)
 * - stk-block-{block}           One stylesheet per block, only for blocks rendered on the page.
 *                               These are registered as the blocks' `style`, WordPress enqueues them.
 * - ugb-style-css-color-schemes Color scheme styles, only if color schemes are used.
 * - ugb-style-css-design-system Spacing & Borders / Buttons & Icons styles, only if used.
 * - ugb-style-css-theme         Theme compatibility styles, only for the matching theme.
 *
 * The stylesheets are printed in the same order as the rules were in the old
 * single stylesheet, so the CSS cascade is preserved.
 *
 * The editor still uses the single stylesheet.
 *
 * Sites that upgraded from an older version keep the old behavior (see
 * src/deprecated/legacy-frontend-css.php), new installs get this.
 *
 * @since 3.21.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Frontend_CSS' ) ) {
	class Stackable_Frontend_CSS {

		/**
		 * Marker class added to all elements matched by the old color scheme
		 * selector list (see $stk-has-color-schemes-selector in cssvars.scss)
		 */
		const SCHEME_MARKER = 'stk-has-scheme';

		/**
		 * The version where the per-block CSS was introduced. Sites upgrading
		 * from below this version keep the legacy frontend CSS.
		 */
		const INTRODUCED_VERSION = '3.21.0';

		/**
		 * Print order of our stylesheets. Lower prints first. Blocks are
		 * printed first (in the same order they were in the old stylesheet),
		 * then the shared styles, then Premium.
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

		private static $manifest = null;

		/**
		 * Handles of the late <link> tags already printed in this request.
		 */
		private static $late_links_printed = array();

		/**
		 * Block depth counter, used to process only the outermost blocks.
		 */
		private $depth = 0;

		/**
		 * Color scheme flags, computed once.
		 */
		private static $scheme_flags = null;

		function __construct() {
			// The setting for the compatibility option.
			add_action( 'register_stackable_global_settings', array( $this, 'register_settings' ) );
			add_action( 'stackable_early_version_upgraded', array( $this, 'set_legacy_on_upgrade' ), 10, 2 );
			add_action( 'stackable_early_version_upgraded_frontend', array( $this, 'set_legacy_on_upgrade' ), 10, 2 );

			if ( is_admin() && ! wp_doing_ajax() ) {
				return;
			}

			add_action( 'init', array( $this, 'register_block_styles' ), 9 );
			add_filter( 'print_styles_array', array( $this, 'order_styles' ), 20 );

			// Color scheme marker class.
			add_filter( 'render_block_data', array( $this, 'block_depth_start' ), 1 );
			add_filter( 'render_block', array( $this, 'block_depth_end' ), 999, 2 );
			add_filter( 'stackable_process_frontend_html', array( $this, 'add_color_scheme_markers' ) );
		}

		/**
		 * The compatibility option, follows the other options in
		 * Settings > Miscellaneous.
		 */
		public function register_settings() {
			register_setting(
				'stackable_global_settings',
				'stackable_use_legacy_frontend_css',
				array(
					'type' => 'boolean',
					'description' => __( 'Use the frontend CSS loading of v3.20 and below', STACKABLE_I18N ),
					'sanitize_callback' => 'rest_sanitize_boolean',
					'show_in_rest' => true,
					'default' => false,
				)
			);
		}

		/**
		 * Sites upgrading from an older version keep the old frontend CSS, so
		 * nothing changes for them. New installs have no old version.
		 */
		public function set_legacy_on_upgrade( $old_version, $new_version ) {
			if ( ! empty( $old_version ) && version_compare( $old_version, self::INTRODUCED_VERSION, '<' ) ) {
				if ( get_option( 'stackable_use_legacy_frontend_css' ) === false ) {
					update_option( 'stackable_use_legacy_frontend_css', '1' );
					// Use the old behavior already in this request.
					require_once( plugin_dir_path( STACKABLE_FILE ) . 'src/deprecated/legacy-frontend-css.php' );
					do_action( 'stackable_legacy_frontend_css_enabled' );
				}
			}
		}

		/**
		 * The generated list of block stylesheets in dist/frontend_css_manifest.php
		 */
		public static function get_manifest() {
			if ( self::$manifest === null ) {
				$file = plugin_dir_path( STACKABLE_FILE ) . 'dist/frontend_css_manifest.php';
				self::$manifest = file_exists( $file ) ? include( $file ) : array();
				self::$manifest = wp_parse_args( self::$manifest, array( 'blocks' => array(), 'themes' => array() ) );
			}
			return self::$manifest;
		}

		/**
		 * The stylesheet handle of a block, or false if the block doesn't have one.
		 *
		 * @param string $block_name e.g. stackable/heading
		 */
		public static function get_block_style_handle( $block_name ) {
			$name = str_replace( 'stackable/', '', $block_name );
			$manifest = self::get_manifest();
			return isset( $manifest['blocks'][ $name ] ) ? 'stk-block-' . $name : false;
		}

		/**
		 * The `style` to register a block with.
		 *
		 * @param string $block_name
		 * @return string|array
		 */
		public static function get_block_style( $block_name ) {
			// The editor uses the single stylesheet.
			$style = 'ugb-style-css';
			if ( ! is_admin() || wp_doing_ajax() ) {
				$handle = self::get_block_style_handle( $block_name );
				if ( $handle ) {
					$style = array( $handle );
				}
			}
			return apply_filters( 'stackable_block_frontend_style', $style, $block_name );
		}

		/**
		 * The shared stylesheet files. Others can change these.
		 *
		 * @return array handle => file relative to the plugin, or false for an empty handle.
		 */
		public static function get_shared_style_files() {
			$files = array(
				'ugb-style-css' => 'dist/frontend_core.css',
				'ugb-style-css-responsive' => 'dist/frontend_core_responsive.css',
				'ugb-style-css-color-schemes' => 'dist/frontend_color_schemes.css',
				'ugb-style-css-design-system' => 'dist/frontend_design_system.css',
				'ugb-style-css-theme' => false,
			);
			$theme = self::get_theme_slug();
			$manifest = self::get_manifest();
			if ( $theme && isset( $manifest['themes'][ $theme ] ) ) {
				$files['ugb-style-css-theme'] = 'dist/frontend_theme_' . $theme . '.css';
			}
			// The editor uses the single stylesheet.
			if ( is_admin() && ! wp_doing_ajax() ) {
				$files['ugb-style-css'] = 'dist/frontend_blocks.css';
				$files['ugb-style-css-responsive'] = 'dist/frontend_blocks_responsive.css';
				$files['ugb-style-css-color-schemes'] = false;
				$files['ugb-style-css-design-system'] = false;
				$files['ugb-style-css-theme'] = false;
			}
			return apply_filters( 'stackable_frontend_style_files', $files );
		}

		/**
		 * The theme slug used for theme compatibility, e.g. twentytwentyone
		 */
		public static function get_theme_slug() {
			$classes = Stackable_Init::get_theme_compatibility_classes();
			return count( $classes ) ? preg_replace( '/^stk--is-(.*)-theme$/', '$1', $classes[0] ) : '';
		}

		/**
		 * Register the block stylesheets early so WordPress can enqueue them
		 * when a block is rendered.
		 */
		public function register_block_styles() {
			$manifest = self::get_manifest();
			$i = 0;
			foreach ( $manifest['blocks'] as $name => $size ) {
				$file = 'dist/blocks/' . $name . '.css';
				wp_register_style( 'stk-block-' . $name, plugins_url( $file, STACKABLE_FILE ), array( 'ugb-style-css' ), STACKABLE_VERSION );
				wp_style_add_data( 'stk-block-' . $name, 'path', plugin_dir_path( STACKABLE_FILE ) . $file );
				// Print in the same order as in the old single stylesheet.
				wp_style_add_data( 'stk-block-' . $name, 'stk_order', self::ORDER_BLOCKS + $i++ );
			}
		}

		/**
		 * Enqueue the stylesheets of the given Stackable blocks. Used when we
		 * already know which blocks are in the page, so the stylesheets are
		 * printed in the head.
		 *
		 * @param array $block_names e.g. [ 'stackable/heading' ]
		 */
		public static function enqueue_block_styles( $block_names ) {
			if ( ! apply_filters( 'stackable_frontend_css_enqueue_block_styles', true ) ) {
				return;
			}
			$registry = WP_Block_Type_Registry::get_instance();
			foreach ( array_unique( $block_names ) as $block_name ) {
				$block_type = $registry->get_registered( $block_name );
				if ( $block_type && ! empty( $block_type->style_handles ) ) {
					foreach ( $block_type->style_handles as $handle ) {
						wp_enqueue_style( $handle );
					}
				}
			}
		}

		/**
		 * Enqueue all block stylesheets, used when the stackable_force_css_load
		 * filter is used.
		 */
		public static function enqueue_all_block_styles() {
			$names = array();
			foreach ( WP_Block_Type_Registry::get_instance()->get_all_registered() as $name => $block_type ) {
				if ( strpos( $name, 'stackable/' ) === 0 ) {
					$names[] = $name;
				}
			}
			self::enqueue_block_styles( $names );
		}

		/**
		 * The print order of a stylesheet handle, or false if it's not ours.
		 */
		public static function get_style_order( $handle ) {
			global $wp_styles;
			$fixed = array(
				'ugb-style-css' => self::ORDER_CORE,
				'ugb-style-css-color-schemes' => self::ORDER_COLOR_SCHEMES,
				'ugb-style-css-design-system' => self::ORDER_DESIGN_SYSTEM,
				'ugb-style-css-theme' => self::ORDER_THEME,
				'ugb-style-css-responsive' => self::ORDER_RESPONSIVE,
				'ugb-block-style-inheritance-nodep' => self::ORDER_INHERITANCE_NODEP,
				'ugb-style-css-nodep' => self::ORDER_NODEP,
			);
			if ( isset( $fixed[ $handle ] ) ) {
				return $fixed[ $handle ];
			}
			$order = $wp_styles->get_data( $handle, 'stk_order' );
			return $order !== false ? $order : false;
		}

		/**
		 * Print our stylesheets in the order of the old single stylesheet:
		 * blocks, shared styles, responsive styles, global styles, Premium.
		 * Only our handles are reordered, other stylesheets stay where they are.
		 *
		 * Also, if there are custom breakpoints, print our stylesheets inline
		 * with the adjusted breakpoints.
		 */
		public function order_styles( $handles ) {
			global $wp_styles;
			// Block stylesheets printed after the shared ones were already
			// printed (e.g. blocks in widgets or in the footer for classic
			// themes): print the shared stylesheets again after them to keep
			// the same cascade.
			if ( in_array( 'ugb-style-css', $wp_styles->done, true ) && apply_filters( 'stackable_frontend_css_print_late_links', true ) ) {
				$has_block_styles = false;
				foreach ( $handles as $handle ) {
					$order = self::get_style_order( $handle );
					if ( $order !== false && $order < self::ORDER_CORE ) {
						$has_block_styles = true;
						break;
					}
				}
				if ( $has_block_styles ) {
					static $batch = 0;
					$batch++;
					foreach ( self::get_printed_shared_handles() as $handle ) {
						$clone = $handle . '-reprint' . ( $batch > 1 ? '-' . $batch : '' );
						if ( ! isset( $wp_styles->registered[ $clone ] ) ) {
							$style = $wp_styles->registered[ $handle ];
							wp_register_style( $clone, $style->src, array(), $style->ver );
							$after = $wp_styles->get_data( $handle, 'after' );
							if ( $after ) {
								$wp_styles->add_data( $clone, 'after', $after );
							}
							// Only needed for adjusting the breakpoints, otherwise
							// print a <link> to the cached file instead of inlining.
							$path = $wp_styles->get_data( $handle, 'path' );
							if ( $path && $style->src && apply_filters( 'stackable_frontend_css_has_custom_breakpoints', false ) ) {
								$wp_styles->add_data( $clone, 'path', $path );
							}
							$wp_styles->add_data( $clone, 'stk_order', self::get_style_order( $handle ) );
						}
						if ( ! in_array( $clone, $handles, true ) ) {
							$handles[] = $clone;
						}
					}
				}
			}

			$ours = array();
			$slots = array();
			foreach ( $handles as $i => $handle ) {
				$order = self::get_style_order( $handle );
				if ( $order !== false ) {
					$ours[] = array( $order, count( $ours ), $handle );
					$slots[] = $i;
				}
			}
			if ( count( $ours ) > 1 ) {
				sort( $ours );
				foreach ( $slots as $k => $i ) {
					$handles[ $i ] = $ours[ $k ][2];
				}
			}

			if ( count( $ours ) ) {
				$this->maybe_inline_adjusted_styles( wp_list_pluck( $ours, 2 ) );
			}

			return $handles;
		}

		/**
		 * If there are custom breakpoints, our responsive stylesheets are
		 * printed inline with the breakpoints adjusted.
		 */
		public function maybe_inline_adjusted_styles( $handles ) {
			if ( ! apply_filters( 'stackable_frontend_css_has_custom_breakpoints', false ) ) {
				return;
			}
			global $wp_styles;
			$handles = apply_filters( 'stackable_frontend_css_adjust_breakpoints_handles', $handles );
			foreach ( $handles as $handle ) {
				$path = $wp_styles->get_data( $handle, 'path' );
				$style = isset( $wp_styles->registered[ $handle ] ) ? $wp_styles->registered[ $handle ] : null;
				if ( ! $style || ! $path || ! file_exists( $path ) ) {
					continue;
				}
				if ( $wp_styles->get_data( $handle, 'stk_adjusted' ) ) {
					continue;
				}
				$css = file_get_contents( $path );
				// Only stylesheets with media queries need adjusting.
				if ( strpos( $css, '@media' ) === false ) {
					continue;
				}
				$wp_styles->add_data( $handle, 'stk_adjusted', true );
				// Already inlined by WordPress (wp_maybe_inline_styles), adjust the inlined styles.
				if ( ! $style->src ) {
					$inline = $wp_styles->get_data( $handle, 'after' );
					if ( is_array( $inline ) && isset( $inline[0] ) && is_string( $inline[0] ) ) {
						$inline[0] = apply_filters( 'stackable_frontend_css', $inline[0] );
						$wp_styles->add_data( $handle, 'after', $inline );
					}
					continue;
				}
				$style->src = false;
				$inline = $wp_styles->get_data( $handle, 'after' );
				$inline = is_array( $inline ) ? $inline : array();
				array_unshift( $inline, apply_filters( 'stackable_frontend_css', $css ) );
				$wp_styles->add_data( $handle, 'after', $inline );
			}
		}

		/**
		 * The stylesheets needed by a block (shared + block + Premium), in print order.
		 */
		public static function get_handles_for_block( $block_name ) {
			global $wp_styles;
			$handles = array( 'ugb-style-css' );
			foreach ( array( 'ugb-style-css-color-schemes', 'ugb-style-css-design-system', 'ugb-style-css-theme' ) as $addon ) {
				if ( wp_style_is( $addon, 'enqueued' ) ) {
					$handles[] = $addon;
				}
			}
			$handles[] = 'ugb-style-css-responsive';
			$block_type = WP_Block_Type_Registry::get_instance()->get_registered( $block_name );
			if ( $block_type && ! empty( $block_type->style_handles ) ) {
				foreach ( $block_type->style_handles as $handle ) {
					if ( isset( $wp_styles->registered[ $handle ] ) ) {
						$handles = array_merge( $handles, $wp_styles->registered[ $handle ]->deps, array( $handle ) );
					}
				}
			}
			$handles = array_values( array_unique( $handles ) );
			usort( $handles, function( $a, $b ) {
				return self::get_style_order( $a ) - self::get_style_order( $b );
			} );
			return $handles;
		}

		/**
		 * Blocks rendered after the footer styles were printed, or in an
		 * AJAX/REST response, won't get their stylesheets printed by WordPress.
		 * For these, print the <link> tags with the block.
		 */
		public function maybe_print_late_style_links( $block_content, $block_name ) {
			$is_late = did_action( 'wp_print_footer_scripts' );
			$is_ajax = wp_doing_ajax() || ( wp_is_json_request() && ! self::is_editor_rest_request() );
			if ( ! $is_late && ! $is_ajax ) {
				return $block_content;
			}
			if ( ! apply_filters( 'stackable_frontend_css_print_late_links', true ) ) {
				return $block_content;
			}

			global $wp_styles;

			// All the Stackable blocks inside, not just the outermost one.
			$block_names = array( $block_name );
			if ( preg_match_all( '/wp-block-stackable-([a-z0-9-]+)/', $block_content, $matches ) ) {
				foreach ( array_unique( $matches[1] ) as $name ) {
					$block_names[] = 'stackable/' . $name;
				}
			}
			$handles = array();
			foreach ( array_unique( $block_names ) as $name ) {
				$handles = array_merge( $handles, self::get_handles_for_block( $name ) );
			}
			$handles = self::sort_handles( array_unique( $handles ) );

			$to_print = array();
			$has_block_styles = false;
			foreach ( $handles as $handle ) {
				if ( isset( self::$late_links_printed[ $handle ] ) ) {
					continue;
				}
				// In a page, skip the stylesheets that were already printed.
				if ( $is_late && ! $is_ajax && in_array( $handle, $wp_styles->done, true ) ) {
					continue;
				}
				$to_print[] = $handle;
				if ( self::get_style_order( $handle ) < self::ORDER_CORE ) {
					$has_block_styles = true;
				}
			}

			// Block stylesheets come before the shared ones, print the shared
			// stylesheets again after them to keep the same cascade.
			if ( $has_block_styles ) {
				$to_print = self::sort_handles( array_unique( array_merge( $to_print, self::get_printed_shared_handles( $handles ) ) ) );
			}

			$tags = '';
			foreach ( $to_print as $handle ) {
				self::$late_links_printed[ $handle ] = true;
				$tags .= self::get_style_tag( $handle, isset( $wp_styles->done ) && in_array( $handle, $wp_styles->done, true ) ? '-reprint' : '' );
			}
			return $tags . $block_content;
		}

		/**
		 * Sort stylesheet handles in our print order.
		 */
		public static function sort_handles( $handles ) {
			$handles = array_values( $handles );
			usort( $handles, function( $a, $b ) {
				return self::get_style_order( $a ) - self::get_style_order( $b );
			} );
			return $handles;
		}

		/**
		 * The shared stylesheets (core, color schemes, design system, theme,
		 * responsive, global styles) that were already printed, or are in
		 * the given list.
		 */
		public static function get_printed_shared_handles( $handles = array() ) {
			global $wp_styles;
			$shared = array();
			foreach ( array( 'ugb-style-css', 'ugb-style-css-color-schemes', 'ugb-style-css-design-system', 'ugb-style-css-theme', 'ugb-style-css-responsive', 'ugb-block-style-inheritance-nodep', 'ugb-style-css-nodep' ) as $handle ) {
				if ( in_array( $handle, $handles, true ) || in_array( $handle, $wp_styles->done, true ) ) {
					$shared[] = $handle;
				}
			}
			return $shared;
		}

		/**
		 * The <link> (or <style> if inlined) tag of a registered stylesheet.
		 */
		public static function get_style_tag( $handle, $id_suffix = '' ) {
			global $wp_styles;
			$style = isset( $wp_styles->registered[ $handle ] ) ? $wp_styles->registered[ $handle ] : null;
			if ( ! $style ) {
				return '';
			}
			$tag = '';
			if ( $style->src ) {
				$href = add_query_arg( 'ver', $style->ver ? $style->ver : STACKABLE_VERSION, $style->src );
				$tag .= sprintf( "<link rel='stylesheet' id='%s-css' href='%s' media='all' />", esc_attr( $handle . $id_suffix ), esc_url( $href ) );
			}
			$after = $wp_styles->get_data( $handle, 'after' );
			if ( is_array( $after ) && count( $after ) ) {
				$tag .= sprintf( "<style id='%s-inline-css'>%s</style>", esc_attr( $handle . $id_suffix ), implode( "\n", array_filter( $after, 'is_string' ) ) );
			}
			return $tag;
		}

		public static function is_editor_rest_request() {
			$route = isset( $GLOBALS['wp']->query_vars['rest_route'] ) ? $GLOBALS['wp']->query_vars['rest_route'] : '';
			return strpos( $route, '/wp/v2/block-renderer' ) === 0 || ( isset( $_GET['context'] ) && $_GET['context'] === 'edit' ); // phpcs:ignore WordPress.Security.NonceVerification
		}

		/**
		 * Keep track of the block depth so we only process outermost blocks.
		 */
		public function block_depth_start( $parsed_block ) {
			$this->depth++;
			return $parsed_block;
		}

		public function block_depth_end( $block_content, $block ) {
			$this->depth = max( 0, $this->depth - 1 );
			if ( $this->depth > 0 || $block_content === null || $block_content === '' ) {
				return $block_content;
			}
			if ( strpos( $block_content, 'stk-' ) === false ) {
				return $block_content;
			}

			$block_content = $this->add_color_scheme_markers( $block_content );

			$block_name = isset( $block['blockName'] ) ? $block['blockName'] : '';
			if ( $block_name && strpos( $block_name, 'stackable/' ) === 0 ) {
				$block_content = $this->maybe_print_late_style_links( $block_content, $block_name );
			}
			return $block_content;
		}

		/**
		 * The color scheme flags: whether there are color schemes, and which
		 * default schemes are set (same as the color scheme body classes).
		 */
		public static function get_color_scheme_flags() {
			if ( self::$scheme_flags === null ) {
				$css = get_option( 'stackable_global_color_scheme_generated_css' );
				$classes = $css ? Stackable_Global_Color_Schemes::get_color_scheme_body_classes( $css ) : array();
				self::$scheme_flags = array(
					'enabled' => ! empty( $css ),
					'background' => in_array( 'stk--has-background-scheme', $classes ),
					'container' => in_array( 'stk--has-container-scheme', $classes ),
				);
			}
			return self::$scheme_flags;
		}

		/**
		 * Adds the color scheme marker class to all the elements matched by
		 * the old color scheme selector list:
		 *
		 * - [class*='stk--background-scheme'], [class*='stk--container-scheme']
		 * - .stk--has-background-scheme .stk-block-background
		 * - .stk--has-container-scheme .stk-container:not(.stk--no-background)
		 *
		 * (.stk--has-base-scheme is the body, handled by the body class.)
		 *
		 * @param string $html
		 * @return string
		 */
		public function add_color_scheme_markers( $html ) {
			$marker = apply_filters( 'stackable_color_scheme_marker_class', self::SCHEME_MARKER );
			if ( ! $marker || ! is_string( $html ) || $html === '' ) {
				return $html;
			}
			$flags = self::get_color_scheme_flags();
			if ( ! $flags['enabled'] ) {
				return $html;
			}
			$has_scheme_classes = strpos( $html, '-scheme' ) !== false;
			$check_background = $flags['background'] && strpos( $html, 'stk-block-background' ) !== false;
			$check_container = $flags['container'] && strpos( $html, 'stk-container' ) !== false;
			if ( ! $has_scheme_classes && ! $check_background && ! $check_container ) {
				return $html;
			}

			$tags = new WP_HTML_Tag_Processor( $html );
			while ( $tags->next_tag() ) {
				$class = $tags->get_attribute( 'class' );
				if ( ! is_string( $class ) || $class === '' ) {
					continue;
				}
				if (
					strpos( $class, 'stk--background-scheme' ) !== false ||
					strpos( $class, 'stk--container-scheme' ) !== false ||
					( $check_background && $tags->has_class( 'stk-block-background' ) ) ||
					( $check_container && $tags->has_class( 'stk-container' ) && ! $tags->has_class( 'stk--no-background' ) )
				) {
					$tags->add_class( $marker );
				}
			}
			return $tags->get_updated_html();
		}
	}

	new Stackable_Frontend_CSS();
}
