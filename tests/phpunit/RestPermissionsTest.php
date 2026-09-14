<?php
/**
 * REST permission callbacks for Posts, Design Library, and block styles.
 *
 * @package Stackable
 */

use Brain\Monkey\Functions;

class RestPermissionsTest extends Stackable_TestCase {

	public function test_posts_routes_require_edit_posts() {
		$can = true;
		Functions\when( 'current_user_can' )->alias( function() use ( &$can ) {
			return $can;
		} );

		$this->require_plugin_file( 'src/block/posts/index.php' );
		$posts = new Stackable_Posts_Block();
		$posts->register_rest_fields();

		$callback = $this->permission_callback_for( '/terms' );
		$this->assertTrue( call_user_func( $callback ) );
		$can = false;
		$this->assertFalse( call_user_func( $callback ) );

		$posts_callback = $this->permission_callback_for( '/get_posts' );
		$can = true;
		$this->assertTrue( call_user_func( $posts_callback ) );
		$can = false;
		$this->assertFalse( call_user_func( $posts_callback ) );
	}

	public function test_design_library_get_requires_edit_posts_and_image_requires_upload_files() {
		$cap_allowed = 'edit_posts';
		Functions\when( 'current_user_can' )->alias( function( $cap ) use ( &$cap_allowed ) {
			return $cap === $cap_allowed;
		} );

		$this->require_plugin_file( 'src/design-library/init.php' );
		$library = new Stackable_Design_Library();
		$library->register_route();

		$get = $this->route_containing( 'design_library/' );
		$post = $this->route_containing( 'design_library_image' );

		$this->assertTrue( call_user_func( $get['permission_callback'] ) );
		$this->assertFalse( call_user_func( $post['permission_callback'] ) );

		$cap_allowed = 'upload_files';
		$this->assertFalse( call_user_func( $get['permission_callback'] ) );
		$this->assertTrue( call_user_func( $post['permission_callback'] ) );
	}

	public function test_block_styles_require_edit_theme_options() {
		$this->require_plugin_file( 'src/deprecated/block-defaults/custom-block-styles.php' );
		Functions\when( 'current_user_can' )->alias( function( $cap ) {
			return 'edit_theme_options' === $cap;
		} );
		$this->assertTrue( Stackable_Custom_Block_Styles::can_manage_block_styles() );

		Functions\when( 'current_user_can' )->justReturn( false );
		$this->assertFalse( Stackable_Custom_Block_Styles::can_manage_block_styles() );
	}

	/**
	 * @param string $needle
	 * @return callable
	 */
	private function permission_callback_for( $needle ) {
		$route = $this->route_containing( $needle );
		return $route['permission_callback'];
	}

	/**
	 * @param string $needle
	 * @return array
	 */
	private function route_containing( $needle ) {
		$routes = isset( $GLOBALS['stackable_phpunit_rest_routes'] ) ? $GLOBALS['stackable_phpunit_rest_routes'] : array();
		foreach ( $routes as $route ) {
			if ( isset( $route['_route'] ) && false !== strpos( $route['_route'], $needle ) ) {
				return $route;
			}
		}
		$this->fail( 'Route not registered: ' . $needle );
	}
}
