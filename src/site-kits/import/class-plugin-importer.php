<?php
/**
 * Site Kit plugin installation, activation, and adapter settings import.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Plugin_Importer' ) ) {
	class Stackable_Site_Kit_Plugin_Importer {

		private $rollback;
		private $available = array();
		private $adapters = array();
		private $snapshots = array();

		public function __construct( $rollback ) {
			$this->rollback = $rollback;
		}

		public function preflight( $package_data, $plan ) {
			$this->load_plugin_api();
			$installed = function_exists( 'get_plugins' ) ? get_plugins() : array();
			$this->adapters = apply_filters( 'stackable_site_kit_export_plugin_adapters', array() );

			foreach ( $package_data['plugins'] as $plugin ) {
				if ( ! $plan->includes_plugin( $plugin['slug'] ) ) {
					continue;
				}
				$plugin_file = $this->local_plugin_file( $plugin['slug'] );
				if ( isset( $installed[ $plugin_file ] ) ) {
					$this->available[ $plugin['slug'] ] = $plugin_file;
				} elseif ( ! current_user_can( 'install_plugins' ) ) {
					return new WP_Error( 'site_kit_import_cannot_install_plugin', sprintf( __( 'The plugin %s is not installed and cannot be installed by this user.', STACKABLE_I18N ), $plugin['name'] ) );
				}

				if ( $plan->includes_plugin_settings( $plugin['slug'] ) && ! empty( $plugin['settings'] ) ) {
					if ( empty( $this->adapters[ $plugin_file ] ) || ! $this->adapters[ $plugin_file ] instanceof Stackable_Site_Kit_Plugin_Import_Adapter ) {
						continue;
					}
					$adapter = $this->adapters[ $plugin_file ];
					$result = $adapter->validate_import_settings( $plugin['settings'] );
					if ( is_wp_error( $result ) ) {
						return $result;
					}
					$snapshot = $adapter->snapshot_import_settings();
					if ( is_wp_error( $snapshot ) ) {
						return $snapshot;
					}
					$this->snapshots[ $plugin_file ] = $snapshot;
				}
			}
			return true;
		}

		public function import( $package_data, $plan ) {
			$this->load_plugin_api();
			foreach ( $package_data['plugins'] as $plugin ) {
				if ( ! $plan->includes_plugin( $plugin['slug'] ) ) {
					continue;
				}
				$plugin_file = isset( $this->available[ $plugin['slug'] ] ) ? $this->available[ $plugin['slug'] ] : $this->install( $plugin );
				if ( is_wp_error( $plugin_file ) ) {
					return $plugin_file;
				}
				if ( ! is_plugin_active( $plugin_file ) ) {
					$result = activate_plugin( $plugin_file, '', false, true );
					if ( is_wp_error( $result ) ) {
						return $result;
					}
					$this->rollback->record_activated_plugin( $plugin_file );
				}
			}
			return true;
		}

		public function import_settings( $package_data, $plan ) {
			$warnings = array();
			$adapters = $this->adapters ? $this->adapters : apply_filters( 'stackable_site_kit_export_plugin_adapters', array() );
			foreach ( $package_data['plugins'] as $plugin ) {
				if ( ! $plan->includes_plugin_settings( $plugin['slug'] ) || empty( $plugin['settings'] ) ) {
					continue;
				}
				$plugin_file = $this->local_plugin_file( $plugin['slug'] );
				if ( ! empty( $adapters[ $plugin_file ] ) && $adapters[ $plugin_file ] instanceof Stackable_Site_Kit_Plugin_Import_Adapter ) {
					$adapter = $adapters[ $plugin_file ];
					$snapshot = isset( $this->snapshots[ $plugin_file ] ) ? $this->snapshots[ $plugin_file ] : null;
					$this->rollback->record_callback(
						function() use ( $adapter, $snapshot ) {
							return $adapter->restore_import_settings( $snapshot );
						},
						sprintf( __( 'Could not restore settings for %s', STACKABLE_I18N ), $plugin['name'] )
					);
					$result = $adapter->import_settings( $plugin['settings'] );
					if ( is_wp_error( $result ) ) {
						return $result;
					}
				} else {
					$warnings[] = array(
						'code' => 'unsupported_plugin_settings',
						'path' => '/plugins/' . $plugin['slug'] . '/settings',
						'message' => sprintf( __( '%s settings were skipped because no import adapter is registered.', STACKABLE_I18N ), $plugin['name'] ),
					);
				}
			}
			return $warnings;
		}

		private function install( $plugin ) {
			if ( ! class_exists( 'Plugin_Upgrader' ) ) {
				return new WP_Error( 'site_kit_import_plugin_api_unavailable', __( 'The WordPress plugin installer is unavailable.', STACKABLE_I18N ) );
			}
			$directory = dirname( $plugin['slug'] );
			$wordpress_slug = '.' === $directory ? pathinfo( $plugin['slug'], PATHINFO_FILENAME ) : $directory;
			$api = plugins_api( 'plugin_information', array( 'slug' => $wordpress_slug, 'fields' => array( 'sections' => false ) ) );
			if ( is_wp_error( $api ) || empty( $api->download_link ) ) {
				return is_wp_error( $api ) ? $api : new WP_Error( 'site_kit_import_plugin_not_found', __( 'A selected plugin could not be found in the WordPress.org directory.', STACKABLE_I18N ) );
			}

			$before = function_exists( 'get_plugins' ) ? array_keys( get_plugins() ) : array();
			$upgrader = new Plugin_Upgrader( new Automatic_Upgrader_Skin() );
			$result = $upgrader->install( $api->download_link );
			if ( is_wp_error( $result ) || ! $result ) {
				return is_wp_error( $result ) ? $result : new WP_Error( 'site_kit_import_plugin_install_failed', __( 'A selected plugin could not be installed.', STACKABLE_I18N ) );
			}

			wp_clean_plugins_cache( true );
			$after = function_exists( 'get_plugins' ) ? array_keys( get_plugins() ) : array();
			$new_plugins = array_values( array_diff( $after, $before ) );
			$plugin_file = in_array( $plugin['slug'], $new_plugins, true ) ? $plugin['slug'] : reset( $new_plugins );
			if ( ! $plugin_file ) {
				return new WP_Error( 'site_kit_import_plugin_install_failed', __( 'The installed plugin entry point could not be found.', STACKABLE_I18N ) );
			}
			$this->rollback->record_installed_plugin( $plugin_file );
			return $plugin_file;
		}

		private function local_plugin_file( $plugin_slug ) {
			if ( 'stackable-ultimate-gutenberg-blocks/plugin.php' === $plugin_slug && function_exists( 'plugin_basename' ) ) {
				return plugin_basename( STACKABLE_FILE );
			}
			return $plugin_slug;
		}

		private function load_plugin_api() {
			foreach ( array( 'plugin.php', 'plugin-install.php', 'class-wp-upgrader.php' ) as $file ) {
				$path = ABSPATH . 'wp-admin/includes/' . $file;
				if ( file_exists( $path ) ) {
					require_once $path;
				}
			}
		}
	}
}
