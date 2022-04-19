<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_load_videopopup_frontend_script' ) ) {
	function stackable_load_videopopup_frontend_script() {
		if ( ! is_admin() ) {
			wp_enqueue_script(
				'stk-frontend-video-popup',
				plugins_url( 'dist/frontend_block_video_popup.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION,
				true
			);
		}
	}
	add_action( 'stackable/video-popup/enqueue_scripts', 'stackable_load_videopopup_frontend_script' );
}
