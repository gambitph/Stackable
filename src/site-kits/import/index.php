<?php
/**
 * Shared Site Kit import bootstrap.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/class-import-package.php';
require_once __DIR__ . '/class-package-reader.php';
require_once __DIR__ . '/class-import-plan.php';
require_once __DIR__ . '/class-import-rollback.php';
require_once __DIR__ . '/class-media-importer.php';
require_once __DIR__ . '/class-theme-importer.php';
require_once __DIR__ . '/class-content-importer.php';
require_once __DIR__ . '/class-plugin-importer.php';
require_once __DIR__ . '/class-settings-importer.php';
require_once __DIR__ . '/class-importer.php';

if ( ! function_exists( 'stackable_create_site_kit_package_reader' ) ) {
	function stackable_create_site_kit_package_reader() {
		return new Stackable_Site_Kit_Package_Reader( new Stackable_Site_Kit_Package_Validator() );
	}
}

if ( ! function_exists( 'stackable_create_site_kit_importer' ) ) {
	function stackable_create_site_kit_importer() {
		$rollback = new Stackable_Site_Kit_Import_Rollback();
		$media = new Stackable_Site_Kit_Media_Importer( $rollback );
		return new Stackable_Site_Kit_Importer(
			$rollback,
			$media,
			new Stackable_Site_Kit_Theme_Importer( $rollback, $media ),
			new Stackable_Site_Kit_Content_Importer( $rollback, $media ),
			new Stackable_Site_Kit_Plugin_Importer( $rollback ),
			new Stackable_Site_Kit_Settings_Importer( $rollback, $media )
		);
	}
}
