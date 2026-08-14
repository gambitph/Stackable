<?php
/**
 * KSES allowlist for Stackable SVG/style tags.
 *
 * @package Stackable
 */

use Brain\Monkey\Functions;

class KsesTest extends Stackable_TestCase {

	protected function set_up() {
		parent::set_up();
		$this->require_plugin_file( 'src/kses.php' );
	}

	/**
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_missing_user_functions_leave_tags_unchanged() {
		$tags = array( 'div' => array() );
		$out = stackable_allow_wp_kses_allowed_html( $tags, 'post' );
		$this->assertSame( $tags, $out );
	}

	public function test_user_without_edit_posts_leaves_tags_unchanged() {
		Functions\when( 'wp_get_current_user' )->justReturn( (object) array( 'ID' => 2 ) );
		Functions\when( 'current_user_can' )->justReturn( false );
		$tags = array( 'div' => array() );
		$out = stackable_allow_wp_kses_allowed_html( $tags, 'post' );
		$this->assertSame( $tags, $out );
		$this->assertArrayNotHasKey( 'svg', $out );
	}

	public function test_edit_posts_adds_svg_path_and_style() {
		Functions\when( 'wp_get_current_user' )->justReturn( (object) array( 'ID' => 1 ) );
		Functions\when( 'current_user_can' )->justReturn( true );
		$tags = array( 'div' => array() );
		$out = stackable_allow_wp_kses_allowed_html( $tags, 'post' );
		$this->assertArrayHasKey( 'svg', $out );
		$this->assertArrayHasKey( 'path', $out );
		$this->assertArrayHasKey( 'style', $out );
	}
}
