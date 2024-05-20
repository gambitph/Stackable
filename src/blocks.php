<?php
/**
 * Blocks Loader
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since 	2.17.2
 * @package Stackable
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_register_blocks' ) ) {
	function stackable_register_blocks() {
		$blocks_array = apply_filters( 'stackable.blocks', array() );

		$registry = WP_Block_Type_Registry::get_instance();
		foreach ( $blocks_array as $name => $metadata ) {
			if ( $registry->is_registered( $name ) ) {
				$registry->unregister( $name );
			}

			$register_options = apply_filters( 'stackable.register-blocks.options',
				// This automatically enqueues all our styles and scripts.
				array(
					'style' => 'ugb-style-css', // Frontend styles.
					// 'script' => 'ugb-block-frontend-js', // Frontend scripts.
					'editor_script' => 'ugb-block-js', // Editor scripts.
					'editor_style' => 'ugb-block-editor-css', // Editor styles.
				),
				$metadata['name'],
				$metadata
			);

			$block_args = array_merge( $metadata, $register_options );
			register_block_type( $metadata['name'], $block_args );
		}
	}
	add_action( 'init', 'stackable_register_blocks' );
}

/**
 * Allow our blocks to display post excerpts
 * when calling `get_the_excerpt` function.
 *
 * @see https://developer.wordpress.org/reference/hooks/excerpt_allowed_blocks/
 */
if ( ! function_exists( 'stackable_add_excerpt_wrapper_blocks' ) ) {
	/**
	 * Register stackable blocks with inner blocks.
	 */
	function stackable_add_excerpt_wrapper_blocks( $allowed_wrapper_blocks ) {
		return array_merge( $allowed_wrapper_blocks,  array(
			'stackable/accordion',
			'stackable/blockquote',
			'stackable/button-group',
			'stackable/call-to-action',
			'stackable/card',
			'stackable/column',
			'stackable/columns',
			'stackable/expand',
			'stackable/feature-grid',
			'stackable/feature',
			'stackable/hero',
			'stackable/icon-box',
			'stackable/icon-label',
			'stackable/image-box',
			'stackable/notification',
			'stackable/posts',
			'stackable/price',
			'stackable/tabs',
			'stackable/tab-content',
			'stackable/pricing-box',
			'stackable/team-member',
			'stackable/testimonial',
			'stackable/timeline',
			'stackable/video-popup',
			'stackable/horizontal-scroller',
			)
	 	);
	}

	add_filter( 'excerpt_allowed_wrapper_blocks', 'stackable_add_excerpt_wrapper_blocks' );
}

if ( ! function_exists( 'stackable_add_excerpt_blocks' ) ) {
	/**
	 * Register "unit" stackable blocks (blocks without inner blocks)
	 */
	function stackable_add_excerpt_blocks( $allowed_blocks ) {
		return array_merge( $allowed_blocks, array(
			'stackable/button',
			'stackable/count-up',
			'stackable/countdown',
			'stackable/divider',
			'stackable/heading',
			'stackable/icon-button',
			'stackable/icon-list',
			'stackable/icon',
			'stackable/image',
			'stackable/number-box',
			'stackable/map',
			'stackable/progress-bar',
			'stackable/progress-circle',
			'stackable/separator',
			'stackable/spacer',
			'stackable/subtitle',
			'stackable/table-of-contents',
			'stackable/tab-labels',
			'stackable/text',
			)
		);
	}

	add_filter( 'excerpt_allowed_blocks', 'stackable_add_excerpt_blocks' );
}
