<?php
/**
 * Portable block-navigation reference coverage.
 *
 * @package Stackable
 */

use Brain\Monkey\Functions;

class Stackable_Site_Kit_Navigation_Test_Media {
	public function localize_content( $content ) {
		return $content;
	}

	public function localize_value( $value ) {
		return $value;
	}
}

class SiteKitNavigationPortabilityTest extends Stackable_TestCase {

	protected function set_up() {
		parent::set_up();
		$this->require_plugin_file( 'src/site-kits/export/class-portable-data.php' );
		$this->require_plugin_file( 'src/site-kits/export/class-theme-collector.php' );
		$this->require_plugin_file( 'src/site-kits/export/class-navigation-collector.php' );
		Functions\when( 'wp_list_pluck' )->alias( function( $items, $field ) {
			return array_map( function( $item ) use ( $field ) {
				return $item->{$field};
			}, $items );
		} );
	}

	public function test_theme_templates_replace_navigation_ids_with_slugs() {
		Functions\when( 'get_block_templates' )->justReturn(
			array(
				(object) array(
					'source' => 'custom',
					'slug' => 'home',
					'title' => 'Home',
					'status' => 'publish',
					'content' => '<!-- wp:navigation {"ref":42} /-->',
				),
			)
		);
		Functions\when( 'parse_blocks' )->justReturn(
			array(
				array( 'blockName' => 'core/navigation', 'attrs' => array( 'ref' => 42 ), 'innerBlocks' => array() ),
			)
		);
		Functions\when( 'serialize_blocks' )->alias( 'json_encode' );
		Functions\when( 'get_posts' )->justReturn(
			array( (object) array( 'ID' => 42, 'post_name' => 'primary-navigation' ) )
		);

		$collector = new Stackable_Site_Kit_Theme_Collector( new Stackable_Site_Kit_Navigation_Test_Media() );
		$result = $collector->collect();
		$blocks = json_decode( $result['templates'][0]['content'], true );

		$this->assertSame( 'primary-navigation', $blocks[0]['attrs']['stkSiteKitNavigation'] );
		$this->assertArrayNotHasKey( 'ref', $blocks[0]['attrs'] );
	}

	public function test_navigation_collector_follows_portable_slug_tokens() {
		Functions\when( 'get_nav_menu_locations' )->justReturn( array() );
		Functions\when( 'parse_blocks' )->justReturn( array() );
		Functions\when( 'serialize_blocks' )->justReturn( '' );
		Functions\when( 'get_posts' )->alias( function( $args ) {
			if ( isset( $args['post_name__in'] ) ) {
				return array(
					(object) array(
						'ID' => 42,
						'post_name' => 'primary-navigation',
						'post_title' => 'Primary Navigation',
						'post_status' => 'publish',
						'post_content' => '',
					),
				);
			}
			return array();
		} );

		$collector = new Stackable_Site_Kit_Navigation_Collector( new Stackable_Site_Kit_Navigation_Test_Media() );
		$result = $collector->collect(
			array(
				'package' => array(
					'theme' => array(
						'templates' => array( array( 'content' => '<!-- wp:navigation {"stkSiteKitNavigation":"primary-navigation"} /-->' ) ),
						'templateParts' => array(),
					),
				),
			)
		);

		$this->assertCount( 1, $result['entities'] );
		$this->assertSame( 'primary-navigation', $result['entities'][0]['slug'] );
	}
}
