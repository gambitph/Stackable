<?php
/**
 * In charge of loading the frontend polyfill for alignment :has() selector
 * support
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$user_agent = ! empty( $_SERVER['HTTP_USER_AGENT'] ) ? $_SERVER['HTTP_USER_AGENT'] : '';
if ( ! empty( $user_agent ) && stripos( $user_agent, 'Firefox/' ) !== false ) {
	add_filter( 'render_block', function( $block_content, $block ) {
		$tag = new WP_HTML_Tag_Processor( $block_content );
		$tag->next_tag();
		$has_bookmark = $tag->set_bookmark( 'block_content' );
		if ( $tag->next_tag( array( 'class_name' => 'stk-container' ) ) ) {
			if ( $tag->next_tag( array( 'class_name' => 'stk--column-flex' ) ) ) {
				return preg_replace( '/stk-container/', 'stk-container stk-container--has-child-column-flex-polyfill', $block_content, 1 );
			}
		}

		if ( $has_bookmark ) {
			$tag->seek( 'block_content' );
			while ( $tag->next_tag() ) {
				$classes = $tag->get_attribute( 'class' );
				if ( $classes && preg_match( '/stk-block-content|stk-inner-blocks/', $classes ) && ! preg_match( '/stk--column-flex/', $classes ) ) {
					$tag->add_class( 'stk--height-100-polyfill' );
					return $tag->get_updated_html();
				}
			}
		}

		return $block_content;
	}, 10, 2 );
}
