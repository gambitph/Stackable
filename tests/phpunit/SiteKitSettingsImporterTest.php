<?php
/**
 * Site Kit Stackable settings import coverage.
 *
 * @package Stackable
 */

class SiteKitSettingsImporterTest extends Stackable_TestCase {

	protected function set_up() {
		parent::set_up();
		$this->require_plugin_file( 'src/site-kits/import/class-settings-importer.php' );
	}

	public function test_preflight_accepts_packages_without_global_block_styles() {
		$importer = new Stackable_Site_Kit_Settings_Importer( new stdClass() );

		$this->assertTrue( $importer->preflight( array( 'settings' => array() ) ) );
	}

	public function test_preflight_rejects_block_styles_without_a_css_generator() {
		$importer = new Stackable_Site_Kit_Settings_Importer( new stdClass() );
		$result = $importer->preflight(
			array(
				'settings' => array(
					'stackable_global_block_styles' => array(
						'card' => array(
							array( 'name' => 'Elevated', 'slug' => 'elevated', 'attributes' => array() ),
						),
					),
				),
			)
		);

		$this->assertTrue( is_wp_error( $result ) );
		$this->assertSame( 'site_kit_import_block_styles_unavailable', $result->get_error_code() );
	}

	public function test_preflight_accepts_regenerated_block_styles_with_the_same_portable_data() {
		$portable = array(
			'card' => array(
				array(
					'name' => 'Elevated',
					'slug' => 'stk-block-card--style-elevated',
					'attributes' => array( 'backgroundColor' => '#ffffff' ),
					'nonCssAttributes' => array(),
				),
			),
		);
		add_filter( 'stackable_site_kit_import_block_styles', function() use ( $portable ) {
			$generated = $portable;
			$generated['card'][0]['saveCss'] = '.stk-block-card--style-elevated{background:#fff}';
			$generated['card'][0]['editCss'] = '[data-block-style="stk-block-card--style-elevated"]{background:#fff}';
			return $generated;
		} );

		$importer = new Stackable_Site_Kit_Settings_Importer( new stdClass() );

		$this->assertTrue( $importer->preflight( array( 'settings' => array( 'stackable_global_block_styles' => $portable ) ) ) );
	}

	public function test_preflight_rejects_unsafe_generated_block_style_css() {
		$portable = array(
			'card' => array(
				array( 'name' => 'Unsafe', 'slug' => 'unsafe', 'attributes' => array(), 'nonCssAttributes' => array() ),
			),
		);
		add_filter( 'stackable_site_kit_import_block_styles', function() use ( $portable ) {
			$generated = $portable;
			$generated['card'][0]['saveCss'] = '</style><script>alert(1)</script>';
			$generated['card'][0]['editCss'] = '';
			return $generated;
		} );

		$importer = new Stackable_Site_Kit_Settings_Importer( new stdClass() );
		$result = $importer->preflight( array( 'settings' => array( 'stackable_global_block_styles' => $portable ) ) );

		$this->assertTrue( is_wp_error( $result ) );
		$this->assertSame( 'site_kit_import_block_styles_unavailable', $result->get_error_code() );
	}
}
