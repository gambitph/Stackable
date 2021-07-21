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

if ( ! function_exists( 'stackable_get_all_v2_blocks_json_paths' ) ) {
	function stackable_get_all_v2_blocks_json_paths() {
		// Blocks directory may not exist if working from a fresh clone.
		$blocks_dir = dirname( __FILE__ ) . '/block';
		if ( ! file_exists( $blocks_dir ) ) {
			return;
		}

		$block_folders = array(
			'accordion',
			'blockquote',
			'blog-posts',
			'button',
			'call-to-action',
			'card',
			'column',
			'columns',
			'container',
			'count-up',
			'design-library',
			'divider',
			'expand',
			'feature',
			'feature-grid',
			'header',
			'heading',
			'icon',
			'icon-list',
			'image-box',
			'notification',
			'number-box',
			'pricing-box',
			'separator',
			'spacer',
			'team-member',
			'testimonial',
			'text',
			'video-popup',
		);

		$paths = array();
		foreach ( $block_folders as $folder_name ) {
			$block_json_file = $blocks_dir . '/' . $folder_name . '/block.json';
			if ( file_exists( $block_json_file ) ) {
				$paths[] = $block_json_file;
			}
		}

		return $paths;
	}
}

if ( ! function_exists( 'stackable_register_blocks_v2' ) ) {
	function stackable_register_blocks_v2() {
		$block_json_files = stackable_get_all_v2_blocks_json_paths();

		foreach ( $block_json_files as $block_json_file ) {
			$metadata = json_decode( file_get_contents( $block_json_file ), true );

			$registry = WP_Block_Type_Registry::get_instance();
			if ( $registry->is_registered( $metadata['name'] ) ) {
				$registry->unregister( $metadata['name'] );
			}

			$register_options = apply_filters( 'stackable.v2.register-blocks.options',
				// This automatically enqueues all our styles and scripts.
				array(
					'style' => 'ugb-style-css-v2', // Frontend styles.
					'script' => 'ugb-block-frontend-js-v2', // Frontend scripts.
					'editor_script' => 'ugb-block-js-v2', // Editor scripts.
					'editor_style' => 'ugb-block-editor-css-v2', // Editor styles.
				),
				$metadata['name'],
				$metadata
			);

			register_block_type_from_metadata( $block_json_file, $register_options );
		}
	}

	if ( has_stackable_v2_editor_compatibility() ) {
		add_action( 'init', 'stackable_register_blocks_v2' );
	}
}

