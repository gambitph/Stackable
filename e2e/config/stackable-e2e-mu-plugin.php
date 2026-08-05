<?php
/**
 * Must-use plugin for Stackable Playwright e2e tests.
 *
 * Registers post meta used by Dynamic Content tests so it can be set via the REST API.
 *
 * Load via wp-env mappings, e.g.:
 * "wp-content/mu-plugins/stackable-e2e.php": "./e2e/config/stackable-e2e-mu-plugin.php"
 */

add_action( 'init', function() {
	register_post_meta( 'post', 'stk_e2e_dc_meta', array(
		'type' => 'string',
		'single' => true,
		'show_in_rest' => true,
		'auth_callback' => function() {
			return current_user_can( 'edit_posts' );
		},
	) );
} );
