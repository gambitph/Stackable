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
$load_polyfill = false;

// Safari <= 15.3
if ( stripos( $user_agent, 'Version/' ) !== false && stripos( $user_agent, 'Safari/' ) !== false ) {
	$start = stripos( $user_agent, 'Version/' ) + 8;
	$end = strpos( $user_agent, ' ', $start );
	$safari_version = substr( $user_agent, $start, $end - $start );

	// Convert version string to an array of parts
	$version_parts = explode( '.', $safari_version );

	if (
		// Safari < 15
		( isset( $version_parts[ 0 ] ) && intval( $version_parts[ 0 ] ) < 15 ) ||
		// Safari <= 15.3
		( isset( $version_parts[ 0 ] ) && intval( $version_parts[ 0 ] ) == 15 &&
			(
				( isset( $version_parts[ 1 ] ) && intval( $version_parts[ 1 ] ) <= 3 ) ||
				! isset( $version_parts[ 1 ] )
			)
		)
	) {
		$load_polyfill = true;
	}
} else if ( stripos( $user_agent, 'Firefox/' ) !== false ) {
	$load_polyfill = true;
}

if ( ! empty( $user_agent ) && $load_polyfill ) {
	if ( ! function_exists( 'stackable_render_block_alignment_frontend_polyfill' ) ) {

		function stackable_render_block_alignment_flex_frontend_polyfill ( $block_content, $block ) {
			if ( ! isset( $block['blockName'] ) || strpos( $block['blockName'], 'stackable/' ) === false ) {
				return $block_content;
			}

			if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
				return $block_content;
			}

			// The polyfill is only for containers that use column flex.
			if ( ! strpos( $block_content, 'stk-container' ) && ! strpos( $block_content, 'stk--column-flex' ) ) {
				return $block_content;
			}

			if ( strpos( $block_content, 'stk-container--has-child-column-flex-polyfill' ) !== false ) {
				return $block_content;
			}

			return preg_replace( '/stk-container\s(.*?<.*?stk--column-flex)/i', 'stk-container stk-container--has-child-column-flex-polyfill $1', $block_content );
		}

		if ( is_frontend() ) {
			add_filter( 'render_block', 'stackable_render_block_alignment_flex_frontend_polyfill', 10, 2 );
		}

		function stackable_render_block_alignment_frontend_polyfill ( $block_content, $block ) {
			if ( ! isset( $block['blockName'] ) || strpos( $block['blockName'], 'stackable/' ) === false ) {
				return $block_content;
			}

			if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
				return $block_content;
			}

			// The polyfill is only for containers that use column flex.
			if ( ! strpos( $block_content, 'stk--block-margin-top-auto' ) && ! strpos( $block_content, 'stk--block-margin-bottom-auto' ) ) {
				return $block_content;
			}

			$added_polyfill = false;

			$tag = new WP_HTML_Tag_Processor( $block_content );
			$tag->next_tag();
			$content = $tag->set_bookmark( 'block_content' );

			if ( $tag->next_tag( array( 'class_name' => 'stk-block-content' ) ) ) {
				$classes = $tag->get_attribute( 'class' );
				if ( strpos( $classes, 'stk--column-flex' ) === false ) {
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
						$added_polyfill = true;
						$tag->seek( 'not_stk--column-flex' );
						$tag->add_class( 'stk--height-100-polyfill' );
					}
					$tag->release_bookmark( 'not_stk--column-flex' );
				}
			}

			$tag->seek( 'block_content' );
			if ( $tag->next_tag( array( 'class_name' => 'stk-inner-blocks' ) ) ) {
				$classes = $tag->get_attribute( 'class' );
				if ( strpos( $classes, 'stk--column-flex' ) === false ) {
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
						$added_polyfill = true;
						$tag->seek( 'not_stk--column-flex' );
						$tag->add_class( 'stk--height-100-polyfill' );
					}
					$tag->release_bookmark( 'not_stk--column-flex' );
				}
			}

			$tag->release_bookmark( 'block_content' );
			if ( $added_polyfill ) {
				return $tag->get_updated_html();
			}

			return $block_content;
		}

		if ( is_frontend() ) {
			add_filter( 'render_block', 'stackable_render_block_alignment_frontend_polyfill', 10, 2 );
		}
	}
}
