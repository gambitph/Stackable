<?php
/**
 * Design Library URL validation.
 *
 * @package Stackable
 */

use Brain\Monkey\Functions;

class DesignLibraryValidateTest extends Stackable_TestCase {

	protected function set_up() {
		parent::set_up();
		Functions\when( 'wp_http_validate_url' )->alias( function( $url ) {
			if ( 0 === stripos( $url, 'javascript:' ) ) {
				return false;
			}
			if ( ! preg_match( '#^https?://#i', $url ) ) {
				return false;
			}
			return $url;
		} );
		$this->require_plugin_file( 'src/design-library/init.php' );
	}

	public function test_https_image_url_is_valid() {
		$this->assertTrue(
			Stackable_Design_Library::validate_url( 'https://example.com/a.png', null, 'image_url' )
		);
	}

	public function test_javascript_url_is_rejected() {
		$result = Stackable_Design_Library::validate_url( 'javascript:alert(1)', null, 'image_url' );
		$this->assertInstanceOf( WP_Error::class, $result );
	}

	public function test_non_url_is_rejected() {
		$result = Stackable_Design_Library::validate_url( 'not-a-url', null, 'image_url' );
		$this->assertInstanceOf( WP_Error::class, $result );
	}
}
