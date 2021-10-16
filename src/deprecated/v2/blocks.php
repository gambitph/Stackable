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

	/**
	 * Checks whether we're editing a post in Gutenberg, then loads the v2
	 * scripts only when there are v2 blocks present in the content.
	 *
	 * @return void
	 */
	function stackable_load_editor_blocks_v2() {
		$current_screen = get_current_screen();
		if ( $current_screen->base === 'post' && $current_screen->is_block_editor() ) {
			$content = get_the_content();
			if ( stripos( $content, '<!-- wp:ugb/' ) !== false ) {
				stackable_register_blocks_v2();
				return;
			}

			// If we can't find it, maybe another plugin changed the output
			// of get_the_content(), try getting it again.
			global $post;
			$content = ! empty( $post ) ? $post->post_content : $content;
			if ( stripos( $content, '<!-- wp:ugb/' ) !== false ) {
				stackable_register_blocks_v2();
				return;
			}

			// If no v2 blocks found, check for any reusable blocks in the
			// current content.
			if ( stripos( $content, '<!-- wp:block' ) !== false ) {
				// Find all reusable block reference Ids.
				if ( preg_match_all( '#wp:block(.*?)[\'"]ref[\'"]*:(\d+)#', $content, $matches ) ) {
					if ( count( $matches ) >= 3 ) {
						foreach ( $matches[2] as $reusable_id ) {

							// Reusable block Ids are post ids.
							$resuable_post = get_post( (int) $reusable_id );
							$reusable_content = ! empty( $resuable_post ) ? $resuable_post->post_content : '';

							// Check if the reusable block uses a v2 block.
							if ( stripos( $reusable_content, '<!-- wp:ugb/' ) !== false ) {
								stackable_register_blocks_v2();
								return;
							}
						}
					}
				}
			}

		}
	}

	if ( has_stackable_v2_frontend_compatibility() && ! is_admin() ) {
		// Load the scripts normally in the frontend.
		add_action( 'init', 'stackable_register_blocks_v2' );
	} else if ( has_stackable_v2_editor_compatibility() ) {
		if ( ! is_admin() || ! has_stackable_v2_editor_compatibility_usage() ) {
			// Load the block scripts normally in the editor.
			add_action( 'init', 'stackable_register_blocks_v2' );
		} else {
			// This only loads v2 stackable blocks in the editor if there are v2
			// blocks existing in the content.
			add_action( 'enqueue_block_editor_assets', 'stackable_load_editor_blocks_v2' );
		}
	}
}

/**
 * Allow our blocks to display post excerpts
 * when calling `get_the_excerpt` function.
 *
 * @see https://developer.wordpress.org/reference/hooks/excerpt_allowed_blocks/
 */
if ( ! function_exists( 'stackable_add_excerpt_wrapper_blocks_v2' ) ) {
	/**
	 * Register stackable blocks with inner blocks.
	 */
	function stackable_add_excerpt_wrapper_blocks_v2( $allowed_wrapper_blocks ) {
		$allowed_stackable_wrapper_blocks = [
			// ugb blocks.
			'ugb/accordion',
			'ugb/column',
			'ugb/columns',
			'ugb/container',
		];

		return array_merge( $allowed_stackable_wrapper_blocks, $allowed_wrapper_blocks );
	}

	add_filter( 'excerpt_allowed_wrapper_blocks', 'stackable_add_excerpt_wrapper_blocks_v2' );
}

if ( ! function_exists( 'stackable_add_excerpt_blocks_v2' ) ) {
	/**
	 * Register "unit" stackable blocks (blocks without inner blocks)
	 */
	function stackable_add_excerpt_blocks_v2( $allowed_blocks ) {
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
		];

		return array_merge( $allowed_stackable_blocks, $allowed_blocks );
	}

	add_filter( 'excerpt_allowed_blocks', 'stackable_add_excerpt_blocks_v2' );
}
