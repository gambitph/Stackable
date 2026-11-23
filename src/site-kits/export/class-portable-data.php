<?php
/**
 * Portable data sanitization for Site Kit exports.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Portable_Data' ) ) {
	class Stackable_Site_Kit_Portable_Data {

		/**
		 * Remove secrets and values that cannot be represented in JSON.
		 *
		 * @param mixed  $value Value to sanitize.
		 * @param array  $warnings Collected warnings.
		 * @param string $path Current field path.
		 * @return mixed
		 */
		public static function sanitize( $value, &$warnings = array(), $path = '' ) {
			if ( is_null( $value ) || is_scalar( $value ) ) {
				return $value;
			}

			$was_object = is_object( $value );
			if ( $was_object ) {
				$value = get_object_vars( $value );
			}

			if ( ! is_array( $value ) ) {
				$warnings[] = self::warning( 'non_portable_value', $path, 'A non-portable value was omitted from the export.' );
				return null;
			}

			$sanitized = array();
			foreach ( $value as $key => $item ) {
				$item_path = $path . '/' . (string) $key;
				if ( is_string( $key ) && self::is_sensitive_key( $key ) ) {
					$warnings[] = self::warning( 'redacted_setting', $item_path, 'A sensitive setting was omitted from the export.' );
					continue;
				}
				if ( is_resource( $item ) ) {
					$warnings[] = self::warning( 'non_portable_value', $item_path, 'A non-portable value was omitted from the export.' );
					continue;
				}

				$sanitized[ $key ] = self::sanitize( $item, $warnings, $item_path );
			}

			return $was_object ? (object) $sanitized : $sanitized;
		}

		/**
		 * Convert an array to a JSON object at a schema object boundary.
		 *
		 * @param mixed $value Value to convert.
		 * @return object
		 */
		public static function as_object( $value ) {
			if ( is_object( $value ) ) {
				return $value;
			}

			return (object) ( is_array( $value ) ? $value : array() );
		}

		/**
		 * Check whether an option key may contain a credential or secret.
		 *
		 * @param string $key Setting key.
		 * @return bool
		 */
		private static function is_sensitive_key( $key ) {
			return 1 === preg_match( '/(?:password|passwd|secret|token|credential|private[_-]?key|api[_-]?key|auth[_-]?key|license[_-]?key)/i', $key );
		}

		/**
		 * Build a warning record.
		 *
		 * @param string $code Warning code.
		 * @param string $path Field path.
		 * @param string $message Warning message.
		 * @return array
		 */
		private static function warning( $code, $path, $message ) {
			return array(
				'code' => $code,
				'path' => $path ? $path : '/',
				'message' => $message,
			);
		}
	}
}
