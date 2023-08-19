<?php
/**
 * Loads the lightbox scripts and styles that will make the lightbox work in the
 * frontend.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_load_lightbox_frontend_script' ) ) {
	function stackable_load_lightbox_frontend_script( $block_content, $block ) {
		if ( array_key_exists( 'attrs', $block ) ) {
			// If the block has one of these 3 attributes, then we'll need
			// to load the lightbox script and styles.
			if ( ( array_key_exists( 'imageHasLightbox', $block['attrs'] ) && $block['attrs']['imageHasLightbox'] ) ||
			     ( array_key_exists( 'blockLinkHasLightbox', $block['attrs'] ) && $block['attrs']['blockLinkHasLightbox'] ) ||
			     ( array_key_exists( 'linkHasLightbox', $block['attrs'] ) && $block['attrs']['linkHasLightbox'] ) ) {

				wp_enqueue_script(
					'stk-frontend-image-lightbox',
					plugins_url( 'dist/frontend_image_lightbox.js', STACKABLE_FILE ),
					array(),
					STACKABLE_VERSION,
					true
				);
				wp_enqueue_style(
					'stk-frontend-image-lightbox',
					plugins_url( 'dist/frontend_image_lightbox.css', STACKABLE_FILE ),
					array(),
					STACKABLE_VERSION
				);

				// Only do this once.
				remove_action( 'stackable/enqueue_scripts', 'stackable_load_lightbox_frontend_script', 10 );
			}
		}
	}

	if ( ! is_admin() ) {
		add_action( 'stackable/enqueue_scripts', 'stackable_load_lightbox_frontend_script', 10, 2 );
	}
}
