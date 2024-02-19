<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( get_option( 'stackable_inherit_caption_styles_from_theme' ) === '1' ) {

	if ( ! function_exists( 'stackable_add_inherit_figcaption_theme_class' ) ) {
		function stackable_add_inherit_figcaption_theme_class( $block_content, $block ) {
			if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
				return $block_content;
			}

			$html_tag = new WP_HTML_Tag_Processor( $block_content );

			while ( $html_tag->next_tag( 'figcaption' ) ) {
				$img_classname = $html_tag->get_attribute( 'class' );

				if ( strpos( $img_classname, 'stk-img-figcaption') !== false ) {
					$html_tag->add_class( 'wp-element-caption' );
				}
			}

			return $html_tag->get_updated_html();
		}

	}

	add_filter( 'render_block_stackable/image', 'stackable_add_inherit_figcaption_theme_class', 1, 2 );
}
