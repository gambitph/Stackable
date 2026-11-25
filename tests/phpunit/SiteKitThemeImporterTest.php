<?php
/**
 * Site Kit block-theme import coverage.
 *
 * @package Stackable
 */

use Brain\Monkey\Functions;

if ( ! class_exists( 'WP_Theme_JSON_Resolver' ) ) {
	class WP_Theme_JSON_Resolver {
		public static function get_user_data_from_wp_global_styles() {
			return array();
		}

		public static function clean_cached_data() {}
	}
}

class SiteKitThemeImporterTest extends Stackable_TestCase {

	protected function set_up() {
		parent::set_up();
		$this->require_plugin_file( 'src/site-kits/import/class-theme-importer.php' );
	}

	public function test_imported_templates_use_the_template_slug_and_wp_theme_taxonomy() {
		$inserted_posts = array();
		$assigned_terms = array();
		Functions\when( 'wp_get_theme' )->justReturn( new stdClass() );
		Functions\when( 'get_stylesheet' )->justReturn( 'start-stackable' );
		Functions\when( 'get_posts' )->justReturn( array() );
		Functions\when( 'wp_slash' )->returnArg( 1 );
		Functions\when( 'update_post_meta' )->justReturn( true );
		Functions\when( 'wp_insert_post' )->alias( function( $post ) use ( &$inserted_posts ) {
			$inserted_posts[] = $post;
			return count( $inserted_posts );
		} );
		Functions\when( 'wp_set_object_terms' )->alias( function( $post_id, $terms, $taxonomy ) use ( &$assigned_terms ) {
			$assigned_terms[] = array( $post_id, $terms, $taxonomy );
			return array( 1 );
		} );

		$rollback = new class() {
			public function record_new_post( $post_id ) {}
		};
		$media = new class() {
			public function rewrite_value( $value ) {
				return $value;
			}

			public function rewrite_content( $content ) {
				return $content;
			}
		};
		$importer = new Stackable_Site_Kit_Theme_Importer( $rollback, $media );
		$result = $importer->import(
			array(
				'slug' => 'consultant',
				'theme' => array(
					'styleVariation' => null,
					'settings' => array(),
					'styles' => array(),
					'templates' => array(
						array(
							'slug' => 'landing',
							'title' => 'Landing',
							'status' => 'publish',
							'content' => '<!-- wp:paragraph /-->',
						),
					),
					'templateParts' => array(),
				),
			)
		);

		$this->assertTrue( $result );
		$this->assertSame( 'landing', $inserted_posts[1]['post_name'] );
		$this->assertContains( array( 2, 'start-stackable', 'wp_theme' ), $assigned_terms );
	}

	public function test_partial_theme_import_does_not_apply_shell_flags_to_an_existing_homepage() {
		Functions\expect( 'update_post_meta' )->never();
		$rollback = new class() {};
		$importer = new Stackable_Site_Kit_Theme_Importer( $rollback, new stdClass() );

		$result = $importer->apply_shell_flags(
			array(
				'site' => array( 'frontPage' => 'home' ),
				'theme' => array( 'headerFlags' => array( 'sticky' => true, 'transparent' => true ) ),
			),
			array()
		);

		$this->assertTrue( $result );
	}
}
