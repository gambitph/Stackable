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
				add_action( 'init', array( $this, 'register_frontend_assets' ) );
			}

			// Checks if a Stackable block is rendered in the frontend, then loads our scripts.
			add_filter( 'render_block', array( $this, 'load_frontend_scripts_conditionally' ), 10, 2 );

			// Load our editor scripts.
			add_action( 'init', array( $this, 'register_block_editor_assets' ) );

			add_filter( 'init', array( $this, 'register_frontend_assets_nodep' ) );

			add_action( 'plugins_loaded', array( $this, 'load_plugin_textdomain' ) );

			// Adds a special class to the body tag, to indicate we can now run animations.
			add_action( 'wp_footer', array( $this, 'init_animation' ) );
		}

		/**
		 * Register inline frontend styles.
		 *
		 * @since 3.0.0
		 */
		public function register_frontend_assets_nodep() {
			// Register our dummy style so that the inline styles would get added.
			wp_register_style( 'ugb-style-css-nodep', false );
			wp_enqueue_style( 'ugb-style-css-nodep' );
			$inline_css = apply_filters( 'stackable_inline_styles_nodep', '' );
			if ( ! empty( $inline_css ) ) {
				wp_add_inline_style( 'ugb-style-css-nodep', $inline_css );
			}
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

			wp_localize_script( 'ugb-block-frontend-js', 'stackable', array(
				'restUrl' => get_rest_url(),
			) );

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

		public function load_frontend_scripts_conditionally( $block_content, $block ) {
			// Load our main frontend scripts if there's a Stackable block loaded in the
			// frontend.
			if ( ! $this->is_main_script_loaded && ! is_admin() ) {
				if (
					stripos( $block['blockName'], 'stackable/' ) === 0 ||
					stripos( $block_content, '<!-- wp:stackable/' ) !==  false
				) {
					$this->block_enqueue_frontend_assets();
					$this->is_main_script_loaded = true;
				}
			}

			// Load our individual block script if they're used in the page.
			$stackable_block = '';
			if ( stripos( $block['blockName'], 'stackable/' ) === 0 ) {
				if ( preg_match( '#stackable/([\w\d-]+)#', $block['blockName'], $matches ) ) {
					$stackable_block = $matches[1];
				}
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
			wp_enqueue_script( 'ugb-block-frontend-js' );
			do_action( 'stackable_block_enqueue_frontend_assets' );
		}

		/**
		 * Enqueue block assets for backend editor.
		 *
		 * @since 0.1
		 */
		public function register_block_editor_assets() {
			if ( ! is_admin() ) {
				return;
			}

			// Enqueue CodeMirror for Custom CSS.
			wp_enqueue_code_editor( array(
				'type' => 'text/css', // @see https://developer.wordpress.org/reference/functions/wp_get_code_editor_settings/
				'codemirror' => array(
					'indentUnit' => 2,
					'tabSize' => 2,
				),
			) );

			// Backend editor scripts: common vendor files.
			wp_register_script(
				'ugb-block-js-vendor',
				plugins_url( 'dist/editor_vendor.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION
			);

			// Backend editor scripts: blocks.
			$dependencies = array( 'ugb-block-js-vendor', 'code-editor', 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-api-fetch', 'wp-util', 'wp-plugins', 'wp-i18n', 'wp-api' );
			wp_register_script(
				'ugb-block-js',
				plugins_url( 'dist/editor_blocks.js', STACKABLE_FILE ),
				// wp-util for wp.ajax.
				// wp-plugins & wp-edit-post for Gutenberg plugins.
				apply_filters( 'stackable_editor_js_dependencies', $dependencies ),
				STACKABLE_VERSION
			);

			// Add translations.
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
				'cdnUrl' => STACKABLE_CLOUDFRONT_URL,
				'displayWelcomeVideo' => function_exists( 'stackable_display_welcome_video' ) ? stackable_display_welcome_video() : false,
				'currentTheme' => esc_html( get_template() ),
				'settingsUrl' => admin_url( 'options-general.php?page=stackable' ),
				'version' => array_shift( $version_parts ),
				'wpVersion' => $wp_version,

				// Fonts.
				'locale' => get_locale(),

				// Overridable default primary color for buttons and other blocks.
				'primaryColor' => get_theme_mod( 's_primary_color', '#2091e1' ),

				// Premium related variables.
				'isPro' => sugb_fs()->can_use_premium_code(),
				'showProNotice' => stackable_should_show_pro_notices(),
				'pricingURL' => sugb_fs()->get_upgrade_url(),
				'planName' => sugb_fs()->is_plan( 'starter', true ) ? 'starter' :
							( sugb_fs()->is_plan( 'professional', true ) ? 'professional' : 'business' ),

				// Icons.
				'fontAwesomeSearchProIcons' => apply_filters( 'stackable_search_fontawesome_pro_icons', false ),

				// Editor settings.
				'settings' => apply_filters( 'stackable_js_settings', array() ),
				'isContentOnlyMode' => apply_filters( 'stackable_editor_role_is_content_only', false ),
			) );
			wp_localize_script( 'ugb-block-js-vendor', 'stackable', $args );
		}

		/**
		 * Translations.
		 */
		public function load_plugin_textdomain() {
			load_plugin_textdomain( 'stackable-ultimate-gutenberg-blocks' );
		}

		/**
		 * Adds a special class to the body tag, to indicate we can now run animations.
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
