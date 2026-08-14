<?php
/**
 * Base PHPUnit case: Brain Monkey + common WordPress stubs.
 *
 * @package Stackable
 */

use Brain\Monkey;
use Brain\Monkey\Functions;
use Yoast\PHPUnitPolyfills\TestCases\TestCase as PolyfillTestCase;

abstract class Stackable_TestCase extends PolyfillTestCase {

	/**
	 * Closures registered via add_filter() during a test.
	 *
	 * @var array
	 */
	protected $captured_filters = array();

	protected function set_up() {
		parent::set_up();
		Monkey\setUp();
		$GLOBALS['stackable_phpunit_rest_routes'] = array();
		$this->captured_filters = array();
		$this->stub_wordpress_defaults();
	}

	protected function tear_down() {
		unset( $GLOBALS['stackable_unique_ids'] );
		Monkey\tearDown();
		parent::tear_down();
	}

	/**
	 * Stub WordPress helpers used at file-load and in the PHP seams under test.
	 * add_filter / apply_filters run captured closures (Brain Monkey does not).
	 * Leave add_action / do_action to Brain Monkey.
	 */
	protected function stub_wordpress_defaults() {
		Functions\when( '__' )->returnArg( 1 );
		Functions\when( 'esc_html__' )->returnArg( 1 );
		Functions\when( 'esc_html' )->alias( array( $this, 'stub_esc_html' ) );
		Functions\when( 'esc_attr' )->alias( array( $this, 'stub_esc_html' ) );
		Functions\when( 'esc_url' )->returnArg( 1 );
		Functions\when( 'esc_url_raw' )->returnArg( 1 );
		Functions\when( 'wp_kses_post' )->alias( array( $this, 'stub_wp_kses_post' ) );
		Functions\when( 'sanitize_text_field' )->alias( array( $this, 'stub_sanitize_text_field' ) );
		Functions\when( 'sanitize_title' )->alias( array( $this, 'stub_sanitize_title' ) );
		Functions\when( 'wp_json_encode' )->alias( 'json_encode' );
		Functions\when( 'wp_trim_words' )->alias( array( $this, 'stub_wp_trim_words' ) );
		Functions\when( 'is_admin' )->justReturn( true );
		Functions\when( 'wp_is_json_request' )->justReturn( false );
		Functions\when( 'get_option' )->justReturn( false );
		Functions\when( 'register_activation_hook' )->justReturn( true );
		Functions\when( 'register_deactivation_hook' )->justReturn( true );
		Functions\when( 'add_option' )->justReturn( true );
		Functions\when( 'register_setting' )->justReturn( true );

		$that = $this;
		Functions\when( 'add_filter' )->alias( function( $tag, $fn, $priority = 10, $accepted_args = 1 ) use ( $that ) {
			if ( ! isset( $that->captured_filters[ $tag ] ) ) {
				$that->captured_filters[ $tag ] = array();
			}
			$that->captured_filters[ $tag ][] = $fn;
			return true;
		} );
		Functions\when( 'apply_filters' )->alias( function( $tag, $value ) use ( $that ) {
			$args = func_get_args();
			array_shift( $args );
			if ( empty( $that->captured_filters[ $tag ] ) ) {
				return $value;
			}
			foreach ( $that->captured_filters[ $tag ] as $fn ) {
				$value = call_user_func_array( $fn, $args );
				$args[0] = $value;
			}
			return $value;
		} );
	}

	/**
	 * Require a production file relative to the free plugin root.
	 *
	 * @param string $relative Path from plugin root.
	 */
	protected function require_plugin_file( $relative ) {
		require_once STACKABLE_PLUGIN_DIR . ltrim( $relative, '/' );
	}

	/**
	 * Require a production file relative to pro__premium_only/.
	 *
	 * @param string $relative Path from the premium directory.
	 */
	protected function require_premium_file( $relative ) {
		if ( ! defined( 'STACKABLE_PREMIUM_DIR' ) ) {
			$this->markTestSkipped( 'pro__premium_only is not present' );
		}
		require_once STACKABLE_PREMIUM_DIR . '/' . ltrim( $relative, '/' );
	}

	/**
	 * Include a premium file every test (for files that register closures at load time).
	 *
	 * @param string $relative Path from the premium directory.
	 */
	protected function include_premium_file( $relative ) {
		if ( ! defined( 'STACKABLE_PREMIUM_DIR' ) ) {
			$this->markTestSkipped( 'pro__premium_only is not present' );
		}
		include STACKABLE_PREMIUM_DIR . '/' . ltrim( $relative, '/' );
	}

	public function stub_esc_html( $text ) {
		return htmlspecialchars( (string) $text, ENT_QUOTES, 'UTF-8' );
	}

	public function stub_wp_kses_post( $text ) {
		return preg_replace( '#<script\b[^>]*>.*?</script>#is', '', (string) $text );
	}

	public function stub_sanitize_text_field( $value ) {
		if ( ! is_string( $value ) ) {
			return '';
		}
		return trim( strip_tags( $value ) );
	}

	public function stub_sanitize_title( $value ) {
		$value = strtolower( (string) $value );
		$value = preg_replace( '/[^a-z0-9]+/', '-', $value );
		return trim( $value, '-' );
	}

	/**
	 * WordPress-like trim: strip tags, then split on whitespace.
	 *
	 * @param string $text
	 * @param int    $num_words
	 * @param string|null $more
	 * @return string
	 */
	public function stub_wp_trim_words( $text, $num_words = 55, $more = null ) {
		if ( null === $more ) {
			$more = '&hellip;';
		}
		$text = preg_replace( '/<[^>]*>/', '', (string) $text );
		$words = preg_split( '/[\r\n\t ]+/', trim( $text ), $num_words + 1 );
		if ( false === $words ) {
			return '';
		}
		if ( count( $words ) > $num_words ) {
			array_pop( $words );
			return implode( ' ', $words ) . $more;
		}
		return implode( ' ', $words );
	}
}
