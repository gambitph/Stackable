<?php
/**
 * PHPUnit bootstrap file
 */

// Composer autoloader must be loaded before WP_PHPUNIT__DIR will be available
putenv( 'WP_PHPUNIT__TESTS_CONFIG=' . dirname( __DIR__ ) . '/tests/wp-config.php' );

require_once dirname( __DIR__ ) . '/vendor/autoload.php';

// Give access to tests_add_filter() function.
require_once getenv( 'WP_PHPUNIT__DIR' ) . '/includes/functions.php';

tests_add_filter( 'muplugins_loaded', function() {
    if ( getenv( 'MYSQL_GITHUB_ACTION' ) ) {
        // Use the build folder to access Stackable.
        require dirname( __DIR__ ) . '/build/stackable/plugin.php';
    } else {
        // Otherwise, use the dev plugin.php file.
        require dirname( __DIR__ ) . '/plugin.php';
    }
} );

// Start up the WP testing environment.
require getenv( 'WP_PHPUNIT__DIR' ) . '/includes/bootstrap.php';
