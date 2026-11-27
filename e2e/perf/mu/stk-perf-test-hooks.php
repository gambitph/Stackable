<?php
/**
 * Test hooks for the Stackable frontend performance suite (e2e/perf).
 * Installed as a mu-plugin on the throwaway perf test site only. Nothing here
 * runs unless a request opts in with a header or a query arg.
 *
 * - Header "X-Stk-Perf: 1"        Appends <!-- stk-perf {"queries":..,"peak":..,"query_log":[..]} --> after </html>
 *                                  (query_log: queries run after mu-plugins loaded).
 * - Header "X-Stk-Perf-No-Stk: 1" Loads the request without Stackable (for the "core" reference).
 * - ?stk_late=<post id>           Prints that post's blocks after the footer scripts (late render).
 * - ?stk_force=1                  Turns on the stackable_force_css_load filter.
 * - admin-ajax action stk_perf_ajax&post=<id>  Returns the rendered blocks of a post (AJAX render).
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! empty( $_SERVER['HTTP_X_STK_PERF_NO_STK'] ) ) {
	add_filter( 'option_active_plugins', function( $plugins ) {
		return array_values( array_filter( (array) $plugins, function( $p ) {
			return strpos( $p, 'stackable' ) === false;
		} ) );
	} );
}

if ( ! empty( $_SERVER['HTTP_X_STK_PERF'] ) ) {
	$GLOBALS['stk_perf_queries'] = array();
	add_filter( 'query', function( $q ) {
		$GLOBALS['stk_perf_queries'][] = preg_replace( '/\s+/', ' ', $q );
		return $q;
	} );
	add_action( 'shutdown', function() {
		global $wpdb;
		if ( wp_doing_ajax() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
			return;
		}
		$included = get_included_files();
		// Plugins can be symlinked, included files have the real path.
		$dir = defined( 'STACKABLE_FILE' ) ? realpath( dirname( STACKABLE_FILE ) ) . '/' : '/plugins/stackable';
		$stk = array_values( array_filter( $included, function( $f ) use ( $dir ) {
			return strpos( $f, $dir ) !== false;
		} ) );
		echo "\n<!-- stk-perf " . wp_json_encode( array(
			'queries' => (int) $wpdb->num_queries,
			'peak' => memory_get_peak_usage(),
			'files' => count( $included ),
			'stk_files' => count( $stk ),
			'opcache' => function_exists( 'opcache_get_status' ) && @opcache_get_status( false ) ? 1 : 0,
			'query_log' => $GLOBALS['stk_perf_queries'],
			'stk_file_list' => empty( $_SERVER['HTTP_X_STK_PERF_FILES'] ) ? array() : array_map( function( $f ) use ( $dir ) {
				return str_replace( $dir, '', $f ) . ' ' . filesize( $f );
			}, $stk ),
		) ) . " -->\n";
	}, PHP_INT_MAX );
}

if ( ! empty( $_GET['stk_force'] ) ) {
	add_filter( 'stackable_force_css_load', '__return_true' );
}

if ( ! empty( $_GET['stk_late'] ) ) {
	add_action( 'wp_footer', function() {
		$post = get_post( (int) $_GET['stk_late'] );
		if ( $post ) {
			echo '<div id="stk-perf-late">' . do_blocks( $post->post_content ) . '</div>';
		}
	}, 100 );
}

$stk_perf_ajax = function() {
	$post = get_post( isset( $_REQUEST['post'] ) ? (int) $_REQUEST['post'] : 0 );
	echo $post ? do_blocks( $post->post_content ) : '';
	wp_die();
};
add_action( 'wp_ajax_stk_perf_ajax', $stk_perf_ajax );
add_action( 'wp_ajax_nopriv_stk_perf_ajax', $stk_perf_ajax );
