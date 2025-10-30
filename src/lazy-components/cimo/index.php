<?php
/**
 * Cimo Notice
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Cimo_Notice' ) ) {
	class Stackable_Cimo_Notice {

		private static $CIMO_SLUG = 'cimo-image-optimizer';
		private static $CIMO_FULL_SLUG = 'cimo-image-optimizer/cimo.php';

		function __construct() {
			add_action( 'admin_init', array( $this, 'register_settings' ) );
			add_action( 'rest_api_init', array( $this, 'register_settings' ) );

			// For polling the status
			add_action('wp_ajax_stackable_check_cimo_status', array( $this, 'check_cimo_status' ) );

			if ( is_admin() ) {
				add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_script' ), 1 );
				add_filter( 'stackable_localize_script', array( $this, 'localize_hide_cimo_notice' ), 999 );
			}
		}

		public function register_settings() {
			register_setting(
				'stackable_editor_settings',
				'stackable_hide_cimo_notice',
				array(
					'type' => 'boolean',
					'description' => __( 'Hides the Cimo download notice.', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => false,
				)
			);
		}

		public static function is_plugin_installed() {
			if ( ! function_exists( 'get_plugins' ) ) {
				include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
			}

			$all_plugins = get_plugins();
			if ( isset( $all_plugins[ self::$CIMO_FULL_SLUG ] ) ) {
				return true;
			}

			return false;
		}

		public static function is_plugin_activated() {
			if ( ! function_exists( 'is_plugin_active' ) ) {
				include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
			}

			if ( class_exists( 'Cimo_Script_Loader' ) || is_plugin_active( self::$CIMO_FULL_SLUG ) ) {
				return true;
			}

			return false;

		}

		// Determines the current status of the Cimo plugin (not installed, installed but inactive, or activated)
		// and provides the appropriate action URL for installation or activation.
		public function enqueue_script() {
			$hide_cimo = get_option( 'stackable_hide_cimo_notice', false );

			if ( $hide_cimo ) {
				return;
			}

			$cimo_status = 'activated';
			$cimo_action = '';

			if ( ! self::is_plugin_installed() ) {
				$cimo_status = 'not_installed';
				$cimo_action = wp_nonce_url(
					add_query_arg(
						[
							'action' => 'install-plugin',
							'plugin' => self::$CIMO_SLUG,
						],
						admin_url( 'update.php' )
					),
					'install-plugin_' . self::$CIMO_SLUG
				);
			} else if ( ! self::is_plugin_activated() ) {
				$cimo_status = 'installed';
				$cimo_action = wp_nonce_url(
					add_query_arg(
						[
							'action' => 'activate',
							'plugin' => self::$CIMO_FULL_SLUG,
						],
						admin_url( 'plugins.php' )
					),
					'activate-plugin_' . self::$CIMO_FULL_SLUG
				);
			}

			$data = array(
				'status' => $cimo_status,
				'action' => html_entity_decode( $cimo_action ),
			);

			// Expose the Cimo plugin status and action URL for use in JS
			add_filter( 'stackable_localize_script', function ( $args ) use( $data ) {
				return $this->add_localize_script( $args, $data );
			}, 1 );
		}

		public function add_localize_script( $args, $data ) {
			$args[ 'cimo' ] = $data;
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

		/**
		 * Checks the status of the Cimo plugin installation or activation.
		 * Returns JSON indicating if Cimo is installed, installing, activated, or activating,
		 * and provides the respective action URL if activation is needed.
		 *
		 * Used for polling Cimo plugin status changes via AJAX in the admin UI.
		 */
		function check_cimo_status() {
			$action = sanitize_text_field( $_POST['user_action'] );
			$response = array(
				'status' => 'activated',
				'action' => ''
			);

			if ( $action === 'install' && ! self::is_plugin_installed() ) {
				$response[ 'status' ] = 'installing';
			} else if ( ! self::is_plugin_activated() ) {
				$response[ 'status' ] = $action === 'install' ? 'installed' : 'activating';
				$response[ 'action' ] = $action === 'install' ? html_entity_decode( wp_nonce_url(
					add_query_arg(
						[
							'action' => 'activate',
							'plugin' => self::$CIMO_FULL_SLUG,
						],
						admin_url( 'plugins.php' )
					),
					'activate-plugin_' . self::$CIMO_FULL_SLUG
				) ) : '';
			}

			wp_send_json( $response );
		}
	}

	new Stackable_Cimo_Notice();
}
