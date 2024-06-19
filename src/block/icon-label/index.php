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

		// check if the block uses the old icon gap attribute
		$use_old_styles = ( isset( $attributes[ 'iconGap' ] ) || isset( $block[ 'innerBlocks' ][0]['attrs']['iconSize'] ) ) && ! isset( $attributes[ 'iconGap2' ] );

		if ( $use_old_styles ) {
			return preg_replace( '/stk-block-icon-label/i', 'stk-block-icon-label stk-block-icon-label--use-flex-basis', $block_content );
		}

		return $block_content;
	}
	add_filter( 'render_block_stackable/icon-label', 'stackable_render_block_icon_label', 10, 2 );
}
