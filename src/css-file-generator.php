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
			
			// Add a timestamp as cache buster to ensure unique file names
			$timestamp = time();
			
			return static::get_css_file_prefix() . $content_hash . '-' . $timestamp . '.css';
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
			
			// Clear the cached file name - next generation will have a new timestamp
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

if ( ! class_exists( 'Stackable_Block_Style_Inheritance_CSS_Generator' ) ) {

	/**
	 * Block Style Inheritance CSS Generator - Extends the base class for block theme style inheritance.
	 */
	class Stackable_Block_Style_Inheritance_CSS_Generator extends Stackable_Base_CSS_File_Generator {

		/**
		 * CSS file handle for block style inheritance.
		 */
		protected static function get_css_handle() {
			return 'ugb-block-style-inheritance';
		}

		/**
		 * CSS file name prefix.
		 */
		protected static function get_css_file_prefix() {
			return 'stackable-block-inheritance-';
		}

		/**
		 * Option name for caching the CSS file name.
		 */
		protected static function get_cache_option_name() {
			return 'stackable_block_inheritance_css_file_name';
		}

		/**
		 * Generate the CSS content from block style inheritance filters.
		 *
		 * @return string
		 */
		protected static function generate_css_content() {
			// Apply the filter that contributes to block style inheritance
			$css_content = apply_filters( 'stackable_block_style_inheritance_inline_styles_nodep', '' );
			
			// Add any additional block inheritance styles that might be needed
			$css_content = apply_filters( 'stackable_block_inheritance_css_file_content', $css_content );
			
			return trim( $css_content );
		}

		/**
		 * Initialize
		 */
		function __construct() {
			// Add hooks to regenerate CSS when theme.json or block settings change
			add_action( 'switch_theme', array( $this, 'invalidate_current_css_file' ) );
			add_action( 'update_option_theme_mods_' . get_stylesheet(), array( $this, 'invalidate_current_css_file' ) );
			add_action( 'customize_save_after', array( $this, 'invalidate_current_css_file' ) );
		}

		/**
		 * Regenerate the CSS file when block style inheritance settings change.
		 */
		public function invalidate_current_css_file() {
			static::invalidate_css_file();
		}

		/**
		 * Enqueue the block inheritance CSS file (alias for backward compatibility).
		 */
		public static function enqueue_block_inheritance_css_file() {
			return static::enqueue_css_file();
		}

		/**
		 * Enqueue the block inheritance CSS as inline styles (useful for debugging or when file generation is disabled).
		 */
		public static function enqueue_block_inheritance_css_inline() {
			return static::enqueue_inline_css();
		}
	}

	new Stackable_Block_Style_Inheritance_CSS_Generator();
}

if ( ! class_exists( 'Stackable_CSS_File_Generator' ) ) {

	/**
	 * REST API endpoints for CSS file generator operations.
	 */
	class Stackable_CSS_File_Generator {

		/**
		 * Initialize the REST API endpoints.
		 */
		public function __construct() {
			add_action( 'rest_api_init', array( $this, 'register_routes' ) );

            // Register the setting stackable_use_css_files
            add_action( 'admin_init', array( $this, 'register_use_css_files_setting' ) );
            add_action( 'rest_api_init', array( $this, 'register_use_css_files_setting' ) );

            add_action( 'stackable_early_version_upgraded', array( $this, 'register_use_css_files_setting_upgraded' ), 10, 2 );
		}

        /**
         * Register the setting stackable_use_css_files
         */
        public function register_use_css_files_setting() {
            register_setting(
				'stackable_editor_settings',
                'stackable_use_css_files',
				array(
					'type' => 'boolean',
					'description' => __( 'Enables CSS file generation for the global design system and block style inheritance', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => true,
				)
            );
        }

        /**
         * When upgrading from a lower version, disable use CSS files.
         */
        public function register_use_css_files_setting_upgraded( $old_version, $new_version ) {
            if ( ! empty( $old_version ) && version_compare( $old_version, "3.19.0", "<" ) ) {
                update_option( 'stackable_use_css_files', '', 'no' );
            }
        }

		/**
		 * Register REST API routes.
		 */
		public function register_routes() {
			register_rest_route( 'stackable/v3', '/invalidate-css-files', array(
				'methods' => 'POST',
				'callback' => array( __CLASS__, 'invalidate_all_css_files' ),
				'permission_callback' => array( $this, 'check_permissions' ),
			) );
		}

		/**
		 * Check if user has permission to invalidate CSS files.
		 *
		 * @return bool
		 */
		public function check_permissions() {
			return current_user_can( 'manage_options' );
		}

		/**
		 * Invalidate all generated CSS files.
		 *
		 * @param WP_REST_Request $request The request object.
		 * @return WP_REST_Response|WP_Error
		 */
		public static function invalidate_all_css_files( $request ) {
			try {
				// Clear all CSS caches
				Stackable_Global_Design_System_CSS_Generator::invalidate_css_file();
				Stackable_Block_Style_Inheritance_CSS_Generator::invalidate_css_file();

				return new WP_REST_Response( array(
					'success' => true,
					'message' => 'CSS files invalidated successfully',
				), 200 );

			} catch ( Exception $e ) {
				return new WP_Error(
					'css_invalidation_failed',
					'Failed to invalidate CSS files: ' . $e->getMessage(),
					array( 'status' => 500 )
				);
			}
		}
	}

	new Stackable_CSS_File_Generator();

    // Run on activation to ensure the CSS files are newly generated.
    register_activation_hook( STACKABLE_FILE, array( 'Stackable_CSS_File_Generator', 'invalidate_all_css_files' ) );
}