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
				'premium_slug' => 'cimo-image-optimizer-premium',
				'premium_full_slug' => 'cimo-image-optimizer-premium/cimo.php',
			),
		);

		function __construct() {
			// use WordPress ajax installer
			// see Docs: https://developer.wordpress.org/reference/functions/wp_ajax_install_plugin/
			add_action('wp_ajax_stackable_useful_plugins_activate', array( $this, 'do_plugin_activate' ) );
			add_action('wp_ajax_stackable_useful_plugins_install', 'wp_ajax_install_plugin' );

			// handler for polling the Cimo plugin's installation or activation status from the block editor
			add_action('wp_ajax_stackable_check_cimo_status', array( $this, 'check_cimo_status' ) );

			if ( is_admin() ) {
				add_filter( 'stackable_localize_settings_script', function ( $args ) {
					return $this->get_useful_plugins_info( $args, array( $this, 'add_args_to_localize_admin' ) );
				} );
				add_filter( 'stackable_localize_script', function ( $args ) {
					return $this->get_useful_plugins_info( $args, array( $this, 'add_cimo_args_to_localize_editor' ),
					[ 'cimo-image-optimizer' => self::$PLUGINS[ 'cimo-image-optimizer' ] ] );
				}, 1 );
				add_filter( 'stackable_localize_script', array( $this, 'localize_hide_cimo_notice' ) );
			}
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


		public function get_useful_plugins_info( $args, $callback, $plugin_config = null ) {
			if ( $plugin_config === null ) {
				$plugin_config = self::$PLUGINS;
			}

			$current_user_cap = current_user_can( 'install_plugins' ) ? 2 : (
				current_user_can( 'activate_plugins') ? 1 : 0
			);

			if ( ! $current_user_cap ) {
				return $args;
			}

			if ( ! function_exists( 'get_plugins' ) || ! function_exists( 'is_plugin_active' ) ) {
				include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
			}

			$all_plugins = get_plugins();
			$data_to_localize = array();

			$has_premium = false;
			foreach ( $plugin_config as $key => $plugin ) {
				$status = 'not_installed';
				$full_slug_to_use = $plugin['full_slug'];

				// Check for premium version first if it exists (premium takes precedence)
				$premium_installed = false;
				$premium_activated = false;
				if ( isset( $plugin['premium_full_slug'] ) ) {
					$premium_installed = isset( $all_plugins[ $plugin['premium_full_slug'] ] );
					$premium_activated = is_plugin_active( $plugin['premium_full_slug'] );

					if ( $premium_installed ) {
						$has_premium = true;
						$full_slug_to_use = $plugin['premium_full_slug'];
					}

					$status = $premium_activated ? 'activated' : ( $premium_installed ? 'installed' : 'not_installed' );
				}

				// If premium is not installed/activated, check free version
				if ( $status === 'not_installed' ) {
					if ( isset( $all_plugins[ $plugin['full_slug'] ] ) ) {
						$status = 'installed';
						$full_slug_to_use = $plugin['full_slug'];
					}

					if ( is_plugin_active( $plugin['full_slug'] ) ) {
						$status = 'activated';
						$full_slug_to_use = $plugin['full_slug'];
					}
				}

				$data_to_localize[ $key ] = array(
					'status' => $status,
					'fullSlug' => $full_slug_to_use,
				);
			}

			$args = call_user_func( $callback, $args, $data_to_localize, $current_user_cap, $has_premium );

			return $args;
		}

		public function add_cimo_args_to_localize_editor( $args, $data_to_localize, $current_user_cap, $has_premium ) {
			$slug = 'cimo-image-optimizer';
			if ( ! isset( $data_to_localize[ $slug ] ) ) {
				return $args;
			}
			$full_slug = $data_to_localize[ $slug ][ 'fullSlug' ];


			$cimo_data = $data_to_localize[ $slug ];
			$cimo_data['nonce'] = wp_create_nonce( 'stackable_cimo_status' );
			$action_link = '';

			if ( $current_user_cap === 2 && $cimo_data[ 'status' ] === 'not_installed' && ! $has_premium ) {
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

			$cimo_data[ 'action' ] = html_entity_decode( $action_link );

			return $this->add_localize_script( $args, 'cimo', $cimo_data );
		}

		public function add_args_to_localize_admin( $args, $data_to_localize ) {
			$argsToAdd = array(
				'usefulPlugins' => $data_to_localize,
				'installerNonce' => wp_create_nonce( "updates" ),
				'activateNonce' => wp_create_nonce( "stk_activate_useful_plugin" ),
				'ajaxUrl' => admin_url('admin-ajax.php')
			);

			return $this->add_localize_script( $args, '', $argsToAdd );
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
				wp_send_json_error( array( 'status' => 'error', 'message' => __( 'Invalid slug.', STACKABLE_I18N ) ), 400 );
			}

			if ( ! check_ajax_referer( 'stk_activate_useful_plugin', 'nonce', false ) ) {
				wp_send_json_error( array( 'status' => 'error', 'message' => __( 'Security check failed.', STACKABLE_I18N ) ), 403 );
				return;
			}

			if ( ! current_user_can( 'activate_plugins' ) ) {
				wp_send_json_error( array( 'status' => 'error', 'message' => __( 'Insufficient permissions.', STACKABLE_I18N ) ), 403 );
				return;
			}

			// Clear the plugins cache to ensure newly installed plugins are recognized (avoids activation errors due to outdated plugin cache)
			wp_clean_plugins_cache();

			if ( ! function_exists( 'activate_plugin' ) ) {
				include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
			}

			$result = activate_plugin( $full_slug, '', false, true );

			if ( is_wp_error( $result ) ) {
				wp_send_json_error( array( 'status' => 'error', 'message' => __( 'Failed to activate plugin.', STACKABLE_I18N ) ), 500 );
				return;
			}

			wp_send_json_success( array( 'status' => 'success', 'message' => __( 'Successfully activated plugin.', STACKABLE_I18N ) ), 200 );
		}


		/**
		 * Checks the status of the Cimo plugin installation or activation.
		 * Returns JSON indicating if Cimo is installed, installing, activated, or activating,
		 * and provides the respective action URL if activation is needed.
		 *
		 * Used for polling Cimo plugin status changes via AJAX in the admin UI.
		 */
		function check_cimo_status() {
			// Verify nonce
			if ( ! check_ajax_referer( 'stackable_cimo_status', 'nonce', false ) ) {
				wp_send_json_error( array( 'status' => 'error', 'message' => __( 'Security check failed.', STACKABLE_I18N ) ), 403 );
				return;
			}

			$action = isset( $_POST['user_action'] ) ? sanitize_text_field( $_POST['user_action'] ) : '';
			$response = array(
				'status' => 'activated',
				'action' => ''
			);

			if ( ! $action || ( $action !== 'install' && $action !== 'activate' ) ) {
				wp_send_json_error( array( 'status' => 'error', 'message' => __( 'Invalid request action.', STACKABLE_I18N ) ), 400 );
				return;
			}

			if ( ( $action === 'install' && ! current_user_can( 'install_plugins' ) ) ||
				( $action === 'activate' && ! current_user_can( 'activate_plugins' ) ) ) {
				wp_send_json_error( array( 'status' => 'error', 'message' => __( 'Insufficient permissions.', STACKABLE_I18N ) ), 403 );
				return;
			}

			$plugin_config = self::$PLUGINS['cimo-image-optimizer'];
			$premium_full_slug = isset( $plugin_config['premium_full_slug'] ) ? $plugin_config['premium_full_slug'] : null;
			$full_slug = $plugin_config['full_slug'];

			// Clear plugin cache to ensure we get the most current status
			wp_clean_plugins_cache();

			// Check premium version first
			$is_premium_installed = $premium_full_slug && self::is_plugin_installed( $premium_full_slug );
			$is_premium_activated = $premium_full_slug && self::is_plugin_activated( $premium_full_slug );
			$is_regular_installed = self::is_plugin_installed( $full_slug );
			$is_regular_activated = self::is_plugin_activated( $full_slug );

			// Determine which version to use (premium takes precedence)
			$full_slug_to_use = null;
			if ( $is_premium_activated || $is_premium_installed ) {
				$full_slug_to_use = $premium_full_slug;
				$response['status'] = $is_premium_activated ? 'activated' : 'installed';
			} else if ( $is_regular_activated || $is_regular_installed ) {
				$full_slug_to_use = $full_slug;
				$response['status'] = $is_regular_activated ? 'activated' : 'installed';
			} else {
				$response['status'] = 'not_installed';
			}

			// If plugin is installed but not activated, provide activation link
			if ( $response['status'] === 'installed' && $full_slug_to_use ) {
				$response['action'] = $action === 'install' ? html_entity_decode( wp_nonce_url(
					add_query_arg(
						[
							'action' => 'activate',
							'plugin' => $full_slug_to_use,
						],
						admin_url( 'plugins.php' )
					),
					'activate-plugin_' . $full_slug_to_use
				) ) : '';
			}

			wp_send_json_success( $response );
		}
	}

	new Stackable_Useful_Plugins();
}
