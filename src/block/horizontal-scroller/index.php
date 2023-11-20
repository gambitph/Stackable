<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_load_horizontalscroller_frontend_script' ) ) {
	function stackable_load_horizontalscroller_frontend_script() {
		if ( ! is_admin() ) {
			wp_enqueue_script(
				'stk-frontend-horizontal-scroller',
				plugins_url( 'dist/frontend_block_horizontal_scroller.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION,
				true
			);
		}
	}
	add_action( 'stackable/horizontal-scroller/enqueue_scripts', 'stackable_load_horizontalscroller_frontend_script' );
}

if ( ! function_exists( 'stackable_horizontal_scroller_add_class_images' ) ) {
	function stackable_horizontal_scroller_add_class_images($block_content, $block) {
		$block_content = str_replace( "\"stk-img", "\"stk-img stk-img-horizontal-scroller", $block_content );
		return $block_content;
	}

	add_filter( 'render_block_stackable/horizontal-scroller', 'stackable_horizontal_scroller_add_class_images', 1, 2 );
}

if ( ! function_exists( 'stackable_skip_loading_lazy_horizontal_scroller_image' ) ) {
	function stackable_skip_loading_lazy_horizontal_scroller_image( $value, $image, $context ) {
		if ( ! strpos( $image, 'stk-img-horizontal-scroller' ) === false ) {
			return false;
		}

		return $value;
	}

	add_filter( 'wp_img_tag_add_loading_attr', 'stackable_skip_loading_lazy_horizontal_scroller_image', 10, 3 );
}

