<?php
/**
 * Plugin adapter contract for Site Kit exports.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! interface_exists( 'Stackable_Site_Kit_Plugin_Adapter' ) ) {
	interface Stackable_Site_Kit_Plugin_Adapter {

		/**
		 * Export explicitly allowlisted portable plugin settings.
		 *
		 * @return array
		 */
		public function export_settings();

		/**
		 * Whether the plugin is required by the exported site.
		 *
		 * @return bool
		 */
		public function is_required();
	}
}

if ( ! interface_exists( 'Stackable_Site_Kit_Plugin_Import_Adapter' ) ) {
	interface Stackable_Site_Kit_Plugin_Import_Adapter extends Stackable_Site_Kit_Plugin_Adapter {

		/**
		 * Validate portable settings before any import writes occur.
		 *
		 * @param array $settings Portable plugin settings.
		 * @return true|WP_Error
		 */
		public function validate_import_settings( $settings );

		/**
		 * Capture the plugin state required to reverse a settings import.
		 *
		 * @return mixed|WP_Error
		 */
		public function snapshot_import_settings();

		/**
		 * Import portable plugin settings.
		 *
		 * @param array $settings Portable plugin settings.
		 * @return true|WP_Error
		 */
		public function import_settings( $settings );

		/**
		 * Restore plugin settings from a pre-import snapshot.
		 *
		 * @param mixed $snapshot State returned by snapshot_import_settings().
		 * @return true|WP_Error
		 */
		public function restore_import_settings( $snapshot );
	}
}
