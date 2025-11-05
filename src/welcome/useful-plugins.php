<?php
/**
 * Stackable Useful Plugins
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Useful_Plugins' ) ) {
	class Stackable_Useful_Plugins {

		private static $PLUGINS = array(
			'interactions' => array(
				'slug' => 'interactions',
				'full_slug' => 'interactions/interactions.php',
			),
			'cimo-image-optimizer' => array(
				'slug' => 'cimo-image-optimizer',
				'full_slug' => 'cimo-image-optimizer/cimo.php',
			),
		);

		function __construct() {
			add_action( 'admin_init', array( $this, 'register_settings' ) );

			// Register action on 'admin_menu' to ensure filters for the editor and admin settings
			// are added early, before those scripts are enqueued and filters are applied.
			add_action( 'admin_menu', array( $this, 'get_useful_plugins_info' ) );

			// use WordPress ajax installer
			// see Docs: https://developer.wordpress.org/reference/functions/wp_ajax_install_plugin/
			add_action('wp_ajax_stackable_useful_plugins_activate', array( $this, 'do_plugin_activate' ) );
			add_action('wp_ajax_stackable_useful_plugins_install', 'wp_ajax_install_plugin' );

			// handler for polling the Cimo plugin's installation or activation status from the block editor
			add_action('wp_ajax_stackable_check_cimo_status', array( $this, 'check_cimo_status' ) );

			if ( is_admin() ) {
				add_filter( 'stackable_localize_script', array( $this, 'localize_hide_cimo_notice' ) );
			}
		}

		public function register_settings() {
			register_setting(
				'stackable_editor_settings',
				'stackable_hide_cimo_notice',
				array(
					'type' => 'boolean',
					'description' => __( 'Hides the Cimo download notice.', STACKABLE_I18N ),
					'sanitize_callback' => 'rest_sanitize_boolean',
					'show_in_rest' => true,
					'default' => false,
				)
			);
		}

		public static function is_plugin_installed( $plugin_slug ) {
			if ( ! function_exists( 'get_plugins' ) ) {
				include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
			}

			$all_plugins = get_plugins();
			if ( isset( $all_plugins[ $plugin_slug ] ) ) {
				return true;
			}

			return false;
		}

		public static function is_plugin_activated( $plugin_slug ) {
			if ( ! function_exists( 'is_plugin_active' ) ) {
				include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
			}

			if ( is_plugin_active( $plugin_slug ) ) {
				return true;
			}

			return false;
		}


		public function get_useful_plugins_info() {
			$current_user_cap = current_user_can( 'install_plugins' ) ? 2 : (
				current_user_can( 'activate_plugins') ? 1 : 0
			);

			if ( ! $current_user_cap ) {
				return;
			}

			if ( ! function_exists( 'plugins_api' ) ) {
				include_once( ABSPATH . 'wp-admin/includes/plugin-install.php' );
			}
			if ( ! function_exists( 'get_plugins' ) ) {
				include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
			}

			if ( ! function_exists( 'is_plugin_active' ) ) {
				include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
			}

			$all_plugins = get_plugins();
			$data_to_localize = array();

			foreach ( self::$PLUGINS as $key => $plugin ) {
				$status = 'not_installed';

				if ( isset( $all_plugins[ $plugin['full_slug'] ] ) ) {
					$status = 'installed';
				}

				if ( is_plugin_active( $plugin['full_slug'] ) ) {
					$status = 'activated';
				}

				$plugin_info = plugins_api( 'plugin_information', [
					'slug' => $plugin['slug'],
					'fields' =>[ 'icons' => true, 'sections' => false ],
					] );

				$icon_url = '';
				if ( ! is_wp_error( $plugin_info ) && isset( $plugin_info->icons )
				&& is_array( $plugin_info->icons ) && ! empty( $plugin_info->icons ) ) {
					$icon_url = array_values( $plugin_info->icons )[0];
				}

				$data_to_localize[ $key ] = array(
					'status' => $status,
					'icon'   => $icon_url,
					'fullSlug' => $plugin[ 'full_slug' ],
				);
			}

			// Make Cimo available in the block editor
			$this->add_cimo_args_to_localize_editor( $data_to_localize, $current_user_cap );
			// Make all plugin data and the ajax url available in the admin settings
			$this->add_args_to_localize_admin( $data_to_localize );
		}

		public function add_cimo_args_to_localize_editor( $data_to_localize, $current_user_cap ) {
			$slug = 'cimo-image-optimizer';
			$full_slug = self::$PLUGINS[ $slug ][ 'full_slug' ];

			$cimo_data = $data_to_localize[ $slug ];
			$cimo_data['nonce'] = wp_create_nonce( 'stackable_cimo_status' );
			$action_link = '';

			if ( $current_user_cap === 2 && $cimo_data[ 'status' ] === 'not_installed' ) {
				$action_link = wp_nonce_url(
					add_query_arg(
						[
							'action' => 'install-plugin',
							'plugin' => $slug,
						],
						admin_url( 'update.php' )
					),
					'install-plugin_' . $slug
				);
			} else if ( $current_user_cap >= 1 && $cimo_data[ 'status' ] === 'installed' ) {
				$action_link = wp_nonce_url(
					add_query_arg( [
						'action' => 'activate',
						'plugin' => $full_slug,
					], admin_url( 'plugins.php' ) ),
					'activate-plugin_' . $full_slug
				);
			}

			$cimo_data[ 'action' ] = $action_link;

			add_filter( 'stackable_localize_script', function ( $args ) use( $cimo_data ) {
				return $this->add_localize_script( $args, 'cimo', $cimo_data );
			}, 1 );

		}

		public function add_args_to_localize_admin( $data_to_localize ) {
			$argsToAdd = array(
				'usefulPlugins' => $data_to_localize,
				'installerNonce' => wp_create_nonce( "updates" ),
				'activateNonce' => wp_create_nonce( "stk_activate_useful_plugin" ),
				'ajaxUrl' => admin_url('admin-ajax.php')
			);

			add_filter( 'stackable_localize_settings_script', function ( $args ) use( $argsToAdd ) {
				return $this->add_localize_script( $args, '', $argsToAdd );
			} );
		}

		public function add_localize_script( $args, $arg_key, $data ) {
			// If an argument key is provided, save data under that key and return
			if ( $arg_key ) {
				$args[ $arg_key ] = $data;
				return $args;
			}

			// Otherwise, add each key/value from $data to merge with $args
			foreach ( $data as $key => $value ) {
				$args[$key] = $value;
			}

			return $args;
		}

		// Adds the hide notice option for the Cimo plugin to the localized script arguments.
		public function localize_hide_cimo_notice( $args ) {
			$hide_cimo = get_option( 'stackable_hide_cimo_notice', false );
			if ( isset( $args['cimo'] ) ) {
				$args['cimo']['hideNotice'] = $hide_cimo;
				return $args;
			}

			$args[ 'cimo' ] = array( 'hideNotice' => $hide_cimo );
			return $args;
		}

		function do_plugin_activate() {
			$slug = isset( $_POST['slug'] ) ? sanitize_text_field( $_POST['slug'] ) : '';
			$full_slug = isset( $_POST['full_slug'] ) ? sanitize_text_field( $_POST['full_slug'] ) : '';
			if ( ! $slug || ! $full_slug ) {
				wp_send_json_error( array( 'status' => 'error', 'message' => 'Invalid slug.' ), 400 );
			}

			if ( ! check_ajax_referer( 'stk_activate_useful_plugin', 'nonce', false ) ) {
				wp_send_json_error( array( 'status' => 'error', 'message' => 'Security check failed.' ), 403 );
				return;
			}

			if ( ! current_user_can( 'activate_plugins' ) ) {
				wp_send_json_error( array( 'status' => 'error', 'message' => 'Insufficient permissions.' ), 403 );
				return;
			}

			// Clear the plugins cache to ensure newly installed plugins are recognized (avoids activation errors due to outdated plugin cache)
			wp_clean_plugins_cache();

			if ( ! function_exists( 'activate_plugin' ) ) {
				include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
			}

			$result = activate_plugin( $full_slug, '', false, true );

			if ( is_wp_error( $result ) ) {
				wp_send_json_error( array( 'status' => 'error', 'message' => 'Failed to activate plugin.' ), 500 );
				return;
			}

			wp_send_json_success( array( 'status' => 'success', 'message' => 'Successfully activated plugin.' ), 200 );
		}


		/**
		 * Checks the status of the Cimo plugin installation or activation.
		 * Returns JSON indicating if Cimo is installed, installing, activated, or activating,
		 * and provides the respective action URL if activation is needed.
		 *
		 * Used for polling Cimo plugin status changes via AJAX in the admin UI.
		 */
		function check_cimo_status() {
			$slug = 'cimo-image-optimizer';
			// Verify nonce
			if ( ! check_ajax_referer( 'stackable_cimo_status', 'nonce', false ) ) {
				wp_send_json_error( array( 'status' => 'error', 'message' => 'Security check failed.' ), 403 );
				return;
			}

			$action = isset( $_POST['user_action'] ) ? sanitize_text_field( $_POST['user_action'] ) : '';
			$response = array(
				'status' => 'activated',
				'action' => ''
			);

			if ( ! $action || ( $action !== 'install' && $action !== 'activate' ) ) {
				wp_send_json_error( array( 'status' => 'error', 'message' => 'Invalid request action.' ), 400 );
				return;
			}

			if ( ( $action === 'install' && ! current_user_can( 'install_plugins' ) ) ||
				( $action === 'activate' && ! current_user_can( 'activate_plugins' ) ) ) {
				wp_send_json_error( array( 'status' => 'error', 'message' => 'Insufficient permissions.' ), 403 );
				return;
			}

			$full_slug = self::$PLUGINS[ $slug ][ 'full_slug' ];

			if ( $action === 'install' && ! self::is_plugin_installed( $full_slug ) ) {
				$response[ 'status' ] = 'installing';
			} else if ( ! self::is_plugin_activated( $full_slug ) ) {
				$response[ 'status' ] = $action === 'install' ? 'installed' : 'activating';
				$response[ 'action' ] = $action === 'install' ? html_entity_decode( wp_nonce_url(
					add_query_arg(
						[
							'action' => 'activate',
							'plugin' => $full_slug,
						],
						admin_url( 'plugins.php' )
					),
					'activate-plugin_' . $full_slug
				) ) : '';
			}

			wp_send_json_success( $response );
		}
	}

	new Stackable_Useful_Plugins();
}
