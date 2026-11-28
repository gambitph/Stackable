<?php
/**
 * stackable_prime_option_caches(): one prefix query instead of a
 * hard-coded option name list.
 *
 * @package Stackable
 */

use Brain\Monkey\Functions;

class OptionCachesTest extends Stackable_TestCase {

	private $cache = array();
	private $alloptions = array();
	private $wpdb;

	protected function set_up() {
		parent::set_up();
		$this->cache = array();
		$this->alloptions = array();
		$GLOBALS['stackable_primed_option_names'] = array();

		$cache = &$this->cache;
		$alloptions = &$this->alloptions;

		Functions\when( 'wp_installing' )->justReturn( false );
		Functions\when( 'wp_load_alloptions' )->alias( function() use ( &$alloptions ) {
			return $alloptions;
		} );
		Functions\when( 'wp_cache_get' )->alias( function( $key, $group = '' ) use ( &$cache ) {
			if ( 'options' !== $group || ! array_key_exists( $key, $cache ) ) {
				return false;
			}
			return $cache[ $key ];
		} );
		Functions\when( 'wp_cache_set' )->alias( function( $key, $value, $group = '' ) use ( &$cache ) {
			if ( 'options' === $group ) {
				$cache[ $key ] = $value;
			}
			return true;
		} );
		Functions\when( 'wp_cache_add' )->alias( function( $key, $value, $group = '' ) use ( &$cache ) {
			if ( 'options' === $group && ! array_key_exists( $key, $cache ) ) {
				$cache[ $key ] = $value;
			}
			return true;
		} );
		Functions\when( 'wp_cache_set_multiple' )->alias( function( $values, $group = '' ) use ( &$cache ) {
			if ( 'options' === $group ) {
				foreach ( $values as $key => $value ) {
					$cache[ $key ] = $value;
				}
			}
			return true;
		} );

		$that = $this;
		Functions\when( 'has_filter' )->alias( function( $tag, $fn = false ) use ( $that ) {
			if ( empty( $that->captured_filters[ $tag ] ) ) {
				return false;
			}
			if ( false === $fn ) {
				return true;
			}
			return in_array( $fn, $that->captured_filters[ $tag ], true );
		} );

		$this->wpdb = new OptionCachesTest_Wpdb();
		$GLOBALS['wpdb'] = $this->wpdb;

		$this->require_plugin_file( 'plugin.php' );
		// require_once may run prime once; start each test with a clean query log.
		$this->wpdb->queries = array();
	}

	protected function tear_down() {
		unset( $GLOBALS['wpdb'] );
		parent::tear_down();
	}

	/**
	 * Saved stackable_* options (including a name that was never on the old
	 * list) go into the options cache in one query. Autoloaded and oversized
	 * values are left alone. Inheritance transients are included; other
	 * transients are not.
	 */
	public function test_one_query_loads_saved_options_by_prefix() {
		$this->alloptions = array(
			'stackable_current_version_installed' => '3.20.4',
		);
		$this->wpdb->rows = array(
			(object) array( 'option_name' => 'stackable_current_version_installed', 'option_value' => '3.20.4' ),
			(object) array( 'option_name' => 'stackable_use_legacy_frontend_css', 'option_value' => '' ),
			// A name that would have been missed by the old hard-coded list.
			(object) array( 'option_name' => 'stackable_new_setting', 'option_value' => 'yes' ),
			(object) array( 'option_name' => '_transient_stackable_block_style_inheritance_css', 'option_value' => 'body{}' ),
			(object) array( 'option_name' => '_transient_stackable_get_design_abc', 'option_value' => 'huge-library' ),
			(object) array( 'option_name' => 'stackable_icon_library', 'option_value' => str_repeat( 'x', 100001 ) ),
		);

		stackable_prime_option_caches();

		$this->assertCount( 1, $this->wpdb->queries, 'one SELECT for all matching options' );
		$sql = $this->wpdb->queries[0][0];
		$this->assertStringContainsString( 'LIKE %s', $sql );
		$this->assertSame(
			array(
				$this->wpdb->esc_like( 'stackable_' ) . '%',
				$this->wpdb->esc_like( '_transient_stackable_block_style_inheritance_' ) . '%',
				$this->wpdb->esc_like( '_transient_timeout_stackable_block_style_inheritance_' ) . '%',
			),
			$this->wpdb->queries[0][1]
		);

		$this->assertArrayNotHasKey( 'stackable_current_version_installed', $this->cache, 'autoloaded option already in alloptions' );
		$this->assertSame( '', $this->cache['stackable_use_legacy_frontend_css'] );
		$this->assertSame( 'yes', $this->cache['stackable_new_setting'] );
		$this->assertSame( 'body{}', $this->cache['_transient_stackable_block_style_inheritance_css'] );
		$this->assertArrayNotHasKey( '_transient_stackable_get_design_abc', $this->cache, 'design-library transients are not primed' );
		$this->assertArrayNotHasKey( 'stackable_icon_library', $this->cache, 'oversized option is not primed' );
	}

	/**
	 * get_option() of an unsaved stackable_* name should not need a list
	 * entry: the pre_option hook marks it in notoptions.
	 */
	public function test_unsaved_stackable_option_is_marked_missing() {
		$this->wpdb->rows = array();
		stackable_prime_option_caches();

		$this->assertContains( 'stackable_mark_unsaved_option', $this->captured_filters['pre_option'] );

		$result = apply_filters( 'pre_option', false, 'stackable_never_saved', false );
		$this->assertFalse( $result, 'the hook does not short-circuit get_option()' );
		$this->assertTrue( $this->cache['notoptions']['stackable_never_saved'] );
	}

	/**
	 * An option added later in the same request is already in the cache,
	 * so it must not be marked missing.
	 */
	public function test_option_added_later_is_not_marked_missing() {
		$this->wpdb->rows = array();
		stackable_prime_option_caches();
		$this->cache['stackable_added_later'] = '1';

		apply_filters( 'pre_option', false, 'stackable_added_later', false );
		$notoptions = isset( $this->cache['notoptions'] ) ? $this->cache['notoptions'] : array();
		$this->assertArrayNotHasKey( 'stackable_added_later', $notoptions );
	}

	public function test_unrelated_options_are_not_marked_missing() {
		$this->wpdb->rows = array();
		stackable_prime_option_caches();
		apply_filters( 'pre_option', false, 'blogname', false );
		$notoptions = isset( $this->cache['notoptions'] ) ? $this->cache['notoptions'] : array();
		$this->assertArrayNotHasKey( 'blogname', $notoptions );
	}

	public function test_does_nothing_while_wordpress_is_installing() {
		Functions\when( 'wp_installing' )->justReturn( true );
		$this->wpdb->rows = array(
			(object) array( 'option_name' => 'stackable_use_legacy_frontend_css', 'option_value' => '' ),
		);
		stackable_prime_option_caches();
		$this->assertSame( array(), $this->wpdb->queries );
	}
}

/**
 * Minimal $wpdb stand-in: records prepare() arguments and returns canned rows.
 */
class OptionCachesTest_Wpdb {
	public $options = 'wp_options';
	public $rows = array();
	public $queries = array();

	public function esc_like( $text ) {
		return addcslashes( $text, '_%\\' );
	}

	public function prepare( $query, ...$args ) {
		if ( 1 === count( $args ) && is_array( $args[0] ) ) {
			$args = $args[0];
		}
		$this->queries[] = array( $query, $args );
		return $query;
	}

	public function get_results( $query ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter
		if ( empty( $this->queries ) ) {
			return $this->rows;
		}
		// Honor the LIKE prefixes from the last prepare(), so a
		// design-library transient is not returned as a stackable_* row.
		$likes = $this->queries[ count( $this->queries ) - 1 ][1];
		$matched = array();
		foreach ( $this->rows as $row ) {
			foreach ( $likes as $like ) {
				$prefix = str_replace( '\_', '_', substr( $like, 0, -1 ) );
				if ( strpos( $row->option_name, $prefix ) === 0 ) {
					$matched[] = $row;
					break;
				}
			}
		}
		return $matched;
	}
}
