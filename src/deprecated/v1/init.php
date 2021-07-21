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
				plugins_url( 'dist/deprecated/frontend_blocks_deprecated.css', STACKABLE_FILE ),
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

if ( ! function_exists( 'stackable_register_load_v1_styles_option' ) ) {

	/**
	 * Ajax handler for saving the setting for loading V1 styles for backward compatibility.
	 *
	 * @since 2.0
	 */
	function stackable_register_load_v1_styles_option() {
		register_setting(
			'stackable_load_v1_styles',
			'stackable_load_v1_styles',
			array(
				'type' => 'string',
				'description' => __( 'Load version 1 styles for backward compatibility', STACKABLE_I18N ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest' => true,
				'default' => '',
			)
		);
	}
	add_action( 'init', 'stackable_register_load_v1_styles_option' );
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
