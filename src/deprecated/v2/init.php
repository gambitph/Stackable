<?php
/**
 * V2 initializer
 *
 * @since 	3.0.0
 * @package Stackable
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


if ( ! function_exists( 'stackable_auto_compatibility_v2' ) ) {

	/**
	 * When upgrading from v2 to v3, turn on v2 compatibility, and let the user know about how to turn it off.
	 *
	 * @since 3.0.0
	 */
	function stackable_auto_compatibility_v2( $old_version, $new_version ) {
		if ( version_compare( $old_version, "3.0", "<" ) && get_option( 'stackable_v2_compatibility_ask' ) === false ) {
			// TODO: when this option becomes on, then show a question to the user on what to do about upgrading from v2 to v3. Since upgrading, we will keep v2 blocks, but where do you switch it off? Link to upgrading docs.
			update_option( 'stackable_v2_compatibility_ask', '1' );
			update_option( 'stackable_v2_editor_compatibility', '1' );
		}
	}
	add_action( 'stackable_version_upgraded', 'stackable_auto_compatibility_v2', 10, 2 );
}

if ( ! function_exists( 'stackable_v2_compatibility_option' ) ) {

	/**
	 * V2 option for backward compatibility.
	 *
	 * @since 3.0.0
	 */
	function stackable_v2_compatibility_option() {
		// If true, frontend scripts and styles will be loaded when a block is rendered.
		register_setting(
			'stackable_v2_compatibility',
			'stackable_v2_frontend_compatibility',
			array(
				'type' => 'string',
				'description' => __( 'Load version 2 frontend styles and scripts', STACKABLE_I18N ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest' => true,
				'default' => '',
			)
		);

		// If true, v2 blocks will be loaded in the editor and you can still add
		// them, frontend scripts and styles will be loaded like in v2 (with the
		// option to turn on optimization)
		register_setting(
			'stackable_v2_compatibility',
			'stackable_v2_editor_compatibility',
			array(
				'type' => 'string',
				'description' => __( 'Load version 2 blocks in the editor', STACKABLE_I18N ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest' => true,
				'default' => '',
			)
		);

		// If true, v2 blocks will be hidden in the editor inserter. Only works
		// if `stackable_v2_editor_compatibility` is true.
		register_setting(
			'stackable_v2_compatibility',
			'stackable_v2_editor_compatibility_hidden',
			array(
				'type' => 'string',
				'description' => __( 'Hide version 2 blocks from inserter', STACKABLE_I18N ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest' => true,
				'default' => '',
			)
		);
	}
	add_action( 'init', 'stackable_v2_compatibility_option' );
}

if ( ! function_exists( 'has_stackable_v2_frontend_compatibility' ) ) {

	/**
	 * Should we load v2 frontend
	 *
	 * @return Boolean
	 *
	 * @since 3.0.0
	 */
	function has_stackable_v2_frontend_compatibility() {
		return get_option( 'stackable_v2_frontend_compatibility' ) === '1';
	}

	/**
	 * Should we load v2 blocks
	 *
	 * @return Boolean
	 *
	 * @since 3.0.0
	 */
	function has_stackable_v2_editor_compatibility() {
		return get_option( 'stackable_v2_editor_compatibility' ) === '1';
	}
}

if ( ! function_exists( 'stackable_block_assets_v2' ) ) {

	/**
	* Enqueue block assets for both frontend + backend.
	*
	* @since 3.0.0
	*/
	function stackable_block_assets_v2() {
		// Frontend block styles.
		wp_register_style(
			'ugb-style-css-v2',
			plugins_url( 'dist/deprecated/frontend_blocks_deprecated_v2.css', STACKABLE_FILE ),
			apply_filters( 'stackable_frontend_css_dependencies_v2', array() ),
			STACKABLE_VERSION
		);

		// Frontend only scripts.
		if ( ! is_admin() ) {
			wp_register_script(
				'ugb-block-frontend-js-v2',
				plugins_url( 'dist/deprecated/frontend_blocks_deprecated_v2.js', STACKABLE_FILE ),
				apply_filters( 'stackable_frontend_js_dependencies_v2', array() ),
				STACKABLE_VERSION
			);

			wp_localize_script( 'ugb-block-frontend-js-v2', 'stackable', array(
				'restUrl' => get_rest_url(),
			) );
		}
	}

	if ( has_stackable_v2_frontend_compatibility() || has_stackable_v2_editor_compatibility() ) {
		add_action( 'init', 'stackable_block_assets_v2' );
	}
}

if ( ! function_exists( 'stackable_block_enqueue_frontend_assets_v2' ) ) {

	/**
	* Enqueue frontend scripts and styles.
	*
	* @since 2.17.2
	*/
	function stackable_block_enqueue_frontend_assets_v2() {
		stackable_block_assets_v2();
		wp_enqueue_style( 'ugb-style-css-v2' );
		wp_enqueue_script( 'ugb-block-frontend-js-v2' );
	}
}

if ( ! function_exists( 'stackable_block_editor_assets_v2' ) ) {

	/**
	 * Enqueue block assets for backend editor.
	 *
	 * @since 3.0.0
	 */
	function stackable_block_editor_assets_v2() {
		if ( ! is_admin() ) {
			return;
		}

		// Backend editor scripts: blocks.
		$dependencies = array( 'ugb-block-js', 'ugb-block-js-vendor', 'code-editor', 'wp-blocks', 'wp-element', 'wp-components', 'wp-editor', 'wp-util', 'wp-plugins', 'wp-edit-post', 'wp-i18n', 'wp-api' );
		wp_register_script(
			'ugb-block-js-v2',
			plugins_url( 'dist/deprecated/editor_blocks_deprecated_v2.js', STACKABLE_FILE ),
			// wp-util for wp.ajax.
			// wp-plugins & wp-edit-post for Gutenberg plugins.
			apply_filters( 'stackable_editor_js_dependencies_v2', $dependencies ),
			STACKABLE_VERSION
		);

		// Add translations.
		wp_set_script_translations( 'ugb-block-js-v2', STACKABLE_I18N );

		// Backend editor only styles.
		wp_register_style(
			'ugb-block-editor-css-v2',
			plugins_url( 'dist/deprecated/editor_blocks_deprecated_v2.css', STACKABLE_FILE ),
			apply_filters( 'stackable_editor_css_dependencies_v2', array( 'wp-edit-blocks' ) ),
			STACKABLE_VERSION
		);
	}

	if ( has_stackable_v2_frontend_compatibility() || has_stackable_v2_editor_compatibility() ) {
		add_action( 'init', 'stackable_block_editor_assets_v2' );
	}
}

require_once( plugin_dir_path( __FILE__ ) . 'block/blog-posts/index.php' );

// Used in Fonts.
if ( ! function_exists( 'stackable_is_stackable_block_v2' ) ) {
	function stackable_is_stackable_block_v2( $is_stackable_block, $block_name ) {
		if ( ! $is_stackable_block ) {
			return strpos( $block_name, 'ugb/' ) === 0;
		}
		return $is_stackable_block;
	}
	if ( has_stackable_v2_frontend_compatibility() || has_stackable_v2_editor_compatibility() ) {
		add_filter( 'stackable_is_stackable_block', 'stackable_is_stackable_block_v2', 10, 2 );
	}
}

if ( ! function_exists( 'stackable_add_required_block_styles_v2' ) ) {

	/**
	 * Adds the required global styles for Stackable blocks.
	 *
	 * @since 1.3
	 */
	function stackable_add_required_block_styles_v2() {

		global $content_width;
		$full_width_block_inner_width = isset( $content_width ) ? $content_width : 900;

		$custom_css = ':root {
			--content-width: ' . esc_attr( $full_width_block_inner_width ) . 'px;
		}';
		wp_add_inline_style( 'ugb-style-css', $custom_css );
	}
	if ( has_stackable_v2_editor_compatibility() || has_stackable_v2_frontend_compatibility() ) {
		add_action( 'enqueue_block_assets', 'stackable_add_required_block_styles_v2', 11 );
	}
}

/**
 * If frontend compatibility is enabled, and editor compatibility is disabled,
 * try and load add the required frontend styles when the blocks are used.
 */
if ( ! function_exists( 'load_frontend_scripts_conditionally_v2') ) {
	global $stackable_v2_is_script_loaded;
	$stackable_v2_is_script_loaded = false;

	function load_frontend_scripts_conditionally_v2( $block_content, $block ) {
		global $stackable_v2_is_script_loaded;
		if ( ! $stackable_v2_is_script_loaded ) {
			if ( ! is_admin() ) {
				if (
					stripos( $block['blockName'], 'ugb/' ) === 0 ||
					stripos( $block_content, '<!-- wp:ugb/' ) !==  false
				) {
					stackable_block_enqueue_frontend_assets_v2();
					stackable_add_required_block_styles_v2();
					$stackable_v2_is_script_loaded = true;
				}
			}
		}

		return $block_content;
	}

	if ( has_stackable_v2_frontend_compatibility() && ! has_stackable_v2_editor_compatibility() ) {
		add_filter( 'render_block', 'load_frontend_scripts_conditionally_v2', 10, 2 );
	}
}

if ( ! function_exists( 'stackable_disabled_blocks_v2' ) ) {
	/**
	 * Hides all v2 blocks from Gutenberg if needed.
	 *
	 * @param Array $disabled_blocks
	 * @return void
	 */
	function stackable_disabled_blocks_v2( $disabled_blocks ) {
		$block_json_files = stackable_get_all_v2_blocks_json_paths();
		foreach ( $block_json_files as $block_json_file ) {
			$metadata = json_decode( file_get_contents( $block_json_file ), true );
			$disabled_blocks[] = $metadata['name'];
		}
		return $disabled_blocks;

	}
	if ( get_option( 'stackable_v2_editor_compatibility_hidden' ) === '1' ) {
		add_filter( 'stackable_disabled_blocks', 'stackable_disabled_blocks_v2' );
	}
}

if ( ! function_exists( 'register_frontend_blog_posts_block_compatibility_v2' ) ) {
	/**
	 * Registers the blog posts block to make it work in the frontend. This is
	 * only used when the v2 blocks aren't loaded in the editor, but frontend
	 * compatibliity is turned on.
	 *
	 * @return void
	 */
	function register_frontend_blog_posts_block_compatibility_v2() {
		register_block_type( 'ugb/blog-posts', array(
			'attributes' => stackable_blog_posts_attributes_v2(),
			'render_callback' => 'stackable_render_blog_posts_block_v2',
		) );
	}

	if ( ! is_admin() && has_stackable_v2_frontend_compatibility() && ! has_stackable_v2_editor_compatibility() ) {
		add_action( 'init', 'register_frontend_blog_posts_block_compatibility_v2' );
	}
}
