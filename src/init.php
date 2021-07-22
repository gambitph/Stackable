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

if ( ! function_exists( 'stackable_block_frontend_assets' ) ) {

	/**
	* Register block assets for both frontend + backend.
	*
	* @since 0.1
	*/
	function stackable_block_frontend_assets() {
		// Frontend block styles.
		wp_register_style(
			'ugb-style-css',
			plugins_url( 'dist/frontend_blocks.css', STACKABLE_FILE ),
			apply_filters( 'stackable_frontend_css_dependencies', array() ),
			STACKABLE_VERSION
		);

		// Frontend only scripts.
		if ( ! is_admin() ) {
			wp_register_script(
				'ugb-block-frontend-js',
				plugins_url( 'dist/frontend_blocks.js', STACKABLE_FILE ),
				apply_filters( 'stackable_frontend_js_dependencies', array() ),
				STACKABLE_VERSION
			);

			wp_localize_script( 'ugb-block-frontend-js', 'stackable', array(
				'restUrl' => get_rest_url(),
			) );
		}
	}

	// Only load the frontend scripts for now in the backend.  In the frontend,
	// we'll load these conditionally with `load_frontend_scripts_conditionally`
	if ( is_admin() ) {
		add_action( 'init', 'stackable_block_frontend_assets' );
	}
}

// TODO: make this look better -> Turn into a class
global $stk_test;
$stk_test = false;
function load_frontend_scripts_conditionally( $block_content, $block ) {
	global $stk_test;
	if ( ! $stk_test && ! is_admin() ) {
		if (
			stripos( $block['blockName'], 'stackable/' ) === 0 ||
			stripos( $block_content, '<!-- wp:stackable/' ) !==  false
		) {
			stackable_block_enqueue_frontend_assets();
			$stk_test = true;
		}
	}

	return $block_content;
}
add_filter( 'render_block', 'load_frontend_scripts_conditionally', 10, 2 );


if ( ! function_exists( 'stackable_block_enqueue_frontend_assets' ) ) {

	/**
	* Enqueue frontend scripts and styles.
	*
	* @since 2.17.2
	*/
	function stackable_block_enqueue_frontend_assets() {
		stackable_block_frontend_assets();
		wp_enqueue_style( 'ugb-style-css' );
		wp_enqueue_script( 'ugb-block-frontend-js' );
	}
}

if ( ! function_exists( 'stackable_block_editor_assets' ) ) {

	/**
	 * Enqueue block assets for backend editor.
	 *
	 * @since 0.1
	 */
	function stackable_block_editor_assets() {
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
		$dependencies = array( 'ugb-block-js-vendor', 'code-editor', 'wp-blocks', 'wp-element', 'wp-components', 'wp-editor', 'wp-util', 'wp-plugins', 'wp-edit-post', 'wp-i18n', 'wp-api' );
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

		$version_parts = explode( '-', STACKABLE_VERSION );

		global $content_width;
		global $wp_version;
		wp_localize_script( 'ugb-block-js-vendor', 'stackable', array(
			'srcUrl' => untrailingslashit( plugins_url( '/', STACKABLE_FILE ) ),
			'contentWidth' => isset( $content_width ) ? $content_width : 900,
			'i18n' => STACKABLE_I18N,
			'disabledBlocks' => stackable_get_disabled_blocks(),
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

			// Editor Role.
			'isContentOnlyMode' => apply_filters( 'stackable_editor_role_is_content_only', false ),
		) );
	}

	add_action( 'init', 'stackable_block_editor_assets' );
}

if ( ! function_exists( 'stackable_load_plugin_textdomain' ) ) {

	/**
	 * Translations.
	 */
	function stackable_load_plugin_textdomain() {
		load_plugin_textdomain( 'stackable-ultimate-gutenberg-blocks' );
	}
	add_action( 'plugins_loaded', 'stackable_load_plugin_textdomain' );
}
