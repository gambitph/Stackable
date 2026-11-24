<?php
/**
 * Site Kit package and import services.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/class-package-validator.php';
require_once __DIR__ . '/class-stackable-settings.php';
require_once __DIR__ . '/export/class-plugin-adapter.php';
require_once __DIR__ . '/import/index.php';

// WP_ENV is intentionally required so the upload and export tools cannot appear on production sites.
if ( defined( 'WP_ENV' ) && 'development' === WP_ENV ) {
	require_once __DIR__ . '/export/index.php';
	require_once __DIR__ . '/import/class-import-controller.php';
	new Stackable_Site_Kit_Import_Controller();
}
