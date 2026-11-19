<?php
/**
 * In charge of loading the frontend polyfill for timeline block
 * accent color fill for iOS devices
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_is_timeline_ios_polyfill_user_agent' ) ) {
	/**
	 * Whether the Timeline iOS line-fill workaround should run for this visitor.
	 *
	 * Chrome, Edge, and Android browsers include "Safari/" in their user agent.
	 * Real Safari also includes "Version/" and does not include "Chrome/".
	 * Keep iPhone, iPad, and Safari so iPadOS Safari (which can report the same
	 * user agent as macOS Safari) still gets the workaround.
	 * See https://developer.apple.com/forums/thread/119186
	 *
	 * @param string $user_agent
	 * @return bool
	 */
	function stackable_is_timeline_ios_polyfill_user_agent( $user_agent ) {
		if ( empty( $user_agent ) ) {
			return false;
		}

		if ( stripos( $user_agent, 'iPhone' ) !== false || stripos( $user_agent, 'iPad' ) !== false ) {
			return true;
		}

		return stripos( $user_agent, 'Safari/' ) !== false &&
			stripos( $user_agent, 'Version/' ) !== false &&
			stripos( $user_agent, 'Chrome/' ) === false;
	}
}

if ( ! function_exists( 'stackable_load_timeline_ios_frontend_polyfill' ) ) {
	function stackable_load_timeline_ios_frontend_polyfill( $block_content, $block ) {
		// Add class stk-block-timeline__ios-polyfill to $block_content
		return preg_replace( '/stk-block-timeline/', 'stk-block-timeline stk-block-timeline__ios-polyfill', $block_content, 1 );
	}

	$user_agent = ! empty( $_SERVER['HTTP_USER_AGENT'] ) ? $_SERVER['HTTP_USER_AGENT'] : '';
	if ( stackable_is_timeline_ios_polyfill_user_agent( $user_agent ) ) {
		add_filter( 'render_block_stackable/timeline', 'stackable_load_timeline_ios_frontend_polyfill', 10, 2 );
	}
}
