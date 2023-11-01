<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since 	0.1
 * @package Stackable
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Init' ) ) {
	class Stackable_Init {

		/**
		 * Holds the scripts which are already enqueued, to ensure we only do it once per script.
		 * @var Array
		 */
		public $scripts_loaded = array();

		/**
		 * Enqueue the frontend scripts, ensures we only do it once.
		 *
		 * @var boolean
		 */
		public $is_main_script_loaded = false;

		/**
		 * Add our hooks.
		 */
		function __construct() {
			// Only load the frontend scripts for now in the backend.  In the frontend,
			// we'll load these conditionally with `load_frontend_scripts_conditionally`
			if ( is_admin() ) {
				add_action( 'enqueue_block_editor_assets', array( $this, 'block_enqueue_frontend_assets' ) );
			}

			// Checks if a Stackable block is rendered in the frontend, then loads our scripts.
			if ( ! is_admin() ) {
				add_filter( 'render_block', array( $this, 'load_frontend_scripts_conditionally' ), 10, 2 );
				add_action( 'template_redirect', array( $this, 'load_frontend_scripts_conditionally_head' ) );
			}

			// Load our editor scripts.
			if ( is_admin() ) {
				add_action( 'enqueue_block_editor_assets', array( $this, 'register_block_editor_assets' ) );
			}
			add_action( 'enqueue_block_editor_assets', array( $this, 'register_block_editor_assets_admin' ) );

			add_action( 'plugins_loaded', array( $this, 'load_plugin_textdomain' ) );

			// Adds a special class to the body tag, to indicate we can now run animations.
			add_action( 'wp_footer', array( $this, 'init_animation' ) );

			// Add the fallback values for the default block width and wide block width.
			// These are used for the inside "Content width" option of Columns.
			add_action( 'stackable_inline_styles', array( $this, 'add_block_widths' ) );
			add_action( 'stackable_inline_editor_styles', array( $this, 'add_block_widths' ) );

			// Add theme classes for compatibility detection.
			add_action( 'body_class', array( $this, 'add_body_class_theme_compatibility' ) );
			add_action( 'admin_body_class', array( $this, 'add_body_class_theme_compatibility' ) );
		}

		/**
		 * Register block assets for both frontend + backend.
		 *
		 * @since 0.1
		 */
		public function register_frontend_assets() {
			// Frontend block styles.
			wp_register_style(
				'ugb-style-css',
				plugins_url( 'dist/frontend_blocks.css', STACKABLE_FILE ),
				apply_filters( 'stackable_frontend_css_dependencies', array() ),
				STACKABLE_VERSION
			);

			// Frtonend only inline styles.
			if ( ! is_admin() ) {
				$inline_css = apply_filters( 'stackable_inline_styles', '' );
				if ( ! empty( $inline_css ) ) {
					wp_add_inline_style( 'ugb-style-css', $inline_css );
				}
			}

			// Frontend block styles (responsive).
			wp_register_style(
				'ugb-style-css-responsive',
				plugins_url( 'dist/frontend_blocks_responsive.css', STACKABLE_FILE ),
				array( 'ugb-style-css' ),
				STACKABLE_VERSION
			);
			wp_enqueue_style( 'ugb-style-css-responsive' );

			if ( ! is_admin() ) {
				wp_register_script( 'ugb-block-frontend-js', null, [], STACKABLE_VERSION );
			}

			$args = apply_filters( 'stackable_localize_frontend_script', array(
				'restUrl' => get_rest_url(),
				'i18n' => array(), // Translatable labels used in the frontend should go here.
			) );
			wp_localize_script( 'ugb-block-frontend-js', 'stackable', $args );

			// Register inline frontend styles, these are always loaded.
			// Register via a dummy style.
			wp_register_style( 'ugb-style-css-nodep', false );
			$inline_css = apply_filters( 'stackable_inline_styles_nodep', '' );
			if ( ! empty( $inline_css ) ) {
				wp_add_inline_style( 'ugb-style-css-nodep', $inline_css );
			}

			// This is needed for the translation strings in our UI.
			if ( is_admin() ) {
				stackable_load_js_translations();
			}

			// Frontend only scripts.
			// if ( ! is_admin() ) {
			// 	wp_register_script(
			// 		'ugb-block-frontend-js',
			// 		plugins_url( 'dist/frontend_blocks.js', STACKABLE_FILE ),
			// 		apply_filters( 'stackable_frontend_js_dependencies', array() ),
			// 		STACKABLE_VERSION
			// 	);

			// 	wp_localize_script( 'ugb-block-frontend-js', 'stackable', array(
			// 		'restUrl' => get_rest_url(),
			// 	) );
			// }
		}

		/**
		 * This is an earlier conditional css loader in the frontend so that we
		 * can load the frontend styles in the head. This is to prevent CLS.
		 *
		 * This is a newer implementation of the
		 * load_frontend_scripts_conditionally function. We don't remove the old
		 * one to keep it as a fallback.
		 *
		 * @return void
		 *
		 * @since 3.0.7
		 */
		public function load_frontend_scripts_conditionally_head() {
			// Only do this in the frontend.
			if ( $this->is_main_script_loaded ) {
				return;
			}

			// Only do this for singular posts.
			$post_id = get_the_ID();
			if ( is_singular() && ! empty( $post_id ) ) {
				global $post;
				if ( ! empty( $post ) && ! empty( $post->post_content ) ) {
					// Check if we have a stackable block in the content.
					if (
						stripos( $post->post_content, '<!-- wp:stackable/' ) !==  false ||
						stripos( $post->post_content, 'stk-highlight' ) !==  false
					) {
						// Enqueue our main scripts and styles.
						$this->block_enqueue_frontend_assets();
						$this->is_main_script_loaded = true;
					}
				}
			}
		}

		/**
		 * This is the original implementation of the conditional css loading in
		 * the frontend. This checks each block to see whether it's a Stackable
		 * block or a feature, then loads the CSS and JS conditionally.
		 *
		 * This works, but it also loads the CSS inside the body tag and
		 * introduces CLS.
		 *
		 * $this->load_frontend_scripts_conditionally_head was created to
		 * address the CLS issue.
		 *
		 * @param string $block_content The block content.
		 * @param Array $block The block object.
		 *
		 * @return string output block
		 */
		public function load_frontend_scripts_conditionally( $block_content, $block ) {
			if ( $block_content === null ) {
				$block_content = "";
			}

			// Load our main frontend scripts if there's a Stackable block loaded in the
			// frontend.
			if ( ! $this->is_main_script_loaded && ! is_admin() ) {
				$block_name = isset( $block['blockName'] ) ? $block['blockName'] : '';
				if (
					stripos( $block_name, 'stackable/' ) === 0 ||
					stripos( $block_content, '<!-- wp:stackable/' ) !==  false ||
					stripos( $block_content, 'stk-highlight' ) !==  false
				) {
					$this->block_enqueue_frontend_assets();
					$this->is_main_script_loaded = true;
				}
			}

			// Load our individual block script if they're used in the page.
			$stackable_block = '';
			$block_name = isset( $block['blockName'] ) ? $block['blockName'] : '';
			if ( stripos( $block_name, 'stackable/' ) === 0 ) {
				$stackable_block = substr( $block_name, 10 );
			} else if ( stripos( $block_content, '<!-- wp:stackable/' ) !==  false ) {
				if ( preg_match( '#stackable/([\w\d-]+)#', $block_content, $matches ) ) {
					$stackable_block = $matches[1];
				}
			}
			// Enqueue the block script once.
			if ( ! empty( $stackable_block ) && ! array_key_exists( $stackable_block, $this->scripts_loaded ) ) {
				do_action( 'stackable/' . $stackable_block . '/enqueue_scripts' );
				$this->scripts_loaded[] = $stackable_block;
			}

			// Check whether the current block needs to enqueue some scripts.
			// This gets called across all the blocks.
			if ( stripos( $block_name, 'stackable/' ) === 0 ) {
				do_action( 'stackable/enqueue_scripts', $block_content, $block );
			}

			return $block_content;
		}

		/**
		 * Enqueue frontend scripts and styles.
		 *
		 * @since 2.17.2
		 */
		public function block_enqueue_frontend_assets() {
			$this->register_frontend_assets();
			wp_enqueue_style( 'ugb-style-css' );
			wp_enqueue_style( 'ugb-style-css-nodep' );
			wp_enqueue_script( 'ugb-block-frontend-js' );
			do_action( 'stackable_block_enqueue_frontend_assets' );
		}

		/**
		 * Enqueue CodeMirror separately. This originally was enqueued in
		 * `register_block_editor_assets`, but we want to enqueue this only when
		 * Gutenberg is loaded. Other plugins may use CodeMirror in other parts
		 * of the admin, and us enqueuing it may interfere with how their plugin
		 * works.
		 *
		 * @since 3.2.0
		 */
		public function register_block_editor_assets_admin() {
			$current_screen = get_current_screen();
			if ( $current_screen->is_block_editor() ) {
				// Enqueue CodeMirror for Custom CSS.
				wp_enqueue_code_editor( array(
					'type' => 'text/css', // @see https://developer.wordpress.org/reference/functions/wp_get_code_editor_settings/
					'codemirror' => array(
						'indentUnit' => 2,
						'tabSize' => 2,
					),
				) );
			}
		}

		/**
		 * Enqueue block assets for backend editor.
		 *
		 * @since 0.1
		 */
		public function register_block_editor_assets() {
			// STK API.
			wp_register_script(
				'ugb-stk',
				plugins_url( 'dist/stk.js', STACKABLE_FILE ),
				// wp-util for wp.ajax.
				// wp-plugins & wp-edit-post for Gutenberg plugins.
				array( 'code-editor', 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-api-fetch', 'wp-util', 'wp-plugins', 'wp-i18n', 'wp-api', 'lodash' ),
				STACKABLE_VERSION
			);

			// Backend editor scripts: blocks.
			wp_register_script(
				'ugb-block-js',
				plugins_url( 'dist/editor_blocks.js', STACKABLE_FILE ),
				// Depend on the window.stk API.
				apply_filters( 'stackable_editor_js_dependencies', array( 'ugb-stk' ) ),
				STACKABLE_VERSION
			);

			// Add translations.
			wp_set_script_translations( 'ugb-stk', STACKABLE_I18N );
			wp_set_script_translations( 'ugb-block-js', STACKABLE_I18N );

			// Backend editor only styles.
			wp_register_style(
				'ugb-block-editor-css',
				plugins_url( 'dist/editor_blocks.css', STACKABLE_FILE ),
				apply_filters( 'stackable_editor_css_dependencies', array( 'wp-edit-blocks' ) ),
				STACKABLE_VERSION
			);

			// Backend editor only inline styles.
			$inline_css = apply_filters( 'stackable_inline_editor_styles', '' );
			if ( ! empty( $inline_css ) ) {
				wp_add_inline_style( 'ugb-block-editor-css', $inline_css );
			}

			$version_parts = explode( '-', STACKABLE_VERSION );

			global $content_width;
			global $wp_version;
			$args = apply_filters( 'stackable_localize_script', array(
				'srcUrl' => untrailingslashit( plugins_url( '/', STACKABLE_FILE ) ),
				'contentWidth' => isset( $content_width ) ? $content_width : 900,
				'i18n' => STACKABLE_I18N,
				'nonce' => wp_create_nonce( 'stackable' ),
				'devMode' => defined( 'WP_ENV' ) ? WP_ENV === 'development' : false,
				'cdnUrl' => STACKABLE_DESIGN_LIBRARY_URL,
				'currentTheme' => esc_html( get_template() ),
				'settingsUrl' => admin_url( 'options-general.php?page=stackable' ),
				'version' => array_shift( $version_parts ),
				'wpVersion' => ! empty( $wp_version ) ? preg_replace( '/-.*/', '', $wp_version ) : $wp_version, // Ensure semver, strip out after dash
				'adminUrl' => admin_url(),

				// Fonts.
				'locale' => get_locale(),

				// Overridable default primary color for buttons and other blocks.
				'primaryColor' => get_theme_mod( 's_primary_color', '#2091e1' ),

				// Premium related variables.
				'isPro' => STACKABLE_BUILD === 'premium' && sugb_fs()->can_use_premium_code(),
				'showProNotice' => stackable_should_show_pro_notices(),
				'pricingURL' => 'https://wpstackable.com/premium/?utm_source=wp-settings&utm_campaign=gopremium&utm_medium=wp-dashboard',
				'planName' => sugb_fs()->is_plan( 'starter', true ) ? 'starter' :
							( sugb_fs()->is_plan( 'professional', true ) ? 'professional' : 'business' ),

				// Icons.
				'fontAwesomeSearchProIcons' => apply_filters( 'stackable_search_fontawesome_pro_icons', false ),

				// Editor settings.
				'settings' => apply_filters( 'stackable_js_settings', array() ),
				'isContentOnlyMode' => apply_filters( 'stackable_editor_role_is_content_only', false ),
				'blockCategoryIndex' => apply_filters( 'stackable_block_category_index', 0 ),
			) );
			wp_localize_script( 'wp-blocks', 'stackable', $args );
		}

		/**
		 * Gets the default/center and wide block widths from the theme if
		 * possible. We need this so our "Content Width" option can be
		 * consistent with what the theme uses.
		 *
		 * @param String $css
		 * @return String The CSS to print out in the frontend.
		 */
		public function add_block_widths( $css ) {
			$width_default = '';
			$width_wide = '';

			// Check the theme.json file if we have any block sizes set.
			// @see https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json/#styles
			if ( class_exists( 'WP_Theme_JSON_Resolver_Gutenberg' ) ) {
				$settings = WP_Theme_JSON_Resolver_Gutenberg::get_merged_data()->get_settings();
				if ( ! empty( $settings ) && array_key_exists( 'layout', $settings ) ) {
					$layout = $settings['layout'];
					if ( ! empty( $layout ) ) {
						if ( array_key_exists( 'contentSize', $layout ) ) {
							$width_default = $layout['contentSize'];
						}
						if ( array_key_exists( 'wideSize', $layout ) ) {
							$width_wide = $layout['wideSize'];
						}
					}
				}
			}

			// The old way for themes to specify the contents are through
			// $content_width, we can use this for the default block width.
			global $content_width;
			if ( empty( $width_default ) && ! empty( $content_width ) ) {
				$width_default = $content_width;
			}

			// Add the CSS to the frontend.
			if ( ! empty( $width_default ) || ! empty( $width_wide ) ) {
				$css .= ':root {';
				if ( ! empty( $width_default ) ) {
					$width_default .= is_numeric( $width_default ) ? 'px' : '';
					$css .= '--stk-block-width-default-detected: ' . esc_attr( $width_default ) . ';';
				}
				if ( ! empty( $width_wide ) ) {
					$width_wide .= is_numeric( $width_wide ) ? 'px' : '';
					$css .= '--stk-block-width-wide-detected: ' . esc_attr( $width_wide ) . ';';
				}
				$css .= '}';
			}

			return $css;
		}

		/**
		 * Adds a class that denotes the current theme, so we can add CSS to
		 * make our blocks look better.
		 */
		public function add_body_class_theme_compatibility( $classes ) {
			// admin_body_class provides a space-separated-string, body_class
			// provides an array. Let's support both.
			$convert_to_string = is_string( $classes );
			if ( $convert_to_string ) {
				$classes = explode( ' ', $classes );
			}

			if ( defined( 'ASTRA_THEME_VERSION' ) ) {
				$classes[] = 'stk--is-astra-theme';
			} else if ( class_exists( 'Blocksy_Translations_Manager' ) ) {
				$classes[] = 'stk--is-blocksy-theme';
			} else if ( defined( 'NEVE_VERSION' ) ) {
				$classes[] = 'stk--is-neve-theme';
			} else if ( defined( 'KADENCE_VERSION' ) ) {
				$classes[] = 'stk--is-kadence-theme';
			} else if ( class_exists( 'Storefront' ) ) {
				$classes[] = 'stk--is-storefront-theme';
			} else if ( function_exists( 'twenty_twenty_one_setup' ) ) {
				$classes[] = 'stk--is-twentytwentyone-theme';
			} else if ( function_exists( 'twentytwentytwo_support' ) ) {
				$classes[] = 'stk--is-twentytwentytwo-theme';
			} else if ( function_exists( 'hello_elementor_setup' ) ) { // Taken from https://github.com/elementor/hello-theme/blob/master/functions.php
				$classes[] = 'stk--is-helloelementor-theme';
			}

			return $convert_to_string ? implode( ' ', $classes ) : $classes;
		}

		/**
		 * Translations.
		 */
		public function load_plugin_textdomain() {
			load_plugin_textdomain( 'stackable-ultimate-gutenberg-blocks' );
		}

		/**
		 * Adds a special class to the body tag, to indicate we can now run
		 * hover transitions and other effects.
		 *
		 * @see src/styles/block-transitions.scss
		 *
		 * @return void
		 */
		public function init_animation() {
			echo '<script>requestAnimationFrame(() => document.body.classList.add( "stk--anim-init" ))</script>';
		}
	}

	new Stackable_init();
}

if ( ! function_exists( 'stackable_load_js_translations' ) ) {
	/**
	 * Loads the translation strings used by our JS scripts. This should be
	 * called when a JS script is enqueued in the admin.
	 *
	 * The translation-strings.js file is an automatically generated file
	 * containing translatable strings located in all our block.json files
	 * (since this is not yet done by WordPress) and our other JS files.
	 *
	 * @return void
	 */
	function stackable_load_js_translations() {
		wp_enqueue_script( 'stackable-strings', plugins_url( 'dist/translation-strings.js', STACKABLE_FILE ), array() );
		wp_set_script_translations( 'stackable-strings', STACKABLE_I18N );
	}
}
