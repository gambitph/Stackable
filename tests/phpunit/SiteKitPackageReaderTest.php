<?php
/**
 * Secure Site Kit ZIP reader coverage.
 *
 * @package Stackable
 */

use Brain\Monkey\Functions;

class SiteKitPackageReaderTest extends Stackable_TestCase {

	private $archives = array();

	protected function set_up() {
		parent::set_up();
		$this->require_plugin_file( 'src/site-kits/import/class-import-package.php' );
		$this->require_plugin_file( 'src/site-kits/class-package-validator.php' );
		$this->require_plugin_file( 'src/site-kits/import/class-package-reader.php' );

		Functions\when( 'trailingslashit' )->alias( function( $path ) {
			return rtrim( $path, '/\\' ) . '/';
		} );
		Functions\when( 'get_temp_dir' )->justReturn( sys_get_temp_dir() . '/' );
		Functions\when( 'wp_generate_uuid4' )->alias( function() {
			return uniqid( 'site-kit-', true );
		} );
		Functions\when( 'wp_mkdir_p' )->alias( function( $path ) {
			return is_dir( $path ) || mkdir( $path, 0777, true );
		} );
		Functions\when( 'wp_delete_file' )->alias( function( $path ) {
			return is_file( $path ) ? unlink( $path ) : false;
		} );
	}

	protected function tear_down() {
		foreach ( $this->archives as $archive ) {
			if ( is_file( $archive ) ) {
				unlink( $archive );
			}
		}
		parent::tear_down();
	}

	public function test_reads_and_validates_a_canonical_archive() {
		$fixture = STACKABLE_PLUGIN_DIR . 'e2e/config/fixtures/site-kits/valid/consultant';
		$archive = $this->create_archive(
			array(
				'meta.json' => file_get_contents( $fixture . '/meta.json' ),
				'assets/hero-office.png' => file_get_contents( $fixture . '/assets/hero-office.png' ),
			)
		);

		$package = $this->reader()->read( $archive );

		$this->assertFalse( is_wp_error( $package ) );
		$this->assertSame( 'consultant', $package->get_data_array()['slug'] );
		$this->assertArrayHasKey( 'assets/hero-office.png', $package->get_files() );
		$temporary_directory = dirname( $package->get_files()['assets/hero-office.png'], 2 );
		$package->cleanup();
		$this->assertDirectoryDoesNotExist( $temporary_directory );
	}

	public function test_rejects_files_outside_the_package_contract() {
		$archive = $this->create_archive(
			array(
				'meta.json' => '{}',
				'unexpected.txt' => 'not allowed',
			)
		);

		$result = $this->reader()->read( $archive );

		$this->assertTrue( is_wp_error( $result ) );
		$this->assertSame( 'site_kit_import_unsafe_archive', $result->get_error_code() );
	}

	private function reader() {
		return new Stackable_Site_Kit_Package_Reader( new Stackable_Site_Kit_Package_Validator() );
	}

	private function create_archive( $files ) {
		$path = tempnam( sys_get_temp_dir(), 'stk-site-kit-' );
		$this->archives[] = $path;
		$archive = new ZipArchive();
		$this->assertTrue( $archive->open( $path, ZipArchive::OVERWRITE ) );
		foreach ( $files as $name => $contents ) {
			$this->assertTrue( $archive->addFromString( $name, $contents ) );
		}
		$this->assertTrue( $archive->close() );
		return $path;
	}
}
