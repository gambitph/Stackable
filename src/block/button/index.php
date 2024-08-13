<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( get_option( 'stackable_inherit_button_styles_from_theme' ) === '1' ) {

	if ( ! function_exists( 'stackable_add_inherit_button_theme_class' ) ) {
		function stackable_add_inherit_button_theme_class( $block_content, $block ) {
			if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
				return $block_content;
			}

			$html_tag = new WP_HTML_Tag_Processor( $block_content );

			while ( $html_tag->next_tag( 'a' ) ) {
				$img_classname = $html_tag->get_attribute( 'class' );

				if ( strpos( $img_classname, 'stk-button' ) !== false ) {
					$html_tag->add_class( 'wp-block-button__link wp-element-button' );
				}
			}

			return $html_tag->get_updated_html();
		}

	}

	add_filter( 'render_block_stackable/button', 'stackable_add_inherit_button_theme_class', 1, 2 );
}

