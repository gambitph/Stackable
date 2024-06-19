<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_render_block_icon_label' ) ) {
	/**
	 * Adds a special class if block uses the old icon gap attribute
	 */
	function stackable_render_block_icon_label( $block_content, $block ) {
		$attributes = $block[ 'attrs' ];

		$hasOldIconGap = isset( $attributes[ 'iconGap' ] ) && ! isset( $attributes[ 'iconGap2' ] );

		if ( $hasOldIconGap ) {
			return preg_replace( '/stk-block-icon-label/i', 'stk-block-icon-label stk-block-icon-label--use-flex-basis', $block_content );
		}

		return $block_content;
	}
	add_filter( 'render_block_stackable/icon-label', 'stackable_render_block_icon_label', 10, 2 );
}
