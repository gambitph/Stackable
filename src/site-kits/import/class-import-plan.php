<?php
/**
 * Site Kit import selection plan.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Import_Plan' ) ) {
	class Stackable_Site_Kit_Import_Plan {

		private $groups;
		private $plugins;
		private $plugin_settings;

		public static function complete( $package_data ) {
			$plugins = array();
			foreach ( isset( $package_data['plugins'] ) ? $package_data['plugins'] : array() as $plugin ) {
				$plugins[] = $plugin['slug'];
			}
			return new self(
				array( 'pages', 'theme', 'navigation', 'stackable', 'plugins' ),
				$plugins,
				$plugins
			);
		}

		public static function from_request( $selection, $package_data ) {
			if ( ! is_array( $selection ) || ! isset( $selection['mode'] ) || ! is_string( $selection['mode'] ) ) {
				return new WP_Error( 'site_kit_import_invalid_plan', __( 'The Site Kit import mode is required.', STACKABLE_I18N ) );
			}
			if ( 'complete' === $selection['mode'] ) {
				return self::complete( $package_data );
			}
			if ( 'partial' !== $selection['mode'] ) {
				return new WP_Error( 'site_kit_import_invalid_plan', __( 'The Site Kit import mode is invalid.', STACKABLE_I18N ) );
			}

			$allowed_groups = array( 'pages', 'theme', 'navigation', 'stackable', 'plugins' );
			$groups = isset( $selection['groups'] ) && is_array( $selection['groups'] ) ? array_values( array_intersect( $allowed_groups, $selection['groups'] ) ) : array();
			$available_plugins = wp_list_pluck( isset( $package_data['plugins'] ) ? $package_data['plugins'] : array(), 'slug' );
			$plugins = isset( $selection['plugins'] ) && is_array( $selection['plugins'] ) ? array_values( array_intersect( $available_plugins, $selection['plugins'] ) ) : array();
			$plugin_settings = isset( $selection['pluginSettings'] ) && is_array( $selection['pluginSettings'] ) ? array_values( array_intersect( $plugins, $selection['pluginSettings'] ) ) : array();

			if ( in_array( 'navigation', $groups, true ) && ! in_array( 'pages', $groups, true ) ) {
				return new WP_Error( 'site_kit_import_invalid_plan', __( 'Navigation import requires pages and content.', STACKABLE_I18N ) );
			}
			if ( $plugins && ! in_array( 'plugins', $groups, true ) ) {
				return new WP_Error( 'site_kit_import_invalid_plan', __( 'Selected plugins require the Plugins group.', STACKABLE_I18N ) );
			}

			return new self( $groups, $plugins, $plugin_settings );
		}

		public function __construct( $groups, $plugins, $plugin_settings ) {
			$this->groups = array_values( array_unique( $groups ) );
			$this->plugins = array_values( array_unique( $plugins ) );
			$this->plugin_settings = array_values( array_unique( $plugin_settings ) );
		}

		public function includes( $group ) {
			return in_array( $group, $this->groups, true );
		}

		public function includes_plugin( $plugin ) {
			return in_array( $plugin, $this->plugins, true );
		}

		public function includes_plugin_settings( $plugin ) {
			return in_array( $plugin, $this->plugin_settings, true );
		}

		public function get_groups() {
			return $this->groups;
		}
	}
}
