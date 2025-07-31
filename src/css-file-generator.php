<?php
/**
 * CSS File Generator: Generates and caches CSS files for Stackable's global design system.
 *
 * @since 3.19.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_CSS_File_Generator' ) ) {

	/**
	 * Stackable CSS File Generator.
	 */
	class Stackable_CSS_File_Generator {

		/**
		 * CSS file handle for the global design system.
		 */
		const CSS_HANDLE = 'ugb-global-design-system';

		/**
		 * CSS file name prefix.
		 */
		const CSS_FILE_PREFIX = 'stackable-global-';

		/**
		 * Initialize
		 */
		function __construct() {
			// Add hooks to regenerate CSS when global settings change
			add_action( 'update_option_stackable_global_colors', array( $this, 'invalidate_current_css_file' ) );
			add_action( 'update_option_stackable_global_typography', array( $this, 'invalidate_current_css_file' ) );
			add_action( 'update_option_stackable_global_spacing_and_borders', array( $this, 'invalidate_current_css_file' ) );
			add_action( 'update_option_stackable_global_color_schemes', array( $this, 'invalidate_current_css_file' ) );
			add_action( 'update_option_stackable_global_block_styles', array( $this, 'invalidate_current_css_file' ) );
			add_action( 'update_option_stackable_global_buttons_and_icons', array( $this, 'invalidate_current_css_file' ) );
			add_action( 'update_option_stackable_global_preset_controls', array( $this, 'invalidate_current_css_file' ) );
		}

		/**
		 * Get the CSS file path in the uploads directory.
		 *
		 * @return string
		 */
		public static function get_css_file_path() {
			$upload_dir = wp_upload_dir();
			return $upload_dir['basedir'] . '/stackable/css/';
		}

		/**
		 * Get the CSS file URL.
		 *
		 * @return string
		 */
		public static function get_css_file_url() {
			$upload_dir = wp_upload_dir();
			return $upload_dir['baseurl'] . '/stackable/css/';
		}

		/**
		 * Get the CSS file name based on content hash.
		 *
		 * @return string
		 */
		public static function get_css_file_name() {
			$css_content = self::generate_css_content();
			$content_hash = md5( $css_content );
			return self::CSS_FILE_PREFIX . $content_hash . '.css';
		}

		/**
		 * Generate the CSS content from all global design system filters.
		 *
		 * @return string
		 */
		public static function generate_css_content() {
			// Apply all the filters that contribute to the global design system
			$css_content = apply_filters( 'stackable_inline_styles_nodep', '' );
			
			// Add any additional global styles that might be needed
			$css_content = apply_filters( 'stackable_global_css_file_content', $css_content );
			
			return trim( $css_content );
		}

		/**
		 * Ensure the CSS directory exists.
		 *
		 * @return bool
		 */
		public static function ensure_css_directory() {
			$css_dir = self::get_css_file_path();
			
			if ( ! file_exists( $css_dir ) ) {
				return wp_mkdir_p( $css_dir );
			}
			
			return true;
		}

		/**
		 * Generate and save the CSS file.
		 *
		 * @return bool
		 */
		public static function generate_css_file() {
			$css_content = self::generate_css_content();
			
			if ( empty( $css_content ) ) {
				return false;
			}

			// Ensure directory exists
			if ( ! self::ensure_css_directory() ) {
				return false;
			}

			$file_name = self::get_css_file_name();
			$file_path = self::get_css_file_path() . $file_name;

			// Write the CSS file
			$result = file_put_contents( $file_path, $css_content );
			
			if ( $result !== false ) {
				// Update the cached file name in options
				update_option( 'stackable_global_css_file_name', $file_name );
				return true;
			}

			return false;
		}

		/**
		 * Get the current CSS file name from cache.
		 *
		 * @return string|false
		 */
		public static function get_cached_css_file_name() {
			return get_option( 'stackable_global_css_file_name' );
		}

		/**
		 * Check if the CSS file exists and is valid.
		 *
		 * @return bool
		 */
		public static function css_file_exists() {
			$file_name = self::get_cached_css_file_name();
			
			if ( ! $file_name ) {
				return false;
			}

			$file_path = self::get_css_file_path() . $file_name;
			return file_exists( $file_path );
		}

		/**
		 * Enqueue the global CSS file.
		 */
		public static function enqueue_global_css_file() {
			// Check if we have a valid CSS file
			if ( ! self::css_file_exists() ) {
				// Generate the CSS file if it doesn't exist
				self::generate_css_file();
			}

			$file_name = self::get_cached_css_file_name();
			
			if ( $file_name ) {
				$file_url = self::get_css_file_url() . $file_name;
				
				wp_enqueue_style(
					self::CSS_HANDLE,
					$file_url,
					array(),
					STACKABLE_VERSION
				);
			}
		}

		/**
		 * Regenerate the CSS file when global settings change.
		 */
		public function invalidate_current_css_file() {
			// Delete the old CSS file if it exists
			$old_file_name = $this->get_cached_css_file_name();
			if ( $old_file_name ) {
				$old_file_path = $this->get_css_file_path() . $old_file_name;
				if ( file_exists( $old_file_path ) ) {
					unlink( $old_file_path );
				}
			}
		}
	}

    new Stackable_CSS_File_Generator();
}