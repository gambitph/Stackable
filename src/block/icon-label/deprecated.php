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

		// check if inner blocks contain an icon block
		if ( ! isset( $block[ 'innerBlocks' ][0] ) || ! isset( $block[ 'innerBlocks' ][0]['blockName'] ) || $block[ 'innerBlocks' ][0]['blockName'] !== 'stackable/icon' ) {
			return $block_content;
		}

		$has_icon_gap = isset( $attributes[ 'iconGap' ] ) || isset( $attributes[ 'iconGapTablet' ] ) || isset( $attributes[ 'iconGapMobile' ] );
		$has_icon_gap2 = isset( $attributes[ 'iconGap2' ] ) || isset( $attributes[ 'iconGap2Tablet' ] ) || isset( $attributes[ 'iconGap2Mobile' ] );

		$icon_block_attrs = $block[ 'innerBlocks' ][0]['attrs'];
		$has_icon_size = isset( $icon_block_attrs['iconSize'] ) || isset( $icon_block_attrs['iconSizeTablet'] ) || isset( $icon_block_attrs['iconSizeMobile'] );


		// check if the block uses the old icon gap attribute
		$use_old_styles = ( $has_icon_gap || $has_icon_size ) && ! $has_icon_gap2;

		if ( $use_old_styles ) {
			return preg_replace( '/stk-block-icon-label/i', 'stk-block-icon-label stk-block-icon-label--use-flex-basis', $block_content );
		}

		return $block_content;
	}
	add_filter( 'render_block_stackable/icon-label', 'stackable_render_block_icon_label', 10, 2 );
}
