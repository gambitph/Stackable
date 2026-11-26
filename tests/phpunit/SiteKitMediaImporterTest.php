<?php
/**
 * Site Kit partial media selection coverage.
 *
 * @package Stackable
 */

class SiteKitMediaImporterTest extends Stackable_TestCase {

	protected function set_up() {
		parent::set_up();
		$this->require_plugin_file( 'src/site-kits/import/class-media-importer.php' );
	}

	public function test_selects_only_media_referenced_by_selected_groups() {
		$importer = new Stackable_Site_Kit_Media_Importer( new stdClass() );
		$package = array(
			'media' => array(
				array( 'id' => 'page-image', 'path' => 'assets/page.png' ),
				array( 'id' => 'theme-image', 'path' => 'assets/theme.png' ),
			),
		);

		$selected = $importer->select(
			$package,
			array( array( 'styles' => array( 'background' => 'url(assets/theme.png)' ) ) )
		);

		$this->assertSame( array( 'theme-image' ), array_column( $selected, 'id' ) );
	}

	public function test_selects_media_referenced_only_by_a_serialized_attachment_token() {
		Brain\Monkey\Functions\when( 'parse_blocks' )->justReturn(
			array(
				array(
					'attrs' => array( 'stkSiteKitMediaIds' => array( 'id' => 'page-image' ) ),
					'innerBlocks' => array(),
				),
			)
		);
		$importer = new Stackable_Site_Kit_Media_Importer( new stdClass() );
		$package = array(
			'media' => array( array( 'id' => 'page-image', 'path' => 'assets/page.png' ) ),
		);

		$selected = $importer->select(
			$package,
			array( '<!-- wp:image {"stkSiteKitMediaIds":{"id":"page-image"}} /-->' )
		);

		$this->assertSame( array( 'page-image' ), array_column( $selected, 'id' ) );
	}

	public function test_restores_attachment_tokens_without_discarding_ordinary_object_fields() {
		$importer = new Stackable_Site_Kit_Media_Importer( new stdClass() );
		$property = new ReflectionProperty( $importer, 'map' );
		$property->setValue(
			$importer,
			array(
				'hero-office' => array(
					'id' => 101,
					'url' => 'https://target.test/uploads/hero-office.png',
					'path' => 'assets/hero-office.png',
				),
			)
		);

		$rewritten = $importer->rewrite_value(
			array(
				'images' => array(
					array( 'url' => 'assets/hero-office.png', 'alt' => 'Office team', 'caption' => 2026 ),
				),
				'stkSiteKitMediaIds' => array(
					'images' => array( array( 'id' => 'hero-office' ) ),
				),
			)
		);

		$this->assertSame( 101, $rewritten['images'][0]['id'] );
		$this->assertSame( 'https://target.test/uploads/hero-office.png', $rewritten['images'][0]['url'] );
		$this->assertSame( 'Office team', $rewritten['images'][0]['alt'] );
		$this->assertSame( 2026, $rewritten['images'][0]['caption'] );
		$this->assertArrayNotHasKey( 'stkSiteKitMediaIds', $rewritten );
	}
}
