<?php
/**
 * Adds support to Jetpack's Site Accelerator (Photon)
 *
 * @since 	2.2.0
 * @package Stackable
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_jetpack_photon_render_block_replace_style_images' ) ) {
	/**
	 * Replace the url with a Photon url.
	 *
	 * @param array $matches Matches returned by preg_replace_callback. These are urls.
	 *
	 * @return string The replacement string.
	 */
	function stackable_jetpack_photon_render_block_replace_style_images( $matches ) {
		return jetpack_photon_url( $matches[0] );
	}
}

if ( ! function_exists( 'stackable_jetpack_photon_render_block_replace_style' ) ) {
	/**
	 * Find all the image urls that needs ot be replaced with CDN urls.
	 *
	 * @param array $matches Matches returned by preg_replace_callback.
	 *
	 * @return string The replacement string.
	 */
	function stackable_jetpack_photon_render_block_replace_style( $matches ) {
		return preg_replace_callback( '/https?:[^;\}<]+.(jpg|gif|png)/i', 'stackable_jetpack_photon_render_block_replace_style_images', $matches[0] );
	}
}

if ( ! function_exists( 'stackable_jetpack_photon_render_block' ) ) {
	/**
	 * Replaces all image urls inside style tags into CDN tags.
	 *
	 * @param string $block_content The block output.
	 * @param array $block The block object being rendered.
	 *
	 * @return string The modified block output.
	 */
	function stackable_jetpack_photon_render_block( $block_content, $block ) {
		// Only when Jetpack's Photon is enabled.
		if ( ! function_exists( 'jetpack_photon_url' ) ) {
			return $block_content;
		}

		// Only for Stackable blocks.
		$block_name = isset( $block['blockName'] ) ? $block['blockName'] : '';
		if ( strpos( $block_name, 'ugb/', 0 ) === false ) {
			return $block_content;
		}

		// Just a quick check: Only change if there're images found in the style tag.
		if ( ! preg_match( '/<style(.*?)http\s?:(.*?).(jpg|png|gif)(.*?)<\/style/', $block_content ) ) {
			return $block_content;
		}

		// Replace photon images inside style tags.
		return preg_replace_callback( '/<style(.*?)<\/style/', 'stackable_jetpack_photon_render_block_replace_style', $block_content );
	}
	add_filter( 'render_block', 'stackable_jetpack_photon_render_block', 10, 2 );
}
