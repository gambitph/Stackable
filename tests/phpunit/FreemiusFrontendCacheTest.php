<?php
/**
 * Frontend Freemius license cache (round 2): refreshed on admin loads and on
 * license / plan change hooks, with the TTL as a fallback.
 *
 * @package Stackable
 */

use Brain\Monkey\Functions;

if ( ! function_exists( 'stackable_is_frontend_request' ) ) {
	// plugin.php is not loaded in PHPUnit; the request type is set per test.
	function stackable_is_frontend_request() {
		return ! empty( $GLOBALS['stk_test_is_frontend'] );
	}
}

/**
 * Stands in for the Freemius SDK instance. do_action() runs the callbacks
 * registered with add_action(), like Freemius does for its own action tags.
 */
class Stackable_Test_Fake_Freemius {
	public $can_use = false;
	public $plan = '';
	public $actions = array();

	public function can_use_premium_code() {
		return $this->can_use;
	}
	public function is__premium_only() {
		return true;
	}
	public function is_plan( $plan, $exact = false ) {
		return $this->plan === $plan;
	}
	public function add_filter( ...$args ) {}
	public function add_action( $tag, $callback ) {
		$this->actions[ $tag ][] = $callback;
	}
	public function do_action( $tag ) {
		foreach ( isset( $this->actions[ $tag ] ) ? $this->actions[ $tag ] : array() as $callback ) {
			call_user_func( $callback );
		}
	}
}

class FreemiusFrontendCacheTest extends Stackable_TestCase {

	private $options = array();
	private $writes = 0;

	protected function set_up() {
		parent::set_up();
		$this->options = array();
		$this->writes = 0;
		$GLOBALS['stk_test_is_frontend'] = true;
		unset( $GLOBALS['stackable_freemius_cache_changed'] );
		$options = &$this->options;
		$writes = &$this->writes;
		Functions\when( 'is_multisite' )->justReturn( false );
		Functions\when( 'get_option' )->alias( function( $name, $default = false ) use ( &$options ) {
			return array_key_exists( $name, $options ) ? $options[ $name ] : $default;
		} );
		Functions\when( 'update_option' )->alias( function( $name, $value ) use ( &$options, &$writes ) {
			$options[ $name ] = $value;
			$writes++;
			return true;
		} );
		Functions\when( 'delete_option' )->alias( function( $name ) use ( &$options ) {
			unset( $options[ $name ] );
			return true;
		} );

		if ( ! function_exists( 'stackable_freemius_frontend_cache' ) ) {
			// A valid cache at load time makes freemius.php use its stub
			// instead of loading the real SDK.
			$this->options['stackable_freemius_frontend_cache'] = $this->cache( false );
			if ( ! defined( 'DAY_IN_SECONDS' ) ) {
				define( 'HOUR_IN_SECONDS', 3600 );
				define( 'DAY_IN_SECONDS', 86400 );
			}
			require_once dirname( __DIR__, 2 ) . '/freemius.php';
			$this->assertInstanceOf( 'Stackable_Freemius_Frontend', $GLOBALS['sugb_fs'] );
			$this->options = array();
		}
	}

	protected function tear_down() {
		unset( $GLOBALS['sugb_fs'], $GLOBALS['stk_test_is_frontend'], $GLOBALS['stackable_freemius_cache_changed'] );
		parent::tear_down();
	}

	private function cache( $can_use, $age = 60 ) {
		return array(
			'can_use_premium_code' => $can_use,
			'is__premium_only' => true,
			'plans' => array( 'starter' => false, 'professional' => false, 'business' => false ),
			'version' => STACKABLE_VERSION,
			'time' => time() - $age,
		);
	}

	/** An admin (or other SDK) request: the real SDK loads and our setup runs. */
	private function admin_request( $sdk ) {
		$GLOBALS['stk_test_is_frontend'] = false;
		$GLOBALS['sugb_fs'] = $sdk;
		stackable_freemius_setup();
	}

	/** End of the request, then the next frontend request reads the cache. */
	private function next_frontend_can_use_premium_code() {
		stackable_freemius_save_frontend_cache();
		unset( $GLOBALS['stackable_freemius_cache_changed'] );
		$GLOBALS['stk_test_is_frontend'] = true;
		$cache = stackable_freemius_frontend_cache();
		$this->assertIsArray( $cache, 'frontend should be served from the cache' );
		$stub = new Stackable_Freemius_Frontend( $cache );
		return $stub->can_use_premium_code();
	}

	public function test_setup_registers_refresh_and_license_change_hooks() {
		$sdk = new Stackable_Test_Fake_Freemius();
		$this->admin_request( $sdk );
		$this->assertNotFalse( has_action( 'shutdown', 'stackable_freemius_save_frontend_cache' ) );
		foreach ( array( 'after_license_activation', 'after_license_deactivation', 'after_license_change',
			'after_account_plan_sync', 'after_plans_sync', 'after_account_connection', 'after_account_delete' ) as $hook ) {
			$this->assertContains( 'stackable_freemius_license_changed', $sdk->actions[ $hook ], $hook );
		}
		$this->assertContains( 'stackable_freemius_delete_frontend_cache', $sdk->actions['after_uninstall'] );
	}

	public function test_admin_page_load_refreshes_the_cache() {
		$this->options['stackable_freemius_frontend_cache'] = $this->cache( false );
		$sdk = new Stackable_Test_Fake_Freemius();
		$sdk->can_use = true; // License activated, e.g. on the Freemius site.
		$this->admin_request( $sdk );
		$this->assertTrue( $this->next_frontend_can_use_premium_code() );
	}

	public function test_license_activation_updates_frontend_on_next_request() {
		$this->options['stackable_freemius_frontend_cache'] = $this->cache( false );
		$sdk = new Stackable_Test_Fake_Freemius();
		$this->admin_request( $sdk );
		$sdk->can_use = true;
		$sdk->do_action( 'after_license_activation' );
		$this->assertArrayNotHasKey( 'stackable_freemius_frontend_cache', $this->options, 'cache dropped right away' );
		$this->assertTrue( $this->next_frontend_can_use_premium_code() );
	}

	public function test_license_deactivation_and_plan_change_update_frontend() {
		$this->options['stackable_freemius_frontend_cache'] = $this->cache( true );
		$sdk = new Stackable_Test_Fake_Freemius();
		$sdk->can_use = true;
		$this->admin_request( $sdk );
		$sdk->can_use = false;
		$sdk->do_action( 'after_license_deactivation' );
		$this->assertFalse( $this->next_frontend_can_use_premium_code() );

		$this->admin_request( $sdk );
		$sdk->can_use = true;
		$sdk->plan = 'business';
		$sdk->do_action( 'after_license_change' );
		$this->assertTrue( $this->next_frontend_can_use_premium_code() );
		$this->assertTrue( $this->options['stackable_freemius_frontend_cache']['plans']['business'] );
	}

	public function test_change_hook_forces_a_write_even_when_unchanged() {
		$this->options['stackable_freemius_frontend_cache'] = $this->cache( true, 120 );
		$sdk = new Stackable_Test_Fake_Freemius();
		$sdk->can_use = true;
		$this->admin_request( $sdk );
		stackable_freemius_save_frontend_cache();
		$this->assertSame( 0, $this->writes, 'unchanged and fresh: no write on a normal admin load' );

		$sdk->do_action( 'after_account_plan_sync' );
		stackable_freemius_save_frontend_cache();
		$this->assertSame( 1, $this->writes );
		$this->assertGreaterThan( time() - 5, $this->options['stackable_freemius_frontend_cache']['time'] );
	}

	public function test_ttl_is_still_the_fallback() {
		$this->options['stackable_freemius_frontend_cache'] = $this->cache( true, DAY_IN_SECONDS + 60 );
		$this->assertFalse( stackable_freemius_frontend_cache() );
		$this->options['stackable_freemius_frontend_cache'] = $this->cache( true, DAY_IN_SECONDS - 60 );
		$this->assertIsArray( stackable_freemius_frontend_cache() );
	}

	public function test_uninstall_removes_the_cache_and_skips_saving() {
		$this->options['stackable_freemius_frontend_cache'] = $this->cache( true );
		$sdk = new Stackable_Test_Fake_Freemius();
		$this->admin_request( $sdk );
		$sdk->do_action( 'after_uninstall' );
		$this->assertArrayNotHasKey( 'stackable_freemius_frontend_cache', $this->options );
		$this->assertFalse( has_action( 'shutdown', 'stackable_freemius_save_frontend_cache' ) );
	}
}
