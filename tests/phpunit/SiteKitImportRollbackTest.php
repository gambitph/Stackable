<?php
/**
 * Site Kit in-request rollback coverage.
 *
 * @package Stackable
 */

use Brain\Monkey\Functions;

class SiteKitImportRollbackTest extends Stackable_TestCase {

	protected function set_up() {
		parent::set_up();
		$this->require_plugin_file( 'src/site-kits/import/class-import-rollback.php' );
	}

	public function test_restores_existing_posts_and_options() {
		Functions\when( 'get_option' )->justReturn( 'original-option' );
		Functions\when( 'get_post' )->justReturn(
			array(
				'ID' => 7,
				'post_type' => 'page',
				'post_content' => 'Original content',
			)
		);
		Functions\when( 'get_post_meta' )->justReturn( array( 'example' => array( 'original-meta' ) ) );
		Functions\when( 'wp_slash' )->returnArg( 1 );
		Functions\when( 'wp_update_post' )->justReturn( 7 );
		Functions\when( 'delete_post_meta' )->justReturn( true );
		Functions\when( 'add_post_meta' )->justReturn( true );
		Functions\when( 'maybe_unserialize' )->returnArg( 1 );
		Functions\expect( 'update_option' )->once()->with( 'example_option', 'original-option' )->andReturn( true );

		$rollback = new Stackable_Site_Kit_Import_Rollback();
		$rollback->record_option( 'example_option' );
		$rollback->record_post( 7 );

		$this->assertSame( array(), $rollback->rollback() );
	}

	public function test_runs_registered_callbacks_in_reverse_order() {
		$order = array();
		$rollback = new Stackable_Site_Kit_Import_Rollback();
		$rollback->record_callback( function() use ( &$order ) {
			$order[] = 'first';
			return true;
		}, 'First callback failed' );
		$rollback->record_callback( function() use ( &$order ) {
			$order[] = 'second';
			return true;
		}, 'Second callback failed' );

		$this->assertSame( array(), $rollback->rollback() );
		$this->assertSame( array( 'second', 'first' ), $order );
	}
}
