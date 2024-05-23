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

if ( ! get_option( 'stackable_enable_carousel_lazy_loading' ) && get_option( 'stackable_enable_carousel_lazy_loading' ) !== false ) {
	// Lazy loaded images inside horizontal scroller make the horizontal scroller height buggy and show extra
	// spaces because the height isn't available in lazy loaded images. Prevent images from
	// hidden slides from lazy loading to prevent this.
	if ( ! function_exists( 'stackable_horizontal_scroller_add_class_images' ) ) {
		function stackable_horizontal_scroller_add_class_images( $block_content, $block ) {
			if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
				return $block_content;
			}

			$html_tag = new WP_HTML_Tag_Processor( $block_content );

			while ( $html_tag->next_tag( 'img' ) ) {
				$img_classname = $html_tag->get_attribute( 'class' );

				if ( strpos( $img_classname, 'stk-img') !== false ) {
					$html_tag->add_class( 'stk-img-horizontal-scroller' );
				}
			}

			return $html_tag->get_updated_html();
		}

		add_filter( 'render_block_stackable/horizontal-scroller', 'stackable_horizontal_scroller_add_class_images', 1, 2 );
	}

	if ( ! function_exists( 'stackable_skip_loading_lazy_horizontal_scroller_image' ) ) {
		function stackable_skip_loading_lazy_horizontal_scroller_image( $value, $image ) {
			if ( ! strpos( $image, 'stk-img-horizontal-scroller' ) === false ) {
				return false;
			}

			return $value;
		}

		add_filter( 'wp_img_tag_add_loading_attr', 'stackable_skip_loading_lazy_horizontal_scroller_image', 10, 2 );
	}
}
