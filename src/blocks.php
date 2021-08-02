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
		// Blocks directory may not exist if working from a fresh clone.
		$blocks_dir = dirname( __FILE__ ) . '/block';
		if ( ! file_exists( $blocks_dir ) ) {
			return;
		}

		// TODO: Include all blocks.
		$block_folders = array(
			'button',
			'button-group',
			'card',
			'call-to-action',
			'column',
			'columns',
			'container',
			'feature',
			'feature-grid',
			'header',
			'heading',
			'icon',
			'icon-list',
			'image',
			'text',
		);

		foreach ( $block_folders as $folder_name ) {
			$block_json_file = $blocks_dir . '/' . $folder_name . '/block.json';
			if ( ! file_exists( $block_json_file ) ) {
				continue;
			}

			$metadata = json_decode( file_get_contents( $block_json_file ), true );

			$registry = WP_Block_Type_Registry::get_instance();
			if ( $registry->is_registered( $metadata['name'] ) ) {
				$registry->unregister( $metadata['name'] );
			}

			$register_options = apply_filters( 'stackable.register-blocks.options',
				// This automatically enqueues all our styles and scripts.
				array(
					'style' => 'ugb-style-css', // Frontend styles.
					'script' => 'ugb-block-frontend-js', // Frontend scripts.
					'editor_script' => 'ugb-block-js', // Editor scripts.
					'editor_style' => 'ugb-block-editor-css', // Editor styles.
				),
				$metadata['name'],
				$metadata
			);

			register_block_type_from_metadata( $block_json_file, $register_options );
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
		$allowed_stackable_wrapper_blocks = [
			// ugb blocks.
			'ugb/accordion',
			'ugb/column',
			'ugb/columns',
			'ugb/container',

			// stackable blocks.
			// TODO: add more blocks
			'stackable/button-group',
			'stackable/card-group',
			'stackable/card',
			'stackable/column',
			'stackable/columns',
			'stackable/container',
			'stackable/feature',
			'stackable/number-box'
		];

		return array_merge( $allowed_stackable_wrapper_blocks, $allowed_wrapper_blocks );
	}

	add_filter( 'excerpt_allowed_wrapper_blocks', 'stackable_add_excerpt_wrapper_blocks' );
}

if ( ! function_exists( 'stackable_add_excerpt_blocks' ) ) {
	/**
	 * Register "unit" stackable blocks (blocks without inner blocks)
	 */
	function stackable_add_excerpt_blocks( $allowed_blocks ) {
		$allowed_stackable_blocks = [
			// ugb blocks.
			'ugb/blockquote',
			'ugb/blog-posts',
			'ugb/button',
			'ugb/cta',
			'ugb/card',
			'ugb/count-up',
			'ugb/expand',
			'ugb/feature-grid',
			'ugb/feature',
			'ugb/header',
			'ugb/heading',
			'ugb/icon-list',
			'ugb/icon',
			'ugb/image-box',
			'ugb/notification',
			'ugb/number-box',
			'ugb/pricing-box',
			'ugb/team-member',
			'ugb/testimonial',
			'ugb/text',
			'ugb/video-popup',

			// stackable blocks.
			// TODO: add more blocks
			'stackable/button',
			'stackable/heading',
			'stackable/icon',
			'stackable/icon-label',
			'stackable/icon-list',
			'stackable/image',
			'stackable/text'
		];

		return array_merge( $allowed_stackable_blocks, $allowed_blocks );
	}

	add_filter( 'excerpt_allowed_blocks', 'stackable_add_excerpt_blocks' );
}
