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
		 * Normalize a WordPress identifier to the package slug grammar.
		 *
		 * @param mixed  $value Source identifier.
		 * @param string $fallback Stable fallback when the source has no ASCII slug.
		 * @return string
		 */
		public static function slug( $value, $fallback ) {
			$slug = strtolower( (string) sanitize_title( (string) $value ) );
			$slug = preg_replace( '/[^a-z0-9]+/', '-', $slug );
			$slug = trim( $slug, '-' );
			if ( '' === $slug ) {
				$slug = strtolower( (string) $fallback );
				$slug = trim( preg_replace( '/[^a-z0-9]+/', '-', $slug ), '-' );
			}
			return $slug ? $slug : 'item';
		}

		/**
		 * Replace synced-pattern post IDs in block markup with package slugs.
		 *
		 * @param string $content Serialized block markup.
		 * @param array  $warnings Collected warnings.
		 * @param string $path Package path for warnings.
		 * @return string
		 */
		public static function localize_pattern_references( $content, &$warnings, $path ) {
			if ( ! function_exists( 'parse_blocks' ) || ! function_exists( 'serialize_blocks' ) ) {
				return $content;
			}
			$blocks = parse_blocks( $content );
			$references = array();
			self::collect_block_references( $blocks, $references );
			if ( ! $references ) {
				return $content;
			}
			$posts = get_posts(
				array(
					'post_type' => 'wp_block',
					'post__in' => array_values( array_unique( $references ) ),
					'posts_per_page' => -1,
					'post_status' => array( 'publish', 'draft', 'private', 'pending', 'future' ),
					'no_found_rows' => true,
				)
			);
			$slugs = array();
			foreach ( $posts as $post ) {
				$slugs[ (int) $post->ID ] = self::slug( $post->post_name ? $post->post_name : $post->post_title, 'pattern-' . $post->ID );
			}
			self::rewrite_block_references( $blocks, $slugs );
			foreach ( array_diff( array_unique( $references ), array_keys( $slugs ) ) as $missing_id ) {
				$warnings[] = self::warning( 'missing_pattern', $path, 'A referenced synced pattern could not be made portable: ' . $missing_id );
			}
			return serialize_blocks( $blocks );
		}

		private static function collect_block_references( $blocks, &$references ) {
			foreach ( $blocks as $block ) {
				if ( isset( $block['blockName'] ) && 'core/block' === $block['blockName'] && ! empty( $block['attrs']['ref'] ) ) {
					$references[] = (int) $block['attrs']['ref'];
				}
				if ( ! empty( $block['innerBlocks'] ) ) {
					self::collect_block_references( $block['innerBlocks'], $references );
				}
			}
		}

		private static function rewrite_block_references( &$blocks, $slugs ) {
			foreach ( $blocks as &$block ) {
				if ( isset( $block['blockName'] ) && 'core/block' === $block['blockName'] && ! empty( $block['attrs']['ref'] ) && isset( $slugs[ $block['attrs']['ref'] ] ) ) {
					$block['attrs']['stkSiteKitPattern'] = $slugs[ $block['attrs']['ref'] ];
					unset( $block['attrs']['ref'] );
				}
				if ( ! empty( $block['innerBlocks'] ) ) {
					self::rewrite_block_references( $block['innerBlocks'], $slugs );
				}
			}
			unset( $block );
		}

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
