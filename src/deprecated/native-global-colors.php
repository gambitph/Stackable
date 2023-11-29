<?php
/**
 * Global Settings backward compatibility support for native blocks for v3.10.1
 * and below.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_deprecated_global_colors_for_native_blocks_checker' ) ) {
	/**
	 * Detects the presence of global colors in native blocks.
	 *
	 * @param string $block_content
	 * @param Array $block
	 *
	 * @return string Block content
	 *
	 * @since 3.11.0
	 */
	function stackable_deprecated_global_colors_for_native_blocks_checker( $block_content, $block ) {
		if ( stripos( $block_content, 'has-stk-global-color-' ) !== false ) {
			update_option( 'stackable_global_colors_native_compatibility', '1' );
		}

		return $block_content;
	}
	add_filter( 'render_block', 'stackable_deprecated_global_colors_for_native_blocks_checker', 10, 2 );
}

if ( ! function_exists( 'register_deprecated_global_colors_for_native_blocks_settings' ) ) {
	function register_deprecated_global_colors_for_native_blocks_settings() {
		register_setting(
			'stackable_editor_settings',
			'stackable_global_colors_native_compatibility',
			array(
				'type' => 'boolean',
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest' => true,
				'default' => false,
			)
		);
	}
	add_action( 'admin_init', 'register_deprecated_global_colors_for_native_blocks_settings' );
	add_action( 'rest_api_init', 'register_deprecated_global_colors_for_native_blocks_settings' );
}

if ( ! function_exists( 'stackable_deprecated_global_colors_for_native_blocks' ) ) {
	/**
	 * Register inline frontend global styles, if a native block with global colors are detected.
	 *
	 * @since 3.11.0
	 */
	function stackable_deprecated_global_colors_for_native_blocks() {
		// Do it only once. Don't do if we already enqueued the styles.
		if ( wp_style_is( 'ugb-dep-native-global-style-css-nodep' ) ) {
			return;
		}

		if ( ! get_option( 'stackable_global_colors_native_compatibility' ) ) {
			return;
		}

		// Don't do anything if we doon't have any global colors.
		$colors = get_option( 'stackable_global_colors' );
		if ( ! $colors || ! is_array( $colors ) ) {
			return;
		}

		$css = '';

		foreach ( $colors as $color_palette ) {
			if ( ! is_array( $color_palette ) ) {
				continue;
			}

			foreach ( $color_palette as $color ) {
				if ( ! is_array( $color ) ) {
					continue;
				}
				if ( ! array_key_exists( 'slug', $color ) || ! array_key_exists( 'color', $color ) || ! array_key_exists( 'rgb', $color ) ) {
					continue;
				}

				$color_name = strtolower( $color['slug'] );

				// Convert the name to kebab casing,
				$color_typography_name = 'body .has-' . implode( '-', explode( ' ', $color_name ) ) . '-color';
				$color_background_name = 'body .has-' . implode( '-', explode( ' ', $color_name ) ) . '-background-color';

				// Only do this for our global colors.
				if ( $color['color'] && $color['slug'] ) {
					// Add custom css class rule for other blocks.
					// For typography colors.
					$css .= $color_typography_name . '{color:' . $color['color'] . ' !important;}';

					// For background colors.
					$css .= $color_background_name . '{background-color:' . $color['color'] . ' !important;}';
				}
			}
		}

		if ( ! empty( $css ) ) {
			// Register our dummy style so that the inline styles would get added.
			wp_register_style( 'ugb-dep-native-global-style-css-nodep', false );
			wp_enqueue_style( 'ugb-dep-native-global-style-css-nodep' );
			wp_add_inline_style( 'ugb-dep-native-global-style-css-nodep', $css );
		}
	}

	add_action( 'init', 'stackable_deprecated_global_colors_for_native_blocks' );
	add_action( 'wp_footer', 'stackable_deprecated_global_colors_for_native_blocks' );
}
