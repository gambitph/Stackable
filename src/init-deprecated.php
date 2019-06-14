<?php
/**
 * Blocks Initializer - For supporting backward compatibility with WordPress / Gutenberg.
 *
 * @since 	1.15.5
 * @package Stackable
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_gutenberg_blockeditor_5_1_backward_compatibility' ) ) {

	/**
	 * In Gutenberg 5.9, a lot of Components in @wordpress/editor moved to @wordpress/block-editor.
	 * Stackable scripts have migrated to '@wordpress/block-editor' (wp.blockEditor), but this was only introduced
	 * in WordPress 5.2.
	 *
	 * This function brings support for WordPress 5.1, where wp.blockEditor was not yet available.
	 */
	function stackable_gutenberg_blockeditor_5_1_backward_compatibility() {
		$custom_js = "if ( typeof wp.blockEditor === 'undefined' ) { wp.blockEditor = wp.editor }";
		wp_add_inline_script( 'ugb-block-js-vendor', $custom_js );
	}
	add_action( 'enqueue_block_assets', 'stackable_gutenberg_blockeditor_5_1_backward_compatibility', 8 );
}
