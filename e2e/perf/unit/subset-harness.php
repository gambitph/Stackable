<?php
/**
 * CLI harness for frontend-css-rules.test.js: prints Stackable_Frontend_CSS::get_css_subset()
 * for a rules file. Usage: php subset-harness.php <file.css> <comma separated tokens> <max columns>
 * The WordPress functions the class calls when it loads are stubbed.
 */
define( 'ABSPATH', __DIR__ );
foreach ( array( 'add_action', 'add_filter', 'remove_action', 'remove_filter', 'register_activation_hook' ) as $fn ) {
	eval( "function $fn() { return true; }" );
}
function apply_filters( $tag, $value ) { return $value; }
function get_option( $name, $default = false ) { return $default; }
function is_admin() { return false; }
require dirname( __DIR__, 3 ) . '/src/frontend-css.php';
$tokens = array_fill_keys( array_filter( explode( ',', $argv[2] ) ), true );
echo Stackable_Frontend_CSS::get_css_subset( $argv[1], $tokens, (int) $argv[3] );
