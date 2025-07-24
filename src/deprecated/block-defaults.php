<?php
/**
 * Block Defaults are deprecated since v3.18.0
 *
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_deprecated_block_defaults_option' ) ) {

	function stackable_deprecated_block_defaults_option() {
		// If true, Block Defaults will be enabled in the editor
		register_setting(
			'stackable_editor_settings',
			'stackable_enable_block_defaults',
			array(
				'type' => 'boolean',
				'description' => __( 'Use Block Defaults in the editor', STACKABLE_I18N ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest' => true,
				'default' => false,
			)
		);
	}

	function stackable_add_deprecated_block_defaults_setting( $settings ) {
		$settings['stackable_enable_block_defaults'] = boolval( get_option( 'stackable_enable_block_defaults', false ) );
		return $settings;
	}

	// Make setting available in the editor.
	add_filter( 'stackable_js_settings', 'stackable_add_deprecated_block_defaults_setting' );
	add_action( 'init', 'stackable_deprecated_block_defaults_option' );
}

if ( ! function_exists( 'stackable_deprecated_block_defaults' ) ) {

	/**
	 * Upon upgrading to v3.18.0 or later, Block Defaults will be enabled only if existing Block Defaults are present;
	 * otherwise, they will be disabled.
	 * For new installations, Block Defaults will be disabled by default.
	 */
	function stackable_deprecated_block_defaults( $old_version, $new_version ) {
		if ( ! empty( $old_version ) && version_compare( $old_version, "3.18.0", "<" ) ) {

			// set option to true if there are saved block defaults
			if ( ! empty( get_option( 'stackable_block_styles', [] ) ) ) {
				update_option( 'stackable_enable_block_defaults', true, false );
			}
		}
	}

	function stackable_require_block_defaults_script() {
		if ( get_option( 'stackable_enable_block_defaults', false ) ) {
			require_once( plugin_dir_path( __FILE__ ) . 'block-defaults/custom-block-styles.php' );
		}
	}

	add_action( 'stackable_early_version_upgraded', 'stackable_deprecated_block_defaults', 10, 2 );
	add_action( 'init', 'stackable_require_block_defaults_script' );
}
