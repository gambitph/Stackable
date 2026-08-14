<?php
/**
 * Run the premium PHPUnit suite when pro__premium_only/ is present.
 *
 * @package Stackable
 */

$root = dirname( __DIR__, 2 );
$premium = $root . '/pro__premium_only';

if ( ! is_dir( $premium ) ) {
	fwrite( STDOUT, "Skipping premium PHPUnit (pro__premium_only missing)\n" );
	exit( 0 );
}

$phpunit = $root . '/vendor/bin/phpunit';
$config = $premium . '/phpunit.xml.dist';

passthru(
	escapeshellarg( $phpunit ) . ' -c ' . escapeshellarg( $config ),
	$code
);
exit( $code );
