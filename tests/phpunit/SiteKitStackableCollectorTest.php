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
}
