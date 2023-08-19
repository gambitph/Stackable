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

if ( ! function_exists( 'stackable_get_metadata_by_folders' ) ) {
	/**
	 * Function for getting the block.json metadata
	 * based on folder names array.
	 *
	 * @array array folders
	 * @array string handle
	 * @return array metadata
	 */
	function stackable_get_metadata_by_folders( $block_folders, $handle = 'metadata' ) {
		$blocks = array();
		$blocks_dir = dirname( __FILE__ ) . '/block';
		if ( ! file_exists( $blocks_dir ) ) {
			return $blocks;
		}

		foreach ( $block_folders as $folder_name ) {
			$block_json_file = $blocks_dir . '/' . $folder_name . '/block.json';
			if ( ! file_exists( $block_json_file ) ) {
				continue;
			}

			$metadata = json_decode( file_get_contents( $block_json_file ), true );
			array_push( $blocks, array_merge( $metadata, array( 'block_json_file' => $block_json_file ) ) );
		}

		return $blocks;
	}
}

if ( ! function_exists( 'stackable_get_stk_block_folders_metadata' ) ) {
	function stackable_get_stk_block_folders_metadata() {
	/**
	 * folders containing stackable blocks without inner blocks.
	 */
	$stk_block_folders = array(
		'button',
		'count-up',
		'countdown',
		'divider',
		'heading',
		'icon-button',
		'icon-list',
		'icon',
		'image',
		'number-box',
		'map',
		'progress-bar',
		'progress-circle',
		'separator',
		'spacer',
		'subtitle',
		'table-of-contents',
		'tab-labels',
		'text',
	);

	return stackable_get_metadata_by_folders( $stk_block_folders, 'stk-block-folders' );
	}
}

if ( ! function_exists( 'stackable_get_stk_wrapper_block_folders_metadata' ) ) {
	function stackable_get_stk_wrapper_block_folders_metadata() {
		/**
		 * folders containing stackable blocks with inner blocks.
		 */
		$stk_wrapper_block_folders = array(
			'accordion',
			'blockquote',
			'button-group',
			'call-to-action',
			'card',
			'column',
			'columns',
			'expand',
			'feature-grid',
			'feature',
			'hero',
			'icon-box',
			'icon-label',
			'image-box',
			'notification',
			'posts',
			'price',
			'tabs',
			'tab-content',
			'pricing-box',
			'team-member',
			'testimonial',
			'timeline',
			'video-popup',
			'horizontal-scroller',
		);

		return stackable_get_metadata_by_folders( $stk_wrapper_block_folders, 'stk-wrapper-block-folders' );
	}

}

if ( ! function_exists( 'stackable_register_blocks' ) ) {
	function stackable_register_blocks() {
		// Blocks directory may not exist if working from a fresh clone.
		$blocks_dir = dirname( __FILE__ ) . '/block';
		if ( ! file_exists( $blocks_dir ) ) {
			return;
		}

		$blocks_metadata = array_merge(
			stackable_get_stk_block_folders_metadata(),
			stackable_get_stk_wrapper_block_folders_metadata()
		);

		foreach ( $blocks_metadata as $metadata ) {
			$registry = WP_Block_Type_Registry::get_instance();
			if ( $registry->is_registered( $metadata['name'] ) ) {
				$registry->unregister( $metadata['name'] );
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

			register_block_type_from_metadata( $metadata['block_json_file'], $register_options );
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
		$blocks_dir = dirname( __FILE__ ) . '/block';
		if ( ! file_exists( $blocks_dir ) ) {
			return $allowed_wrapper_blocks;
		}

		$allowed_stackable_wrapper_blocks = array();
		$blocks_metadata = stackable_get_stk_wrapper_block_folders_metadata();

		foreach ( $blocks_metadata as $metadata ) {
			array_push( $allowed_stackable_wrapper_blocks, $metadata['name'] );
		}

		return array_merge( $allowed_stackable_wrapper_blocks, $allowed_wrapper_blocks );
	}

	add_filter( 'excerpt_allowed_wrapper_blocks', 'stackable_add_excerpt_wrapper_blocks' );
}

if ( ! function_exists( 'stackable_add_excerpt_blocks' ) ) {
	/**
	 * Register "unit" stackable blocks (blocks without inner blocks)
	 */
	function stackable_add_excerpt_blocks( $allowed_blocks ) {
		$blocks_dir = dirname( __FILE__ ) . '/block';
		if ( ! file_exists( $blocks_dir ) ) {
			return $allowed_blocks;
		}

		$allowed_stackable_blocks = array();
		$blocks_metadata = stackable_get_stk_block_folders_metadata();

		foreach ( $blocks_metadata as $metadata ) {
			array_push( $allowed_stackable_blocks, $metadata['name'] );
		}

		return array_merge( $allowed_stackable_blocks, $allowed_blocks );
	}

	add_filter( 'excerpt_allowed_blocks', 'stackable_add_excerpt_blocks' );
}
