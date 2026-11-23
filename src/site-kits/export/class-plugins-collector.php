<?php
/**
 * Active plugin collector for Site Kit exports.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Plugins_Collector' ) ) {
	class Stackable_Site_Kit_Plugins_Collector {

		private $warnings = array();

		public function collect( $context = array() ) {
			if ( ! function_exists( 'get_plugins' ) && file_exists( ABSPATH . 'wp-admin/includes/plugin.php' ) ) {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
			}
			if ( ! function_exists( 'get_plugins' ) ) {
				return array();
			}

			$active_plugins = (array) get_option( 'active_plugins', array() );
			if ( is_multisite() ) {
				$active_plugins = array_merge( $active_plugins, array_keys( (array) get_site_option( 'active_sitewide_plugins', array() ) ) );
			}
			$active_plugins = array_values( array_unique( $active_plugins ) );
			$plugin_data = get_plugins();
			$adapters = apply_filters( 'stackable_site_kit_export_plugin_adapters', array() );
			$stackable_plugin = function_exists( 'plugin_basename' ) ? plugin_basename( STACKABLE_FILE ) : 'stackable-ultimate-gutenberg-blocks/plugin.php';

			$plugins = array();
			foreach ( $active_plugins as $plugin_file ) {
				if ( empty( $plugin_data[ $plugin_file ] ) ) {
					continue;
				}

				$settings = array();
				$required = $plugin_file === $stackable_plugin;
				if ( isset( $adapters[ $plugin_file ] ) && $adapters[ $plugin_file ] instanceof Stackable_Site_Kit_Plugin_Adapter ) {
					$settings = $adapters[ $plugin_file ]->export_settings();
					$required = $adapters[ $plugin_file ]->is_required();
				} elseif ( $plugin_file !== $stackable_plugin ) {
					$this->warnings[] = array(
						'code' => 'unsupported_plugin_settings',
						'path' => '/plugins/' . $plugin_file,
						'message' => 'Plugin settings were omitted because no Site Kit adapter is registered.',
					);
				}

				$settings = Stackable_Site_Kit_Portable_Data::sanitize( $settings, $this->warnings, '/plugins/' . $plugin_file . '/settings' );
				$plugins[] = array(
					'slug' => $plugin_file === $stackable_plugin ? 'stackable-ultimate-gutenberg-blocks/plugin.php' : strtolower( $plugin_file ),
					'name' => (string) $plugin_data[ $plugin_file ]['Name'],
					'required' => (bool) $required,
					'version' => (string) $plugin_data[ $plugin_file ]['Version'],
					'settings' => Stackable_Site_Kit_Portable_Data::as_object( $settings ),
				);
			}

			return $plugins;
		}

		public function get_warnings() {
			return $this->warnings;
		}

		public function reset() {
			$this->warnings = array();
		}
	}
}
