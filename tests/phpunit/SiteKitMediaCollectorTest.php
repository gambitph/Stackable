<?php
/**
 * Site Kit media collector coverage.
 *
 * @package Stackable
 */

use Brain\Monkey\Functions;

class SiteKitMediaCollectorTest extends Stackable_TestCase {

	protected function set_up() {
		parent::set_up();
		$this->require_plugin_file( 'src/site-kits/export/index.php' );
	}

	public function test_localizes_attachment_url_and_builds_manifest() {
		$source = STACKABLE_PLUGIN_DIR . 'e2e/config/fixtures/site-kits/valid/consultant/assets/hero-office.png';
		$attachment = (object) array(
			'post_title' => 'Office team',
			'post_excerpt' => 'Fixture caption',
		);

		Functions\when( 'wp_get_upload_dir' )->justReturn( array( 'baseurl' => 'https://example.test/wp-content/uploads' ) );
		Functions\when( 'attachment_url_to_postid' )->justReturn( 25 );
		Functions\when( 'get_attached_file' )->justReturn( $source );
		Functions\when( 'get_post_mime_type' )->justReturn( 'image/png' );
		Functions\when( 'get_allowed_mime_types' )->justReturn( array( 'png' => 'image/png' ) );
		Functions\when( 'sanitize_file_name' )->alias( function( $filename ) {
			return $filename;
		} );
		Functions\when( 'wp_basename' )->alias( 'basename' );
		Functions\when( 'get_post' )->justReturn( $attachment );
		Functions\when( 'get_post_meta' )->justReturn( 'Office team alt text' );
		Functions\when( 'wp_list_pluck' )->alias( function( $items, $field ) {
			return array_map( function( $item ) use ( $field ) {
				return $item[ $field ];
			}, $items );
		} );

		$collector = new Stackable_Site_Kit_Media_Collector();
		$content = $collector->localize_content( '<img src="https://example.test/wp-content/uploads/hero-office.png" />' );

		$this->assertSame( '<img src="assets/hero-office.png" />', $content );
		$this->assertSame( 'hero-office', $collector->collect()[0]['id'] );
		$this->assertSame( 'image/png', $collector->collect()[0]['mimeType'] );
		$this->assertSame( $source, $collector->get_files()['assets/hero-office.png'] );
		$this->assertSame( array(), $collector->get_warnings() );
	}

	public function test_reports_local_upload_without_attachment() {
		Functions\when( 'wp_get_upload_dir' )->justReturn( array( 'baseurl' => 'https://example.test/wp-content/uploads' ) );
		Functions\when( 'attachment_url_to_postid' )->justReturn( 0 );

		$collector = new Stackable_Site_Kit_Media_Collector();
		$content = $collector->localize_content( 'https://example.test/wp-content/uploads/missing.png' );

		$this->assertSame( 'https://example.test/wp-content/uploads/missing.png', $content );
		$this->assertSame( 'missing_media', $collector->get_warnings()[0]['code'] );
	}
}
