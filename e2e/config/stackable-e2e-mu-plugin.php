<?php
/**
 * Must-use plugin for Stackable Playwright e2e tests.
 *
 * - Registers post meta used by Dynamic Content tests so it can be set via REST.
 * - Mocks Design Library CDN responses so free/premium suites do not depend on
 *   outbound network to stackable-files.pages.dev.
 *
 * Mounted by playwright.config.js and playwright.premium.config.js into
 * Playground as `wp-content/mu-plugins/stackable-e2e.php`.
 *
 * Fixtures live under the mounted plugin tree:
 * `wp-content/plugins/stackable/e2e/config/fixtures/`.
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

/**
 * Serve local Design Library fixtures instead of hitting the CDN.
 *
 * Matches `library-v4/library.json` and `library-v4/pages.json` requests from
 * `Stackable_Design_Library::get_design_library_from_cloud()`.
 *
 * @param false|array|WP_Error $preempt
 * @param array                $args
 * @param string               $url
 * @return false|array
 */
add_filter( 'pre_http_request', function( $preempt, $args, $url ) {
	if ( false !== $preempt ) {
		return $preempt;
	}

	$fixture_file = null;
	if ( false !== strpos( $url, 'library-v4/library.json' ) ) {
		$fixture_file = 'design-library-patterns.json';
	} elseif ( false !== strpos( $url, 'library-v4/pages.json' ) ) {
		$fixture_file = 'design-library-pages.json';
	}

	if ( ! $fixture_file ) {
		return $preempt;
	}

	$fixture_path = WP_PLUGIN_DIR . '/stackable/e2e/config/fixtures/' . $fixture_file;
	if ( ! is_readable( $fixture_path ) ) {
		return $preempt;
	}

	$body = file_get_contents( $fixture_path );
	if ( false === $body || '' === $body ) {
		return $preempt;
	}

	return array(
		'headers'  => array(
			'content-type' => 'application/json',
		),
		'body'     => $body,
		'response' => array(
			'code'    => 200,
			'message' => 'OK',
		),
		'cookies'  => array(),
		'filename' => null,
	);
}, 10, 3 );
