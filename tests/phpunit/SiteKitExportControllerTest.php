<?php
/**
 * Site Kit development export controller coverage.
 *
 * @package Stackable
 */

use Brain\Monkey\Functions;

class Stackable_Site_Kit_Test_Request {
	private $params;

	public function __construct( $params ) {
		$this->params = $params;
	}

	public function get_param( $key ) {
		return isset( $this->params[ $key ] ) ? $this->params[ $key ] : null;
	}
}

class Stackable_Site_Kit_Test_Export_Service {
	private $package;

	public function __construct( $package ) {
		$this->package = $package;
	}

	public function build_package( $metadata ) {
		return $this->package;
	}

	public function validate_package( $package ) {
		return array(
			'errors' => array(),
			'warnings' => array(),
		);
	}
}

class SiteKitExportControllerTest extends Stackable_TestCase {

	protected function set_up() {
		parent::set_up();
		$this->require_plugin_file( 'src/site-kits/export/class-export-package.php' );
		$this->require_plugin_file( 'src/site-kits/export/class-export-controller.php' );
	}

	public function test_route_requires_manage_options() {
		$controller = new Stackable_Site_Kit_Export_Controller();
		$controller->register_routes();
		$route = $this->route_containing( '/site-kits/export' );

		Functions\when( 'current_user_can' )->justReturn( true );
		$this->assertTrue( call_user_func( $route['permission_callback'] ) );
		Functions\when( 'current_user_can' )->justReturn( false );
		$this->assertFalse( call_user_func( $route['permission_callback'] ) );
	}

	public function test_prepare_export_returns_validation_result_before_download() {
		$package = new Stackable_Site_Kit_Export_Package( array(), array(), array() );
		$service = new Stackable_Site_Kit_Test_Export_Service( $package );
		$controller = new Stackable_Site_Kit_Export_Controller( function() use ( $service ) {
			return $service;
		} );

		Functions\when( 'wp_generate_uuid4' )->justReturn( '12345678-1234-1234-1234-123456789abc' );
		Functions\when( 'get_current_user_id' )->justReturn( 7 );
		Functions\when( 'set_transient' )->justReturn( true );
		Functions\when( 'wp_create_nonce' )->justReturn( 'download-nonce' );
		Functions\when( 'admin_url' )->justReturn( 'https://example.test/wp-admin/admin-post.php' );
		Functions\when( 'add_query_arg' )->alias( function( $args, $url ) {
			return $url . '?' . http_build_query( $args );
		} );
		Functions\when( 'rest_ensure_response' )->returnArg( 1 );

		$response = $controller->prepare_export(
			new Stackable_Site_Kit_Test_Request(
				array(
					'slug' => 'consultant',
					'title' => 'Consultant',
					'description' => 'A consultant site.',
					'plan' => 'free',
				)
			)
		);

		$this->assertSame( 'consultant.zip', $response['filename'] );
		$this->assertSame( array(), $response['warnings'] );
		$this->assertStringContainsString( 'admin-post.php?', $response['downloadUrl'] );
		$this->assertStringContainsString( 'download-nonce', $response['downloadUrl'] );
	}

	private function route_containing( $needle ) {
		foreach ( $GLOBALS['stackable_phpunit_rest_routes'] as $route ) {
			if ( isset( $route['_route'] ) && false !== strpos( $route['_route'], $needle ) ) {
				return $route;
			}
		}
		$this->fail( 'Route not registered: ' . $needle );
	}
}
