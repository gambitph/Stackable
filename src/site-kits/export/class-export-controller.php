<?php
/**
 * Development-only Site Kit export HTTP controller.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Export_Controller' ) ) {
	class Stackable_Site_Kit_Export_Controller {

		const DOWNLOAD_ACTION = 'stackable_site_kit_export_download';
		const TOKEN_TTL = 300;

		private $exporter_factory;

		public function __construct( $exporter_factory = null ) {
			$this->exporter_factory = $exporter_factory ? $exporter_factory : 'stackable_create_site_kit_exporter';
			add_action( 'rest_api_init', array( $this, 'register_routes' ) );
			add_action( 'admin_post_' . self::DOWNLOAD_ACTION, array( $this, 'download' ) );
			add_filter( 'stackable_localize_settings_script', array( $this, 'add_settings_config' ) );
		}

		public function register_routes() {
			register_rest_route(
				'stackable/v3',
				'/site-kits/export',
				array(
					'methods' => 'POST',
					'callback' => array( $this, 'prepare_export' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args' => array(
						'slug' => array(
							'type' => 'string',
							'required' => true,
							'sanitize_callback' => 'sanitize_text_field',
						),
						'title' => array(
							'type' => 'string',
							'required' => true,
							'sanitize_callback' => 'sanitize_text_field',
						),
						'description' => array(
							'type' => 'string',
							'default' => '',
							'sanitize_callback' => 'sanitize_textarea_field',
						),
						'plan' => array(
							'type' => 'string',
							'required' => true,
							'enum' => array( 'free', 'premium' ),
							'sanitize_callback' => 'sanitize_key',
						),
					),
				)
			);
		}

		public function permissions_check() {
			return current_user_can( 'manage_options' );
		}

		public function add_settings_config( $settings ) {
			$settings['siteKitExport'] = array(
				'enabled' => true,
				'path' => '/stackable/v3/site-kits/export',
			);
			return $settings;
		}

		public function prepare_export( $request ) {
			$metadata = array(
				'slug' => $request->get_param( 'slug' ),
				'title' => $request->get_param( 'title' ),
				'description' => $request->get_param( 'description' ),
				'plan' => $request->get_param( 'plan' ),
			);
			$exporter = call_user_func( $this->exporter_factory );
			$package = $exporter->build_package( $metadata );
			if ( is_wp_error( $package ) ) {
				$package->add_data( array( 'status' => 400 ) );
				return $package;
			}

			$validation = $exporter->validate_package( $package );
			$warnings = array_merge( $package->get_warnings(), $validation['warnings'] );
			if ( $validation['errors'] ) {
				return new WP_Error(
					'site_kit_validation_failed',
					__( 'The Site Kit package did not pass validation.', STACKABLE_I18N ),
					array(
						'status' => 422,
						'validationErrors' => $validation['errors'],
						'warnings' => $warnings,
					)
				);
			}

			$token = wp_generate_uuid4();
			$transient = $this->transient_name( $token );
			if ( ! set_transient(
				$transient,
				array(
					'userId' => get_current_user_id(),
					'metadata' => $metadata,
				),
				self::TOKEN_TTL
			) ) {
				return new WP_Error( 'site_kit_export_token_failed', __( 'The Site Kit download could not be prepared.', STACKABLE_I18N ), array( 'status' => 500 ) );
			}

			$download_url = add_query_arg(
				array(
					'action' => self::DOWNLOAD_ACTION,
					'token' => $token,
					'_wpnonce' => wp_create_nonce( self::DOWNLOAD_ACTION . ':' . $token ),
				),
				admin_url( 'admin-post.php' )
			);

			return rest_ensure_response(
				array(
					'filename' => $metadata['slug'] . '.zip',
					'downloadUrl' => $download_url,
					'warnings' => $warnings,
				)
			);
		}

		public function download() {
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_die( esc_html__( 'You are not allowed to export Site Kits.', STACKABLE_I18N ), '', array( 'response' => 403 ) );
			}

			$token = isset( $_GET['token'] ) ? sanitize_text_field( wp_unslash( $_GET['token'] ) ) : '';
			$nonce = isset( $_GET['_wpnonce'] ) ? sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ) : '';
			if ( ! $token || ! wp_verify_nonce( $nonce, self::DOWNLOAD_ACTION . ':' . $token ) ) {
				wp_die( esc_html__( 'The Site Kit download link is invalid or expired.', STACKABLE_I18N ), '', array( 'response' => 403 ) );
			}

			$transient = $this->transient_name( $token );
			$export_request = get_transient( $transient );
			delete_transient( $transient );
			if ( ! is_array( $export_request ) || get_current_user_id() !== (int) $export_request['userId'] || empty( $export_request['metadata'] ) ) {
				wp_die( esc_html__( 'The Site Kit download link is invalid or expired.', STACKABLE_I18N ), '', array( 'response' => 403 ) );
			}

			$temp_path = wp_tempnam( $export_request['metadata']['slug'] . '.zip' );
			if ( ! $temp_path ) {
				wp_die( esc_html__( 'The Site Kit archive could not be created.', STACKABLE_I18N ), '', array( 'response' => 500 ) );
			}

			$exporter = call_user_func( $this->exporter_factory );
			$result = $exporter->export( $export_request['metadata'], $temp_path );
			if ( is_wp_error( $result ) ) {
				wp_delete_file( $temp_path );
				wp_die( esc_html( $result->get_error_message() ), '', array( 'response' => 422 ) );
			}

			$filename = sanitize_file_name( $export_request['metadata']['slug'] . '.zip' );
			nocache_headers();
			header( 'Content-Type: application/zip' );
			header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
			header( 'Content-Length: ' . filesize( $temp_path ) );
			$served = readfile( $temp_path );
			wp_delete_file( $temp_path );
			if ( false === $served ) {
				wp_die( esc_html__( 'The Site Kit archive could not be downloaded.', STACKABLE_I18N ), '', array( 'response' => 500 ) );
			}
			exit;
		}

		private function transient_name( $token ) {
			return 'stackable_site_kit_export_' . str_replace( '-', '', $token );
		}
	}
}
