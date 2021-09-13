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

/**
 * folders containing stackable blocks without inner blocks.
 */
$stk_block_folders = array(
	'button',
	'count-up',
	'heading',
	'icon',
	'icon-list',
	'image',
	'price',
	'text',
	'posts'
);

/**
 * folders containing stackable blocks with inner blocks.
 */
$stk_wrapper_block_folders = array(
	'button-group',
	'blockquote',
	'card',
	'call-to-action',
	'column',
	'columns',
	'container',
	'expand',
	'feature',
	'feature-grid',
	'hero',
	'icon-box',
	'icon-label',
	'notification',
	'pricing-box',
);

if ( ! function_exists( 'stackable_get_metadata_by_folders' ) ) {
	/**
	 * Function for getting the block.json metadata
	 * based on folder names array.
	 *
	 * @array array folders
	 * @return array metadata
	 */
	function stackable_get_metadata_by_folders( $block_folders ) {
		// Check if the metadata have been parsed already.
		global $stk_block_meta_data_cache;
		if ( ! empty( $stk_block_meta_data_cache ) ) {
			return $stk_block_meta_data_cache;
		}

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

		$stk_block_meta_data_cache = $blocks; // Cache.
		return $blocks;
	}
}

if ( ! function_exists( 'stackable_register_blocks' ) ) {
	function stackable_register_blocks() {
		global $stk_block_folders, $stk_wrapper_block_folders;
		// Blocks directory may not exist if working from a fresh clone.
		$blocks_dir = dirname( __FILE__ ) . '/block';
		if ( ! file_exists( $blocks_dir ) ) {
			return;
		}

		$blocks_metadata = stackable_get_metadata_by_folders( array_merge(
			$stk_wrapper_block_folders,
			$stk_block_folders
		) );

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

		global $stk_wrapper_block_folders;
		$allowed_stackable_wrapper_blocks = array();
		$blocks_metadata = stackable_get_metadata_by_folders( $stk_wrapper_block_folders );

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

		global $stk_block_folders;
		$allowed_stackable_blocks = array();
		$blocks_metadata = stackable_get_metadata_by_folders( $stk_block_folders );

		foreach ( $blocks_metadata as $metadata ) {
			array_push( $allowed_stackable_blocks, $metadata['name'] );
		}

		return array_merge( $allowed_stackable_blocks, $allowed_blocks );
	}

	add_filter( 'excerpt_allowed_blocks', 'stackable_add_excerpt_blocks' );
}
