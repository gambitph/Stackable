<?php
/**
 * In charge of loading the frontend polyfill for timeline block
 * accent color fill for iOS devices
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_load_timeline_ios_frontend_polyfill' ) ) {
	function stackable_load_timeline_ios_frontend_polyfill( $block_content, $block ) {
		// Add class stk-block-timeline__ios-polyfill to $block_content
		return preg_replace( '/stk-block-timeline/', 'stk-block-timeline stk-block-timeline__ios-polyfill', $block_content, 1 );
	}

	$user_agent = ! empty( $_SERVER['HTTP_USER_AGENT'] ) ? $_SERVER['HTTP_USER_AGENT'] : '';
	// Add polyfill if device is iPhone/iPad
	// Include Safari because by default the User Agent in Safari on iPadOS is same  on MacOS
	// Reference: https://developer.apple.com/forums/thread/119186
	if ( ! empty( $user_agent ) && ( stripos( $user_agent, 'iPhone' ) !== false || stripos( $user_agent, 'iPad' ) !== false || stripos( $user_agent, 'Safari/' ) !== false ) ) {
		add_filter( 'render_block_stackable/timeline', 'stackable_load_timeline_ios_frontend_polyfill', 10, 2 );
	}
}
