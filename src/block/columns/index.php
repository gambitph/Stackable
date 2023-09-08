<?php
/**
 * In charge of loading the frontend polyfill for columns block :has() selector
 * support
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_load_columns_firefox_frontend_polyfill' ) ) {
	function stackable_load_columns_firefox_frontend_polyfill( $block_content, $block ) {
		if ( count( $block['innerBlocks'] ) === 1 ) {
			// Add class stk-block-columns--has-single-block-polyfill to $block_content
			return preg_replace( '/stk-block-columns/', 'stk-block-columns stk-block-columns--has-single-block-polyfill', $block_content, 1 );
		}
		return $block_content;
	}

	$user_agent = ! empty( $_SERVER['HTTP_USER_AGENT'] ) ? $_SERVER['HTTP_USER_AGENT'] : '';
	if ( ! empty( $user_agent ) && stripos( $user_agent, 'Firefox/' ) !== false ) {
		add_filter( 'render_block_stackable/columns', 'stackable_load_columns_firefox_frontend_polyfill', 10, 2 );
	}
}
