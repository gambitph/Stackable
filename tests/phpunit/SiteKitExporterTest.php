<?php
/**
 * Site Kit exporter and archive coverage.
 *
 * @package Stackable
 */

use Brain\Monkey\Functions;

class Stackable_Site_Kit_Test_Collector {
	private $value;

	public function __construct( $value ) {
		$this->value = $value;
	}

	public function collect( $context = array() ) {
		return $this->value;
	}
}

class Stackable_Site_Kit_Test_Media_Collector extends Stackable_Site_Kit_Test_Collector {
	private $files;

	public function __construct( $value, $files ) {
		parent::__construct( $value );
		$this->files = $files;
	}

	public function get_files() {
		return $this->files;
	}

	public function get_warnings() {
		return array();
	}

	public function localize_content( $content ) {
		return $content;
	}
}

class SiteKitExporterTest extends Stackable_TestCase {

	protected function set_up() {
		parent::set_up();
		$this->require_plugin_file( 'src/site-kits/export/index.php' );
	}

	public function test_exports_canonical_package_and_media_archive() {
		$fixture_directory = STACKABLE_PLUGIN_DIR . 'e2e/config/fixtures/site-kits/valid/consultant';
		$fixture = json_decode( file_get_contents( $fixture_directory . '/meta.json' ) );
		$fixture->requires->stackable = '>=' . STACKABLE_VERSION;
		$collectors = array();
		foreach ( array( 'theme', 'site', 'pages', 'menu', 'patterns', 'stackable', 'plugins' ) as $key ) {
			$collectors[ $key ] = new Stackable_Site_Kit_Test_Collector( $fixture->{$key} );
		}

		$media = new Stackable_Site_Kit_Test_Media_Collector(
			$fixture->media,
			array(
				'assets/hero-office.png' => $fixture_directory . '/assets/hero-office.png',
			)
		);
		$exporter = new Stackable_Site_Kit_Exporter( $collectors, $media, new Stackable_Site_Kit_Archive_Writer(), new Stackable_Site_Kit_Package_Validator() );
		$temp_directory = sys_get_temp_dir() . '/stk-site-kit-' . uniqid( '', true );
		$package_directory = $temp_directory . '/' . $fixture->slug;
		$archive_path = $temp_directory . '/' . $fixture->slug . '.zip';
		mkdir( $package_directory, 0777, true );

		try {
			$result = $exporter->export(
				array(
					'slug' => $fixture->slug,
					'title' => $fixture->title,
					'description' => $fixture->description,
					'plan' => $fixture->plan,
				),
				$archive_path
			);

			$this->assertFalse( is_wp_error( $result ) );
			$this->assertSame( array(), $result['warnings'] );

			$archive = new ZipArchive();
			$this->assertTrue( $archive->open( $archive_path ) );
			$exported_data = json_decode( $archive->getFromName( 'meta.json' ) );
			$this->assertEquals( $fixture, $exported_data );
			$this->assertInstanceOf( stdClass::class, $exported_data->pages[1]->meta );
			$this->assertSame(
				file_get_contents( $fixture_directory . '/assets/hero-office.png' ),
				$archive->getFromName( 'assets/hero-office.png' )
			);
			$this->assertTrue( $archive->extractTo( $package_directory ) );
			$archive->close();

			$validator = STACKABLE_PLUGIN_DIR . 'tools/site-kits/validate-package.js';
			$command = 'node ' . escapeshellarg( $validator ) . ' ' . escapeshellarg( $package_directory ) . ' 2>&1';
			$output = array();
			$exit_code = 1;
			exec( $command, $output, $exit_code );
			$this->assertSame( 0, $exit_code, implode( "\n", $output ) );
		} finally {
			$this->delete_directory( $temp_directory );
		}
	}

	public function test_rejects_reserved_package_slug() {
		$exporter = new Stackable_Site_Kit_Exporter( array(), new Stackable_Site_Kit_Test_Media_Collector( array(), array() ), new Stackable_Site_Kit_Archive_Writer(), new Stackable_Site_Kit_Package_Validator() );
		$result = $exporter->build_package(
			array(
				'slug' => 'default',
				'title' => 'Default',
				'plan' => 'free',
			)
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'site_kit_invalid_slug', $result->get_error_code() );
	}

	public function test_redacts_sensitive_adapter_data() {
		$warnings = array();
		$data = Stackable_Site_Kit_Portable_Data::sanitize(
			array(
				'display_name' => 'Portable',
				'api_key' => 'must-not-export',
				'nested' => array(
					'access_token' => 'must-not-export',
					'enabled' => true,
				),
			),
			$warnings,
			'/plugins/example/settings'
		);

		$this->assertSame( 'Portable', $data['display_name'] );
		$this->assertArrayNotHasKey( 'api_key', $data );
		$this->assertArrayNotHasKey( 'access_token', $data['nested'] );
		$this->assertTrue( $data['nested']['enabled'] );
		$this->assertCount( 2, $warnings );
		$this->assertSame( 'redacted_setting', $warnings[0]['code'] );
	}

	public function test_preserves_nested_object_shapes_and_omits_resources() {
		$resource = fopen( 'php://memory', 'r' );
		$warnings = array();
		$data = Stackable_Site_Kit_Portable_Data::sanitize(
			(object) array(
				'layout' => (object) array(
					'desktop' => (object) array(),
				),
				'list' => array(),
				'handle' => $resource,
			),
			$warnings,
			'/settings'
		);
		fclose( $resource );

		$this->assertInstanceOf( stdClass::class, $data );
		$this->assertInstanceOf( stdClass::class, $data->layout );
		$this->assertInstanceOf( stdClass::class, $data->layout->desktop );
		$this->assertIsArray( $data->list );
		$this->assertObjectNotHasProperty( 'handle', $data );
		$this->assertSame( 'non_portable_value', $warnings[0]['code'] );
	}

	public function test_navigation_rewrite_does_not_change_non_page_link_with_matching_id() {
		$navigation_post = (object) array(
			'ID' => 90,
			'post_name' => 'primary-navigation',
			'post_title' => 'Primary navigation',
			'post_status' => 'publish',
			'post_content' => 'navigation-content',
		);
		$page = (object) array(
			'ID' => 25,
			'post_name' => 'home',
		);
		$blocks = array(
			array(
				'blockName' => 'core/navigation-link',
				'attrs' => array(
					'id' => 25,
					'type' => 'page',
					'url' => 'https://example.test/home',
				),
				'innerBlocks' => array(),
			),
			array(
				'blockName' => 'core/navigation-link',
				'attrs' => array(
					'id' => 25,
					'type' => 'category',
					'url' => 'https://example.test/category/news',
				),
				'innerBlocks' => array(),
			),
		);

		Functions\when( 'get_nav_menu_locations' )->justReturn( array() );
		Functions\when( 'get_posts' )->alias( function( $args ) use ( $navigation_post, $page ) {
			return 'wp_navigation' === $args['post_type'] ? array( $navigation_post ) : array( $page );
		} );
		Functions\when( 'parse_blocks' )->justReturn( $blocks );
		Functions\when( 'serialize_blocks' )->alias( 'json_encode' );
		Functions\when( 'wp_list_pluck' )->alias( function( $items, $field ) {
			return array_map( function( $item ) use ( $field ) {
				return $item->{$field};
			}, $items );
		} );

		$collector = new Stackable_Site_Kit_Navigation_Collector( new Stackable_Site_Kit_Test_Media_Collector( array(), array() ) );
		$result = $collector->collect(
			array(
				'package' => array(
					'theme' => array(
						'templates' => array(
							array( 'content' => '<!-- wp:navigation {"ref":90} /-->' ),
						),
						'templateParts' => array(),
					),
				),
			)
		);
		$exported_blocks = json_decode( $result['entities'][0]['content'], true );

		$this->assertSame( 'home', $exported_blocks[0]['attrs']['stkSiteKitPage'] );
		$this->assertArrayNotHasKey( 'id', $exported_blocks[0]['attrs'] );
		$this->assertArrayNotHasKey( 'url', $exported_blocks[0]['attrs'] );
		$this->assertSame( 25, $exported_blocks[1]['attrs']['id'] );
		$this->assertSame( 'category', $exported_blocks[1]['attrs']['type'] );
		$this->assertSame( 'https://example.test/category/news', $exported_blocks[1]['attrs']['url'] );
		$this->assertArrayNotHasKey( 'stkSiteKitPage', $exported_blocks[1]['attrs'] );
	}

	private function delete_directory( $directory ) {
		if ( ! is_dir( $directory ) ) {
			return;
		}

		$iterator = new RecursiveIteratorIterator(
			new RecursiveDirectoryIterator( $directory, FilesystemIterator::SKIP_DOTS ),
			RecursiveIteratorIterator::CHILD_FIRST
		);
		foreach ( $iterator as $path ) {
			$path->isDir() ? rmdir( $path->getPathname() ) : unlink( $path->getPathname() );
		}
		rmdir( $directory );
	}
}
