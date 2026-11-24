<?php
/**
 * Development-only Site Kit upload controller.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Import_Controller' ) ) {
	class Stackable_Site_Kit_Import_Controller {

		private $reader_factory;
		private $importer_factory;

		public function __construct( $reader_factory = null, $importer_factory = null ) {
			$this->reader_factory = $reader_factory ? $reader_factory : 'stackable_create_site_kit_package_reader';
			$this->importer_factory = $importer_factory ? $importer_factory : 'stackable_create_site_kit_importer';
			add_action( 'rest_api_init', array( $this, 'register_routes' ) );
			add_filter( 'stackable_localize_settings_script', array( $this, 'add_settings_config' ) );
		}

		public function register_routes() {
			register_rest_route(
				'stackable/v3',
				'/site-kits/import',
				array(
					'methods' => 'POST',
					'callback' => array( $this, 'import' ),
					'permission_callback' => array( $this, 'permissions_check' ),
				)
			);
			register_rest_route(
				'stackable/v3',
				'/site-kits/import/prepare',
				array(
					'methods' => 'POST',
					'callback' => array( $this, 'prepare' ),
					'permission_callback' => array( $this, 'permissions_check' ),
				)
			);
		}

		public function permissions_check() {
			return current_user_can( 'manage_options' );
		}

		public function add_settings_config( $settings ) {
			$settings['siteKitImport'] = array(
				'enabled' => true,
				'path' => '/stackable/v3/site-kits/import',
				'preparePath' => '/stackable/v3/site-kits/import/prepare',
				'stackableVersion' => STACKABLE_VERSION,
				'maxUploadBytes' => wp_max_upload_size(),
			);
			return $settings;
		}

		public function import( $request ) {
			$package = $this->read_package( $request );
			if ( is_wp_error( $package ) ) {
				return $package;
			}

			$selection = $request->get_param( 'selection' );
			if ( is_string( $selection ) && '' !== $selection ) {
				$selection = json_decode( $selection, true );
				if ( ! is_array( $selection ) ) {
					$package->cleanup();
					return new WP_Error( 'site_kit_import_invalid_plan', __( 'The Site Kit import selection is invalid.', STACKABLE_I18N ), array( 'status' => 400 ) );
				}
			}

			$generated_block_styles = $request->get_param( 'generatedBlockStyles' );
			if ( is_string( $generated_block_styles ) && '' !== $generated_block_styles ) {
				$generated_block_styles = json_decode( $generated_block_styles, true );
			}
			$generator = null;
			if ( is_array( $generated_block_styles ) ) {
				$generator = function() use ( $generated_block_styles ) {
					return $generated_block_styles;
				};
				add_filter( 'stackable_site_kit_import_block_styles', $generator, 10, 2 );
			}

			try {
				$importer = call_user_func( $this->importer_factory );
				$result = $importer->import( $package, is_array( $selection ) ? $selection : array() );
				if ( is_wp_error( $result ) ) {
					$data = $result->get_error_data();
					if ( ! is_array( $data ) || empty( $data['status'] ) ) {
						$result->add_data( array( 'status' => 422 ) );
					}
					return $result;
				}
				return rest_ensure_response( $result );
			} finally {
				if ( $generator ) {
					remove_filter( 'stackable_site_kit_import_block_styles', $generator, 10 );
				}
				$package->cleanup();
			}
		}

		public function prepare( $request ) {
			$package = $this->read_package( $request );
			if ( is_wp_error( $package ) ) {
				return $package;
			}
			try {
				$data = $package->get_data_array();
				$block_styles = isset( $data['stackable']['settings']['stackable_global_block_styles'] )
					? $data['stackable']['settings']['stackable_global_block_styles']
					: array();
				return rest_ensure_response( array( 'blockStyles' => $block_styles ) );
			} finally {
				$package->cleanup();
			}
		}

		private function read_package( $request ) {
			$files = $request->get_file_params();
			if ( empty( $files['siteKit'] ) || ! is_array( $files['siteKit'] ) ) {
				return new WP_Error( 'site_kit_import_missing_upload', __( 'Choose a Site Kit ZIP to import.', STACKABLE_I18N ), array( 'status' => 400 ) );
			}

			$file = $files['siteKit'];
			if ( UPLOAD_ERR_OK !== (int) $file['error'] || empty( $file['tmp_name'] ) ) {
				return new WP_Error( 'site_kit_import_upload_failed', __( 'The Site Kit ZIP could not be uploaded.', STACKABLE_I18N ), array( 'status' => 400 ) );
			}
			if ( 'zip' !== strtolower( pathinfo( sanitize_file_name( $file['name'] ), PATHINFO_EXTENSION ) ) ) {
				return new WP_Error( 'site_kit_import_invalid_file_type', __( 'Site Kits must be uploaded as ZIP files.', STACKABLE_I18N ), array( 'status' => 400 ) );
			}

			$reader = call_user_func( $this->reader_factory );
			return $reader->read( $file['tmp_name'] );
		}
	}
}
