<?php
/**
 * Site Kit PHP export validator coverage.
 *
 * @package Stackable
 */

class SiteKitExportValidatorTest extends Stackable_TestCase {

	private $fixture_directory;
	private $fixture;

	protected function set_up() {
		parent::set_up();
		$this->require_plugin_file( 'src/site-kits/export/class-export-package.php' );
		$this->require_plugin_file( 'src/site-kits/class-package-validator.php' );
		$this->fixture_directory = STACKABLE_PLUGIN_DIR . 'e2e/config/fixtures/site-kits/valid/consultant';
		$this->fixture = json_decode( file_get_contents( $this->fixture_directory . '/meta.json' ) );
	}

	public function test_accepts_the_canonical_package() {
		$result = $this->validate( $this->fixture );

		$this->assertSame( array(), $result['errors'] );
	}

	public function test_matches_shared_invalid_fixture_codes() {
		$cases = json_decode( file_get_contents( STACKABLE_PLUGIN_DIR . 'e2e/config/fixtures/site-kits/invalid-cases.json' ) );

		foreach ( $cases as $name => $case ) {
			if ( 'slug-mismatch' === $name ) {
				continue;
			}
			$package_data = unserialize( serialize( $this->fixture ) );
			foreach ( $case->mutations as $mutation ) {
				$this->set_at_path( $package_data, $mutation->path, $mutation->value );
			}

			$files = array(
				'assets/hero-office.png' => $this->fixture_directory . '/assets/hero-office.png',
			);
			foreach ( isset( $case->removeFiles ) ? $case->removeFiles : array() as $removed_file ) {
				unset( $files[ $removed_file ] );
			}

			$result = $this->validate( $package_data, $files );
			$codes = array_column( $result['errors'], 'code' );
			foreach ( $case->expectedCodes as $expected_code ) {
				$this->assertContains( $expected_code, $codes, $name );
			}
		}
	}

	private function validate( $data, $files = null ) {
		if ( null === $files ) {
			$files = array(
				'assets/hero-office.png' => $this->fixture_directory . '/assets/hero-office.png',
			);
		}
		$package = new Stackable_Site_Kit_Export_Package( $data, $files );
		$validator = new Stackable_Site_Kit_Package_Validator();

		return $validator->validate( $package );
	}

	private function set_at_path( &$target, $path, $value ) {
		$segments = explode( '.', $path );
		$property = array_pop( $segments );
		$current =& $target;
		foreach ( $segments as $segment ) {
			if ( is_object( $current ) ) {
				$current =& $current->{$segment};
			} else {
				$current =& $current[ (int) $segment ];
			}
		}
		if ( is_object( $current ) ) {
			$current->{$property} = $value;
		} else {
			$current[ (int) $property ] = $value;
		}
	}
}
