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
