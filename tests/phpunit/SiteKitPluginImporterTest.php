<?php
/**
 * Site Kit plugin import coverage.
 *
 * @package Stackable
 */

use Brain\Monkey\Functions;

class SiteKitPluginImporterTest extends Stackable_TestCase {

	protected function set_up() {
		parent::set_up();
		$this->require_plugin_file( 'src/site-kits/export/class-plugin-adapter.php' );
		$this->require_plugin_file( 'src/site-kits/import/class-plugin-importer.php' );
		Functions\when( 'current_user_can' )->justReturn( true );
	}

	public function test_adapter_registered_after_preflight_cannot_import_unsnapshotted_settings() {
		Functions\when( 'get_plugins' )->justReturn( array() );
		Functions\when( 'is_plugin_active' )->justReturn( false );
		$rollback = new class() {};
		$plan = $this->plan();
		$package = $this->package();
		$importer = new Stackable_Site_Kit_Plugin_Importer( $rollback );

		$this->assertTrue( $importer->preflight( $package, $plan ) );
		add_filter( 'stackable_site_kit_export_plugin_adapters', function() {
			return array( 'example/example.php' => $this->adapter() );
		} );
		$warnings = $importer->import_settings( $package, $plan );

		$this->assertSame( 'unsupported_plugin_settings', $warnings[0]['code'] );
	}

	public function test_activation_error_is_still_rollbackable_when_the_plugin_became_active() {
		Functions\when( 'get_plugins' )->justReturn( array( 'example/example.php' => array( 'Name' => 'Example' ) ) );
		$active_checks = 0;
		Functions\when( 'is_plugin_active' )->alias( function() use ( &$active_checks ) {
			++$active_checks;
			return $active_checks >= 3;
		} );
		Functions\when( 'activate_plugin' )->justReturn( new WP_Error( 'unexpected_output', 'Unexpected output.' ) );
		$recorded = array();
		$rollback = new class( $recorded ) {
			public $recorded;

			public function __construct( &$recorded ) {
				$this->recorded = &$recorded;
			}

			public function record_activated_plugin( $plugin ) {
				$this->recorded[] = $plugin;
			}
		};
		$importer = new Stackable_Site_Kit_Plugin_Importer( $rollback );
		$this->assertTrue( $importer->preflight( $this->package(), $this->plan() ) );

		$result = $importer->import( $this->package(), $this->plan() );

		$this->assertTrue( is_wp_error( $result ) );
		$this->assertSame( array( 'example/example.php' ), $recorded );
	}

	private function package() {
		return array(
			'plugins' => array(
				array(
					'slug' => 'example/example.php',
					'name' => 'Example',
					'settings' => array( 'enabled' => true ),
				),
			),
		);
	}

	private function plan() {
		return new class() {
			public function includes_plugin() {
				return true;
			}

			public function includes_plugin_settings() {
				return true;
			}
		};
	}

	private function adapter() {
		return new class() implements Stackable_Site_Kit_Plugin_Import_Adapter {
			public function export_settings() {
				return array();
			}

			public function is_required() {
				return false;
			}

			public function validate_import_settings( $settings ) {
				return true;
			}

			public function snapshot_import_settings() {
				return array();
			}

			public function import_settings( $settings ) {
				return true;
			}

			public function restore_import_settings( $snapshot ) {
				return true;
			}
		};
	}
}
