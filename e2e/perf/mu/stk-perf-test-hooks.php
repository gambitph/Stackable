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
 * - ?stk_inject=<post id>         A script in the footer adds that post's saved HTML (not rendered by
 *                                  PHP) to the page content on DOMContentLoaded, like a script that adds markup after load.
 * - ?stk_all_block_assets=1       WordPress enqueues every block stylesheet (not on demand), like classic
 *                                  themes below WordPress 6.9 or sites that turn on-demand loading off.
 * - ?stk_notices=1               Appends <!-- stk-notices [..] --> with the _doing_it_wrong() messages of the request.
 * - ?stk_no_loader=1             Turns off the injected-block CSS loader (stackable_frontend_css_injected_loader).
 * - ?stk_no_finalize=1            Turns off moving late CSS into the first <style> (stackable_frontend_css_finalize_in_buffer).
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
		) ) . " -->\n";
	}, PHP_INT_MAX );
}

if ( ! empty( $_GET['stk_no_finalize'] ) ) {
	add_filter( 'stackable_frontend_css_finalize_in_buffer', '__return_false' );
}

if ( ! empty( $_GET['stk_all_block_assets'] ) ) {
	add_filter( 'should_load_block_assets_on_demand', '__return_false', 99 );
	add_filter( 'should_load_separate_core_block_assets', '__return_false', 99 );
}

if ( ! empty( $_GET['stk_notices'] ) ) {
	$GLOBALS['stk_perf_notices'] = array();
	add_action( 'doing_it_wrong_run', function( $function, $message ) {
		$GLOBALS['stk_perf_notices'][] = $function . ': ' . wp_strip_all_tags( $message );
	}, 10, 2 );
	add_action( 'shutdown', function() {
		echo "\n<!-- stk-notices " . str_replace( '--', '- -', wp_json_encode( $GLOBALS['stk_perf_notices'] ) ) . " -->\n";
	}, 0 );
}

if ( ! empty( $_GET['stk_no_loader'] ) ) {
	add_filter( 'stackable_frontend_css_injected_loader', '__return_false' );
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

if ( ! empty( $_GET['stk_inject'] ) ) {
	add_action( 'wp_footer', function() {
		$post = get_post( (int) $_GET['stk_inject'] );
		if ( $post ) {
			// Added on DOMContentLoaded, after every footer script ran, like markup fetched and added by a script.
			echo '<script>document.addEventListener("DOMContentLoaded",function(){var d=document.createElement("div");d.id="stk-perf-injected";d.innerHTML=' . wp_json_encode( $post->post_content ) . ';var t=document.querySelector(".wp-block-post-content, .entry-content, main")||document.body;t.appendChild(d);});</script>';
		}
	}, 1 );
}

$stk_perf_ajax = function() {
	$post = get_post( isset( $_REQUEST['post'] ) ? (int) $_REQUEST['post'] : 0 );
	echo $post ? do_blocks( $post->post_content ) : '';
	wp_die();
};
add_action( 'wp_ajax_stk_perf_ajax', $stk_perf_ajax );
add_action( 'wp_ajax_nopriv_stk_perf_ajax', $stk_perf_ajax );
