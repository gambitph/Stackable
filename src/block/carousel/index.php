<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_load_carousel_frontend_script' ) ) {
	function stackable_load_carousel_frontend_script() {
		if ( ! is_admin() ) {
			wp_enqueue_script(
				'stk-frontend-carousel',
				plugins_url( 'dist/frontend_block_carousel.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION,
				true
			);
		}
	}
	add_action( 'stackable/carousel/enqueue_scripts', 'stackable_load_carousel_frontend_script' );
}

if ( ! function_exists( 'stackable_carousel_add_class_images' ) ) {
	function stackable_carousel_add_class_images($block_content, $block) {
		$block_content = str_replace( "\"stk-img", "\"stk-img stk-img-carousel", $block_content );
		return $block_content;
	}

	add_filter( 'render_block_stackable/carousel', 'stackable_carousel_add_class_images', 1, 2 );
}

if ( ! function_exists( 'stackable_skip_loading_lazy_carousel_image' ) ) {
	function stackable_skip_loading_lazy_carousel_image( $value, $image, $context ) {
		if ( ! strpos( $image, 'stk-img-carousel' ) === false ) {
			return false;
		}

		return $value;
	}

	add_filter( 'wp_img_tag_add_loading_attr', 'stackable_skip_loading_lazy_carousel_image', 10, 3 );
}


