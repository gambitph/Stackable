<?php
/**
 * Stackable settings collector coverage.
 *
 * @package Stackable
 */

use Brain\Monkey\Functions;

class SiteKitStackableCollectorTest extends Stackable_TestCase {

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

	public function test_omits_generated_css_from_global_block_styles() {
		$block_styles = array(
			'card' => array(
				array(
					'name' => 'Elevated',
					'slug' => 'elevated',
					'attributes' => array( 'borderRadius' => 12 ),
					'nonCssAttributes' => array( 'className' => 'is-style-elevated' ),
					'saveCss' => '.card{border-radius:12px}',
					'editCss' => '.editor-card{border-radius:12px}',
				),
			),
		);

		Functions\when( 'get_option' )->alias( function( $name, $default = false ) use ( $block_styles ) {
			return 'stackable_global_block_styles' === $name ? $block_styles : $default;
		} );

		$collector = new Stackable_Site_Kit_Stackable_Collector();
		$result = $collector->collect();
		$settings = get_object_vars( $result['settings'] );
		$exported_style = $settings['stackable_global_block_styles']['card'][0];

		$this->assertSame( 'Elevated', $exported_style['name'] );
		$this->assertSame( array( 'borderRadius' => 12 ), $exported_style['attributes'] );
		$this->assertArrayNotHasKey( 'saveCss', $exported_style );
		$this->assertArrayNotHasKey( 'editCss', $exported_style );
	}

	public function test_localizes_attachment_ids_in_non_css_attributes() {
		$source = STACKABLE_PLUGIN_DIR . 'e2e/config/fixtures/site-kits/valid/consultant/assets/hero-office.png';
		$block_styles = array(
			'stackable/card' => array(
				array(
					'name' => 'Image card',
					'slug' => 'image-card',
					'attributes' => array(),
					'nonCssAttributes' => array( 'imageId' => 25, 'caption' => 2026 ),
				),
			),
		);
		Functions\when( 'get_option' )->alias( function( $name, $default = false ) use ( $block_styles ) {
			return 'stackable_global_block_styles' === $name ? $block_styles : $default;
		} );
		Functions\when( 'get_post_type' )->justReturn( 'attachment' );
		Functions\when( 'get_attached_file' )->justReturn( $source );
		Functions\when( 'get_post_mime_type' )->justReturn( 'image/png' );
		Functions\when( 'get_allowed_mime_types' )->justReturn( array( 'png' => 'image/png' ) );
		Functions\when( 'sanitize_file_name' )->alias( 'basename' );
		Functions\when( 'wp_basename' )->alias( 'basename' );
		Functions\when( 'get_post' )->justReturn( (object) array( 'post_title' => '', 'post_excerpt' => '' ) );
		Functions\when( 'get_post_meta' )->justReturn( '' );
		Functions\when( 'wp_list_pluck' )->justReturn( array() );
		Functions\when( 'wp_get_upload_dir' )->justReturn( array( 'baseurl' => 'https://example.test/wp-content/uploads' ) );

		$collector = new Stackable_Site_Kit_Stackable_Collector( new Stackable_Site_Kit_Media_Collector() );
		$settings = get_object_vars( $collector->collect()['settings'] );
		$attributes = $settings['stackable_global_block_styles']['stackable/card'][0]['nonCssAttributes'];

		$this->assertSame( 2026, $attributes['caption'] );
		$this->assertSame( 'hero-office', $attributes['stkSiteKitMediaIds']['imageId'] );
		$this->assertArrayNotHasKey( 'imageId', $attributes );
	}
}
