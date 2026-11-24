<?php
/**
 * Site Kit import selection coverage.
 *
 * @package Stackable
 */

use Brain\Monkey\Functions;

class SiteKitImportPlanTest extends Stackable_TestCase {

	protected function set_up() {
		parent::set_up();
		$this->require_plugin_file( 'src/site-kits/import/class-import-plan.php' );
		Functions\when( 'wp_list_pluck' )->alias( function( $items, $field ) {
			return array_map( function( $item ) use ( $field ) {
				return $item[ $field ];
			}, $items );
		} );
	}

	public function test_complete_plan_selects_all_groups_and_plugins() {
		$plan = Stackable_Site_Kit_Import_Plan::complete(
			array( 'plugins' => array( array( 'slug' => 'example/example.php' ) ) )
		);

		$this->assertSame( array( 'pages', 'theme', 'navigation', 'stackable', 'plugins' ), $plan->get_groups() );
		$this->assertTrue( $plan->includes_plugin( 'example/example.php' ) );
		$this->assertTrue( $plan->includes_plugin_settings( 'example/example.php' ) );
	}

	public function test_navigation_cannot_be_selected_without_pages() {
		$plan = Stackable_Site_Kit_Import_Plan::from_request(
			array( 'mode' => 'partial', 'groups' => array( 'navigation' ) ),
			array( 'plugins' => array() )
		);

		$this->assertTrue( is_wp_error( $plan ) );
		$this->assertSame( 'site_kit_import_invalid_plan', $plan->get_error_code() );
	}
}
