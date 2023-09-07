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
	if ( ! function_exists( 'stackable_render_block_alignment_frontend_polyfill' ) ) {

		function stackable_render_block_alignment_frontend_polyfill ( $block_content, $block ) {
			if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
				return $block_content;
			}

			$tag = new WP_HTML_Tag_Processor( $block_content );
			$tag->next_tag();
			$has_bookmark = $tag->set_bookmark( 'block_content' );

			// check for .stk-container:has(> .stk--column-flex)
			if ( $tag->next_tag( array( 'class_name' => 'stk-container' ) ) ) {
				if ( $tag->next_tag( array( 'class_name' => 'stk--column-flex' ) ) ) {
					$block_content = preg_replace( '/stk-container/', 'stk-container stk-container--has-child-column-flex-polyfill', $block_content, 1 );
				}
			}

			if ( $has_bookmark ) {
				$tag->seek( 'block_content' );
				while ( $tag->next_tag() ) {
					$classes = $tag->get_attribute( 'class' );

					// check for :is(.stk-block-content, .stk-inner-blocks):not(.stk--column-flex):has(> :is(.stk--block-margin-top-auto, .stk--block-margin-bottom-auto))
					if ( $classes && preg_match( '/stk-block-content|stk-inner-blocks/', $classes ) && ! preg_match( '/stk--column-flex/', $classes ) ) {
						$tag->set_bookmark( 'not_stk--column-flex' );

						$add_polyfill_class = false;
						if ( $tag->next_tag( array( 'class_name' => 'stk--block-margin-top-auto' ) ) ) {
							$add_polyfill_class = true;
						}

						$tag->seek( 'not_stk--column-flex' );
						if ( $tag->next_tag( array( 'class_name' => 'stk--block-margin-bottom-auto' ) ) ) {
							$add_polyfill_class = true;
						}

						if ( $add_polyfill_class ) {
							$tag->seek( 'not_stk--column-flex' );
							$tag->add_class( 'stk--height-100-polyfill' );
							$tag->release_bookmark( 'not_stk--column-flex' );
							$tag->release_bookmark( 'block_content' );
							return $tag->get_updated_html();
						}
					}
				}
			}


			$tag->release_bookmark( 'block_content' );
			return $block_content;
		}

		add_filter( 'render_block', 'stackable_render_block_alignment_frontend_polyfill', 10, 2 );
	}
}
