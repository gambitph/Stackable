<?php
/**
 * Development Site Kit exporter bootstrap.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/class-portable-data.php';
require_once dirname( __DIR__ ) . '/class-stackable-settings.php';
require_once __DIR__ . '/class-export-package.php';
require_once __DIR__ . '/class-media-collector.php';
require_once __DIR__ . '/class-theme-collector.php';
require_once __DIR__ . '/class-site-collector.php';
require_once __DIR__ . '/class-pages-collector.php';
require_once __DIR__ . '/class-navigation-collector.php';
require_once __DIR__ . '/class-patterns-collector.php';
require_once __DIR__ . '/class-stackable-collector.php';
require_once __DIR__ . '/class-plugin-adapter.php';
require_once __DIR__ . '/class-plugins-collector.php';
require_once dirname( __DIR__ ) . '/class-package-validator.php';
require_once __DIR__ . '/class-archive-writer.php';
require_once __DIR__ . '/class-exporter.php';
require_once __DIR__ . '/class-export-controller.php';

if ( ! function_exists( 'stackable_create_site_kit_exporter' ) ) {
	/**
	 * Create the default Site Kit exporter and its focused collectors.
	 *
	 * @return Stackable_Site_Kit_Exporter
	 */
	function stackable_create_site_kit_exporter() {
		$media = new Stackable_Site_Kit_Media_Collector();
		$collectors = array(
			'theme' => new Stackable_Site_Kit_Theme_Collector( $media ),
			'site' => new Stackable_Site_Kit_Site_Collector(),
			'pages' => new Stackable_Site_Kit_Pages_Collector( $media ),
			'menu' => new Stackable_Site_Kit_Navigation_Collector( $media ),
			'patterns' => new Stackable_Site_Kit_Patterns_Collector( $media ),
			'stackable' => new Stackable_Site_Kit_Stackable_Collector(),
			'plugins' => new Stackable_Site_Kit_Plugins_Collector(),
		);

		return new Stackable_Site_Kit_Exporter(
			$collectors,
			$media,
			new Stackable_Site_Kit_Archive_Writer(),
			new Stackable_Site_Kit_Package_Validator()
		);
	}
}

new Stackable_Site_Kit_Export_Controller();
