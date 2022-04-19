<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_load_notification_frontend_script' ) ) {
	function stackable_load_notification_frontend_script() {
		if ( ! is_admin() ) {
			wp_enqueue_script(
				'stk-frontend-notification',
				plugins_url( 'dist/frontend_block_notification.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION,
				true
			);
		}
	}
	add_action( 'stackable/notification/enqueue_scripts', 'stackable_load_notification_frontend_script' );
}
