<?php
class PluginTest extends WP_UnitTestCase {

	/**
	 * Test if WordPress site is loaded.
	 */
	function test_wordpress_is_properly_loaded() {
		$this->assertTrue( function_exists( 'do_action' ) );
		$this->assertTrue( function_exists( 'add_filter' ) );
		$this->assertTrue( function_exists( 'apply_filters' ) );
	}

	/**
	 * Test if Stackable Free plugin is properly loaded.
	 */
	function test_stackable_is_properly_loaded() {
		$this->assertTrue( defined( 'STACKABLE_FILE' ) );
	}
}
