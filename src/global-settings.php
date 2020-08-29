<?php
/**
 * Global Settings data handling.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Global_Settings' ) ) {

	/**
	 * Stackable Global Settings
	 */
    class Stackable_Global_Settings {

		/**
		 * Initialize
		 */
        function __construct() {
			// Register our settings.
			add_action( 'init', array( $this, 'register_global_settings' ) );

			/**
			 * Color hooks
			 */

			// TODO: add color hooks here.

			/**
			 * Typography hooks
			 */

			add_action( 'wp_enqueue_scripts', array( $this, 'typography_add_global_styles' ) );

			// For some native blocks, add a note that they're core blocks.
			add_filter( 'render_block', array( $this, 'typography_detect_native_blocks' ), 10, 2 );
		}

		/**
		 * Register the settings we need for global settings.
		 *
		 * @return void
		 */
		public function register_global_settings() {
			register_setting(
				'stackable_global_settings',
				'stackable_global_colors',
				array(
					'type' => 'array',
					'description' => __( 'Stackable global color palette', STACKABLE_I18N ),
					'sanitize_callback' => array( $this, 'sanitize_array_setting' ),
					'show_in_rest' => array(
						'type' => 'array',
						'items' => array(
							'type' => 'object',
							'properties' => array(
								'name' => array(
									'type' => 'string',
								),
								'slug' => array(
									'type' => 'string',
								),
								'colorVar' => array(
									'type' => 'string',
								),
								'color' => array(
									'type' => 'string',
								),
								'fallback' => array(
									'type' => 'string',
								),
							)
						)
					),
					'default' => '',
				)
			);

			register_setting(
				'stackable_global_settings',
				'stackable_global_typography_apply_to',
				array(
					'type' => 'string',
					'description' => __( 'Stackable global typography apply to setting', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);

			register_setting(
				'stackable_global_settings',
				'stackable_global_typography',
				array(
					'type' => 'array',
					'description' => __( 'Stackable global typography settings', STACKABLE_I18N ),
					'sanitize_callback' => array( $this, 'sanitize_array_setting' ),
					'show_in_rest' => array(
						'schema' => array(
							'type'  => 'array',
							'properties' => array(
								'fontFamily' => array(
									'type' => 'string',
								),
								'fontSize' => array(
									'type' => 'number',
								),
								'tabletFontSize' => array(
									'type' => 'number',
								),
								'mobileFontSize' => array(
									'type' => 'number',
								),
								'fontSizeUnit' => array(
									'type' => 'string',
								),
								'tabletFontSizeUnit' => array(
									'type' => 'string',
								),
								'mobileFontSizeUnit' => array(
									'type' => 'string',
								),
								'fontWeight' => array(
									'type' => 'string',
								),
								'textTransform' => array(
									'type' => 'string',
								),
								'lineHeight' => array(
									'type' => 'string',
								),
								'tabletLineHeight' => array(
									'type' => 'string',
								),
								'mobileLineHeight' => array(
									'type' => 'string',
								),
								'lineHeightUnit' => array(
									'type' => 'string',
								),
								'tabletLineHeightUnit' => array(
									'type' => 'string',
								),
								'mobileLineHeightUnit' => array(
									'type' => 'string',
								),
								'letterSpacing' => array(
									'type' => 'string',
								),
							),
						),
					),
					'default' => '',
				)
			);
		}

		public function sanitize_array_setting( $input ) {
			return ! is_array( $input ) ? array( array() ) : $input;
		}

		/**-----------------------------------------------------------------------------
		 * Typography functions
		 *-----------------------------------------------------------------------------*/

		/**
		 * Add our global typography styles in the frontend.
		 *
		 * @return void
		 */
		public function typography_add_global_styles() {
			// Don't do anything if we don't have any global typography.
			$typography = get_option( 'stackable_global_typography' );
			if ( ! $typography && ! is_array( $typography ) ) {
				return;
			}
			$active_typography = $typography[0];
			if ( empty( $active_typography ) ) {
				return;
			}

			// The selector will depend on what blocks are allowed to have the global styles.
			if ( $this->get_apply_typography_to() === 'blocks-stackable-native' ) {
				$selectors = array( '[data-block-type="core"]', '.ugb-main-block' );
			} else if ( $this->get_apply_typography_to() === 'blocks-stackable' ) {
				$selectors = array( '.ugb-main-block' );
			} else if ( $this->get_apply_typography_to() === 'blocks-all' ) {
				$selectors = array( '[data-block-type="core"]', '[class*="wp-block-"]' );
			} else { // Entire site.
				$selectors = array( '.entry-content' );
			}

			$css = array();

			// $tags = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );
			foreach ( $active_typography as $tag => $styles ) {

				$heading_selector = array();

				foreach ( $selectors as $selector ) {
					// Headings inside blocks.
					$heading_selector[] = $selector . ' ' . $tag;

					// Handle native blocks that don't have a wrapper element and just output heading tags right away.
					if ( $selector === '[data-block-type="core"]' || $selector === '[class*="wp-block-"]' ) {
						$heading_selector[] = $tag . $selector;
					}
				}

				$css[] = $this->generate_typography_styles( implode( ', ', $heading_selector ), $styles );
			}

			wp_add_inline_style( 'ugb-style-css', implode( "\n", $css ) );
		}

		/**
		 * Generates typography CSS for the $selector based on the styles given
		 * in the $styles object. This also generates media queries.
		 *
		 * @param string $selector The CSS selector to use.
		 * @param Array $styles An array containing the styles defined by the
		 *                      global typography styles
		 *
		 * @return string A CSS string
		 */
		public function generate_typography_styles( $selector, $styles ) {
			// TODO: generate typography styles.
			return $selector . ' {}';
		}

		/**
		 * Adds a way to detect Native blocks. Used primarily for the typography
		 * global settings so we target and style native blocks. We add a new
		 * attribute data-block-type="core"
		 *
		 * @param string $block_content
		 * @param array $block Attributes
		 *
		 * @return string Rendered block
		 */
		public function typography_detect_native_blocks( $block_content, $block ) {
			// Only do this when we need to style native blocks.
			if ( ! in_array( $this->get_apply_typography_to(), array( 'blocks-stackable-native', 'blocks-all' ) ) ) {
				return $block_content;
			}

			// Only do this for native blocks.
			if ( stripos( $block['blockName'], 'core/' ) === false ) {
				return $block_content;
			}

			// If a native block, let's add a new data- attribute to it so we can target it in css.
			if ( stripos( $block_content, '>' ) !== false ) {
				return $this->str_replace_first( '>', ' data-block-type="core">', $block_content );
			}

			return $block_content;
		}

		public function get_apply_typography_to() {
			$apply_global_typography_to = get_option( 'stackable_global_typography_apply_to' );
			return ! $apply_global_typography_to ? 'blocks-stackable-native' : $apply_global_typography_to;
		}

		/**
		 * Replaced the first occurance of a string.
		 *
		 * @see https://stackoverflow.com/a/2606638
		 *
		 * @param string $search
		 * @param string $replace
		 * @param string $subject
		 * @return void
		 */
		public function str_replace_first( $search, $replace, $subject ) {
			$pos = strpos( $subject, $search );
			if ( $pos !== false ) {
				return substr_replace( $subject, $replace, $pos, strlen( $search ) );
			}
			return $subject;
		}
	}

	new Stackable_Global_Settings();
}
