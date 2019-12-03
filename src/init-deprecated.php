<?php
/**
 * Blocks Initializer - For supporting backward compatibility with WordPress / Gutenberg / Stackable v1.
 *
 * @since 	1.15.5
 * @package Stackable
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_gutenberg_blockeditor_5_1_backward_compatibility' ) ) {

	/**
	 * In Gutenberg 5.9, a lot of Components in @wordpress/editor moved to @wordpress/block-editor.
	 * Stackable scripts have migrated to '@wordpress/block-editor' (wp.blockEditor), but this was only introduced
	 * in WordPress 5.2.
	 *
	 * This function brings support for WordPress 5.1, where wp.blockEditor was not yet available.
	 */
	function stackable_gutenberg_blockeditor_5_1_backward_compatibility() {
		$custom_js = "if ( typeof wp.blockEditor === 'undefined' ) { wp.blockEditor = wp.editor }";
		wp_add_inline_script( 'ugb-block-js-vendor', $custom_js );
	}
	add_action( 'enqueue_block_assets', 'stackable_gutenberg_blockeditor_5_1_backward_compatibility', 8 );
}

/********************************************************************************************
 * Version 1 frontend styles backward compatibility.
 ********************************************************************************************/

if ( ! function_exists( 'stackable_block_editor_assets_deprecated' ) ) {

	/**
	 * Enqueue block assets for both frontend + backend.
	 *
	 * @since 2.0
	 */
	function stackable_block_editor_assets_deprecated() {
		$enqueue_styles_in_frontend = apply_filters( 'stackable_enqueue_styles', ! is_admin() );

		if ( stackable_should_load_v1_styles() && $enqueue_styles_in_frontend ) {
			wp_enqueue_style(
				'ugb-style-css-deprecated',
				plugins_url( 'dist/frontend_blocks_deprecated.css', STACKABLE_FILE ),
				array( 'ugb-style-css' ),
				STACKABLE_VERSION
			);
		}
	}
	add_action( 'enqueue_block_assets', 'stackable_block_editor_assets_deprecated' );
}

if ( ! function_exists( 'stackable_auto_on_deprecated_styles' ) ) {

	/**
	 * When upgrading from v1 to v2, turn on the loading of deprecated styles.
	 *
	 * @since 2.0
	 */
	function stackable_auto_on_deprecated_styles( $old_version, $new_version ) {
		if ( $old_version === '1' && get_option( 'stackable_load_v1_styles' ) === false ) {
			update_option( 'stackable_load_v1_styles', '1' );
		}
	}
	add_action( 'stackable_version_upgraded', 'stackable_auto_on_deprecated_styles', 10, 2 );
}

if ( ! function_exists( 'stackable_ajax_update_load_v1_styles_option' ) ) {

	/**
	 * Ajax handler for saving the setting for loading V1 styles for backward compatibility.
	 *
	 * @since 2.0
	 */
	function stackable_ajax_update_load_v1_styles_option() {
		$nonce = isset( $_POST['nonce'] ) ? sanitize_key( $_POST['nonce'] ) : '';

		if ( ! wp_verify_nonce( $nonce, 'stackable_load_v1_styles' ) ) {
			wp_send_json_error( __( 'Security error, please refresh the page and try again.', STACKABLE_I18N ) );
		}

		$checked_show_notices = isset( $_POST['checked'] ) ? $_POST['checked'] === 'true' : false;
		update_option( 'stackable_load_v1_styles', $checked_show_notices ? '1' : '0' );
		wp_send_json_success();
	}
	add_action( 'wp_ajax_stackable_update_load_v1_styles_option', 'stackable_ajax_update_load_v1_styles_option' );
}

if ( ! function_exists( 'stackable_load_v1_styles_nonce' ) ) {

	/**
	 * Create a nonce for show/hide Go Premium notice.
	 *
	 * @return String
	 *
	 * @since 2.0
	 */
	function stackable_load_v1_styles_nonce() {
		return wp_create_nonce( 'stackable_load_v1_styles' );
	}
}

if ( ! function_exists( 'stackable_should_load_v1_styles' ) ) {

	/**
	 * Should we load v1 styles
	 *
	 * @return Boolean
	 *
	 * @since 2.0
	 */
	function stackable_should_load_v1_styles() {
		return get_option( 'stackable_load_v1_styles' ) === '1';
	}
}

/********************************************************************************************
 * END Version 1 frontend styles backward compatibility.
 ********************************************************************************************/

/********************************************************************************************
 * Version 1 & TwentyTwenty frontend styles backward compatibility.
 ********************************************************************************************/

if ( ! function_exists( 'stackable_twentytwenty_body_class' ) ) {
	/**
	 * Adds a twentytwenty class name to the body if the twentytwenty is used.
	 */
	function stackable_twentytwenty_body_class( $classes ) {
		$classes[] = 'ugb--twentytwentytwenty-compat';
		return $classes;
	}

	function stackable_twentytwenty_compat() {
		if ( function_exists( 'twentytwenty_theme_support' ) && stackable_should_load_v1_styles() ) {
			add_filter( 'body_class','stackable_twentytwenty_body_class' );
		}
	}
	add_action( 'wp', 'stackable_twentytwenty_compat' );
}

/********************************************************************************************
 * END Version 1 & TwentyTwenty frontend styles backward compatibility.
 ********************************************************************************************/
