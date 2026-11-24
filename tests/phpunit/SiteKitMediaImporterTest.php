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
}
