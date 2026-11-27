<?php
/**
 * CLI harness for frontend-css-rules.test.js: prints
 * Stackable_Frontend_CSS_Rules::get_matching_css() for a stylesheet.
 *
 * Usage: php subset-harness.php <file.css> <comma separated classes> <max columns>
 */
define( 'ABSPATH', __DIR__ );
require dirname( __DIR__, 3 ) . '/src/frontend-css/class-rules.php';
$classes = array_fill_keys( array_filter( explode( ',', $argv[2] ) ), true );
echo Stackable_Frontend_CSS_Rules::get_matching_css( $argv[1], $classes, (int) $argv[3] );
