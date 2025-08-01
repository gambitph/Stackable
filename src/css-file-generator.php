<?php
/**
 * CSS File Generator: Base class for generating and caching CSS files.
 *
 * @since 3.19.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Base_CSS_File_Generator' ) ) {

	/**
	 * Base CSS File Generator - Abstract class for generating and caching CSS files.
	 */
	abstract class Stackable_Base_CSS_File_Generator {

		/**
		 * CSS file handle.
		 */
		abstract protected static function get_css_handle();

		/**
		 * CSS file name prefix.
		 */
		abstract protected static function get_css_file_prefix();

		/**
		 * Option name for caching the CSS file name.
		 */
		abstract protected static function get_cache_option_name();

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
			$css_content = static::generate_css_content();
			$content_hash = md5( $css_content );
			return static::get_css_file_prefix() . $content_hash . '.css';
		}

		/**
		 * Generate the CSS content. Must be implemented by child classes.
		 *
		 * @return string
		 */
		abstract protected static function generate_css_content();

		/**
		 * Ensure the CSS directory exists.
		 *
		 * @return bool
		 */
		public static function ensure_css_directory() {
			$css_dir = static::get_css_file_path();
			
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
			$css_content = static::generate_css_content();
			
			if ( empty( $css_content ) ) {
				return false;
			}

			// Ensure directory exists
			if ( ! static::ensure_css_directory() ) {
				return false;
			}

			$file_name = static::get_css_file_name();
			$file_path = static::get_css_file_path() . $file_name;

			// Write the CSS file
			$result = file_put_contents( $file_path, $css_content );
			
			if ( $result !== false ) {
				// Update the cached file name in options
				update_option( static::get_cache_option_name(), $file_name );
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
			return get_option( static::get_cache_option_name() );
		}

		/**
		 * Check if the CSS file exists and is valid.
		 *
		 * @return bool
		 */
		public static function css_file_exists() {
			$file_name = static::get_cached_css_file_name();
			
			if ( ! $file_name ) {
				return false;
			}

			$file_path = static::get_css_file_path() . $file_name;
			return file_exists( $file_path );
		}

		/**
		 * Enqueue the CSS file.
		 *
		 * @return bool
		 */
		public static function enqueue_css_file() {
			// Check if we have a valid CSS file
			if ( ! static::css_file_exists() ) {
				// Generate the CSS file if it doesn't exist
				static::generate_css_file();
			}

			$file_name = static::get_cached_css_file_name();
			
			if ( $file_name ) {
				$file_url = static::get_css_file_url() . $file_name;
				
				wp_enqueue_style(
					static::get_css_handle(),
					$file_url,
					array(),
					STACKABLE_VERSION
				);

				return true;
			}

			// Fallback to inline styles if file generation failed
			return static::enqueue_inline_css();
		}

		/**
		 * Enqueue CSS as inline styles as a fallback when file generation fails.
		 *
		 * @return bool
		 */
		public static function enqueue_inline_css() {
			$css_content = static::generate_css_content();
			
			if ( ! empty( $css_content ) ) {
				// Register a dummy style handle for inline CSS
				wp_register_style( static::get_css_handle() . '-inline', false );
				wp_add_inline_style( static::get_css_handle() . '-inline', $css_content );
				wp_enqueue_style( static::get_css_handle() . '-inline' );
				
				return true;
			}

			return false;
		}

		/**
		 * Get the CSS content as a string (useful for debugging or custom enqueuing).
		 *
		 * @return string
		 */
		public static function get_css_content() {
			return static::generate_css_content();
		}

		/**
		 * Invalidate the current CSS file.
		 */
		public static function invalidate_css_file() {
			// Delete the old CSS file if it exists
			$old_file_name = static::get_cached_css_file_name();
			if ( $old_file_name ) {
				$old_file_path = static::get_css_file_path() . $old_file_name;
				if ( file_exists( $old_file_path ) ) {
					unlink( $old_file_path );
				}
			}
		}

		/**
		 * Clear all cached CSS files for this generator.
		 */
		public static function clear_css_cache() {
			$css_dir = static::get_css_file_path();
			
			if ( file_exists( $css_dir ) ) {
				$files = glob( $css_dir . static::get_css_file_prefix() . '*.css' );
				foreach ( $files as $file ) {
					unlink( $file );
				}
			}

			delete_option( static::get_cache_option_name() );
		}
	}
}

if ( ! class_exists( 'Stackable_Global_Design_System_CSS_Generator' ) ) {

	/**
	 * Global Design System CSS Generator - Extends the base class for global design system.
	 */
	class Stackable_Global_Design_System_CSS_Generator extends Stackable_Base_CSS_File_Generator {

		/**
		 * CSS file handle for the global design system.
		 */
		protected static function get_css_handle() {
			return 'ugb-global-design-system';
		}

		/**
		 * CSS file name prefix.
		 */
		protected static function get_css_file_prefix() {
			return 'stackable-global-';
		}

		/**
		 * Option name for caching the CSS file name.
		 */
		protected static function get_cache_option_name() {
			return 'stackable_global_css_file_name';
		}

		/**
		 * Generate the CSS content from all global design system filters.
		 *
		 * @return string
		 */
		protected static function generate_css_content() {
			// Apply all the filters that contribute to the global design system
			$css_content = apply_filters( 'stackable_inline_styles_nodep', '' );
			
			// Add any additional global styles that might be needed
			$css_content = apply_filters( 'stackable_global_css_file_content', $css_content );
			
			return trim( $css_content );
		}

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
		 * Regenerate the CSS file when global settings change.
		 */
		public function invalidate_current_css_file() {
			static::invalidate_css_file();
		}

		/**
		 * Enqueue the global CSS file (alias for backward compatibility).
		 */
		public static function enqueue_global_css_file() {
			return static::enqueue_css_file();
		}

		/**
		 * Enqueue the global CSS as inline styles (useful for debugging or when file generation is disabled).
		 */
		public static function enqueue_global_css_inline() {
			return static::enqueue_inline_css();
		}
	}

	new Stackable_Global_Design_System_CSS_Generator();
}