<?php
/**
 * Site Kit user Global Styles export coverage.
 *
 * @package Stackable
 */

use Brain\Monkey\Functions;

if ( ! class_exists( 'WP_Theme_JSON_Resolver' ) ) {
	class WP_Theme_JSON_Resolver {
		public static $site_kit_user_data = array();

		public static function get_user_data() {
			return new Stackable_Site_Kit_Test_Theme_JSON( self::$site_kit_user_data );
		}

		public static function get_user_data_from_wp_global_styles() {
			return array();
		}

		public static function clean_cached_data() {}
	}
}

class Stackable_Site_Kit_Test_Theme_JSON {
	private $data;

	public function __construct( $data ) {
		$this->data = $data;
	}

	public function get_data() {
		return $this->data;
	}
}

class Stackable_Site_Kit_Theme_Test_Media {
	public function localize_content( $content ) {
		return $content;
	}

	public function localize_value( $value ) {
		return $value;
	}
}

class SiteKitThemeCollectorTest extends Stackable_TestCase {

	protected function set_up() {
		parent::set_up();
		$this->require_plugin_file( 'src/site-kits/export/class-portable-data.php' );
		$this->require_plugin_file( 'src/site-kits/export/class-theme-collector.php' );
		Functions\when( 'wp_get_theme' )->justReturn( new stdClass() );
		Functions\when( 'get_block_templates' )->justReturn( array() );
	}

	public function test_exports_user_global_styles_and_settings() {
		WP_Theme_JSON_Resolver::$site_kit_user_data = array(
			'version' => 3,
			'settings' => array( 'color' => array( 'custom' => false ) ),
			'styles' => array( 'color' => array( 'background' => '#123456' ) ),
		);

		$collector = new Stackable_Site_Kit_Theme_Collector( new Stackable_Site_Kit_Theme_Test_Media() );
		$theme = $collector->collect();

		$this->assertSame( false, $theme['settings']->color['custom'] );
		$this->assertSame( '#123456', $theme['styles']->color['background'] );
	}
}
