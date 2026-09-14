<?php
/**
 * PHPUnit bootstrap for Stackable PHP runtime tests.
 *
 * Does not load plugin.php or Freemius. Each test require_once()s the
 * production file under test after Brain Monkey is set up.
 *
 * @package Stackable
 */

$stackable_root = dirname( __DIR__, 2 );

require_once $stackable_root . '/vendor/autoload.php';

if ( class_exists( '\Yoast\PHPUnitPolyfills\Autoload' ) ) {
	// Polyfills are autoloaded via Composer.
}

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', $stackable_root . '/tests/phpunit/abspath/' );
}

if ( ! defined( 'STACKABLE_PHPUNIT' ) ) {
	define( 'STACKABLE_PHPUNIT', true );
}

if ( ! defined( 'STACKABLE_FILE' ) ) {
	define( 'STACKABLE_FILE', $stackable_root . '/plugin.php' );
}

if ( ! defined( 'STACKABLE_VERSION' ) ) {
	define( 'STACKABLE_VERSION', '0.0.0-test' );
}

if ( ! defined( 'STACKABLE_I18N' ) ) {
	define( 'STACKABLE_I18N', 'stackable-ultimate-gutenberg-blocks' );
}

if ( ! defined( 'STACKABLE_BUILD' ) ) {
	define( 'STACKABLE_BUILD', 'free' );
}

if ( ! defined( 'STACKABLE_PLUGIN_DIR' ) ) {
	define( 'STACKABLE_PLUGIN_DIR', $stackable_root . '/' );
}

$premium_dir = $stackable_root . '/pro__premium_only';
if ( is_dir( $premium_dir ) && ! defined( 'STACKABLE_PREMIUM_DIR' ) ) {
	define( 'STACKABLE_PREMIUM_DIR', $premium_dir );
}

if ( ! class_exists( 'WP_Error' ) ) {
	class WP_Error {
		public $errors = array();
		public $error_data = array();
		public $code = '';
		public $message = '';

		public function __construct( $code = '', $message = '', $data = '' ) {
			$this->code = $code;
			$this->message = $message;
			if ( $code ) {
				$this->errors[ $code ][] = $message;
			}
			if ( $data ) {
				$this->error_data[ $code ] = $data;
			}
		}

		public function get_error_code() {
			return $this->code;
		}

		public function get_error_message() {
			return $this->message;
		}
	}
}

if ( ! function_exists( 'is_wp_error' ) ) {
	function is_wp_error( $thing ) {
		return $thing instanceof WP_Error;
	}
}

if ( ! function_exists( 'is_frontend' ) ) {
	function is_frontend() {
		return false;
	}
}

if ( ! function_exists( '__return_false' ) ) {
	function __return_false() {
		return false;
	}
}

if ( ! function_exists( '__return_true' ) ) {
	function __return_true() {
		return true;
	}
}

if ( ! function_exists( 'register_rest_route' ) ) {
	function register_rest_route( $namespace, $route, $args = array() ) {
		$args['_route'] = $route;
		$args['_namespace'] = $namespace;
		$GLOBALS['stackable_phpunit_rest_routes'][] = $args;
		return true;
	}
}

require_once __DIR__ . '/TestCase.php';
