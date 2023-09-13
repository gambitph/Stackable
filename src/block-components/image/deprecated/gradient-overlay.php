<?php
/**
 * Add support for the deprecated --stk-gradient-overlay css custom property.
 * We removed --stk-gradient-overlay from our CSS, but this will still be used
 * by existing blocks that haven't updated yet. This is no longer needed because
 * we combined the opacity option with the color option.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_gradient_overlay_deprecation' ) ) {
	function stackable_gradient_overlay_deprecation( $block_content, $block ) {
		$print_custom_property = false;

		// If the old opacity method is used, then output the required custom
		// property.
		$image_overlay_color = array_key_exists( 'imageOverlayColor', $block['attrs'] ) ? $block['attrs']['imageOverlayColor'] : '';
		$image_overlay_opacity = array_key_exists( 'imageOverlayOpacity', $block['attrs'] ) ? $block['attrs']['imageOverlayOpacity'] : '';

		if ( ! empty( $image_overlay_color ) ) {
			if ( strlen( $image_overlay_color ) <= 7 ) {
				$print_custom_property = true;
			}
		}
		if ( ! empty( $image_overlay_opacity ) ) {
			$print_custom_property = true;
		}

		if ( $print_custom_property ) {
			$unique_id = $block['attrs']['uniqueId'];
			$css = <<<CSS
				.stk-{$unique_id} .stk-img-wrapper::after,
				.stk-{$unique_id} .stk-img-wrapper::before,
				.stk-{$unique_id} .stk-img-wrapper.stk-img--gradient-overlay::before {
					opacity: var(--stk-gradient-overlay, 0.3);
				}
CSS;
			return $block_content . '<style>' . $css . '</style>';
		}

		return $block_content;
	}

	// These are the only blocks that use images.
	add_filter( 'render_block_stackable/card', 'stackable_gradient_overlay_deprecation', 10, 2 );
	add_filter( 'render_block_stackable/image', 'stackable_gradient_overlay_deprecation', 10, 2 );
	add_filter( 'render_block_stackable/posts', 'stackable_gradient_overlay_deprecation', 10, 2 );
}
