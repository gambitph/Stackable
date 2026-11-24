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
		Functions\when( 'parse_blocks' )->alias( function( $content ) {
			return array( array( 'blockName' => null, 'attrs' => array(), 'innerBlocks' => array(), 'innerHTML' => $content ) );
		} );
		Functions\when( 'serialize_blocks' )->alias( function( $blocks ) {
			return $blocks[0]['innerHTML'];
		} );
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
		Functions\when( 'parse_blocks' )->justReturn(
			array(
				array(
					'blockName' => 'core/image',
					'attrs' => array( 'id' => 25 ),
					'innerBlocks' => array(),
				),
			)
		);
		Functions\when( 'serialize_blocks' )->alias( 'json_encode' );

		$collector = new Stackable_Site_Kit_Media_Collector();
		$content = $collector->localize_content( '<img src="https://example.test/wp-content/uploads/hero-office.png" />' );

		$blocks = json_decode( $content, true );
		$this->assertSame( 'hero-office', $blocks[0]['attrs']['stkSiteKitMediaIds']['id'] );
		$this->assertArrayNotHasKey( 'id', $blocks[0]['attrs'] );
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

	public function test_localizes_array_and_nested_attachment_ids() {
		$source = STACKABLE_PLUGIN_DIR . 'e2e/config/fixtures/site-kits/valid/consultant/assets/hero-office.png';

		Functions\when( 'wp_get_upload_dir' )->justReturn( array( 'baseurl' => 'https://example.test/wp-content/uploads' ) );
		Functions\when( 'attachment_url_to_postid' )->justReturn( 25 );
		Functions\when( 'get_attached_file' )->justReturn( $source );
		Functions\when( 'get_post_mime_type' )->justReturn( 'image/png' );
		Functions\when( 'get_allowed_mime_types' )->justReturn( array( 'png' => 'image/png' ) );
		Functions\when( 'sanitize_file_name' )->alias( 'basename' );
		Functions\when( 'wp_basename' )->alias( 'basename' );
		Functions\when( 'get_post' )->justReturn( (object) array( 'post_title' => '', 'post_excerpt' => '' ) );
		Functions\when( 'get_post_meta' )->justReturn( '' );
		Functions\when( 'wp_list_pluck' )->justReturn( array() );
		Functions\when( 'parse_blocks' )->justReturn(
			array(
				array(
					'blockName' => 'core/gallery',
					'attrs' => array(
						'ids' => array( 25 ),
						'images' => array( array( 'id' => 25, 'size' => 'large' ) ),
					),
					'innerBlocks' => array(),
				),
			)
		);
		Functions\when( 'serialize_blocks' )->alias( 'json_encode' );

		$collector = new Stackable_Site_Kit_Media_Collector();
		$content = $collector->localize_content( '<img src="https://example.test/wp-content/uploads/hero-office.png" />' );
		$attributes = json_decode( $content, true )[0]['attrs'];

		$this->assertArrayNotHasKey( 'ids', $attributes );
		$this->assertArrayNotHasKey( 'images', $attributes );
		$this->assertSame( array( 'hero-office' ), $attributes['stkSiteKitMediaIds']['ids'] );
		$this->assertSame( 'hero-office', $attributes['stkSiteKitMediaIds']['images'][0]['id'] );
		$this->assertSame( 'large', $attributes['stkSiteKitMediaIds']['images'][0]['size'] );
	}
}
