<?php
/**
 * Deactivation deletes leftover options.
 *
 * @package Stackable
 */

use Brain\Monkey\Functions;

class DeactivationCleanupTest extends Stackable_TestCase {

	public function test_deactivation_deletes_cached_and_legacy_options() {
		$deleted = array();
		Functions\when( 'delete_option' )->alias( function( $name ) use ( &$deleted ) {
			$deleted[] = $name;
			return true;
		} );

		$this->require_plugin_file( 'plugin.php' );
		$this->assertTrue( function_exists( 'stackable_deactivation_cleanup' ) );
		stackable_deactivation_cleanup();

		$this->assertEqualsCanonicalizing(
			array(
				'stackable_dynamic_content_other_fields_frontend',
				'stackable_dynamic_content_meta_keys_frontend',
				'stackable_inspector_premium_notice_status',
				'stackable_enable_navigation_panel',
				'stackable_custom_php_sigs',
				'stackable_disp_cond_custom_php_sigs',
			),
			$deleted
		);
	}
}
