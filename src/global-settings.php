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
			add_action( 'wp_enqueue_scripts', array( $this, 'color_add_global_styles' ) );

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
		 * Color functions
		 *-----------------------------------------------------------------------------*/

		 /**
		  * Add our global color styles in the frontend.
		  * 
		  * @return void
		  */
		  public function color_add_global_styles() {
			  // Don't do anything if we doon't have any global color.
			  $colors = get_option( 'stackable_global_colors' );
			  if ( ! $colors || ! is_array( $colors ) ) {
				  return;
			  }

			  $css = array();
			  $core_css = array();

			  foreach( $colors as $color  ) {
				  $color_name = strtolower( $color['slug'] );

				  // Convert the name to kebab casing,
				  $color_typography_name = '.has-' . implode( '-', explode( ' ', $color_name ) ) . '-color';
				  $color_background_name = '.has-' . implode( '-', explode( ' ', $color_name ) ) . '-background-color';

				  // Only do this for our global colors.
				  if ( $color['fallback'] && $color['colorVar']){
				  	// Add the custom css property.
					array_push( $css, $color['colorVar'] . ': ' . $color['fallback'] . ';' );

					  
					// Add custom css class rule for other blocks.
					// For typography colors.
					 array_push( $core_css, $color_typography_name . ' { color: ' . $color['fallback'] . ' !important; }');

					 // For background colors.
					 array_push( $core_css, $color_background_name . ' { background-color: ' . $color['fallback'] . ' !important; }');
				  }
			  }
			  
			  $generated_color_css = ':root {
				  ' . implode( ' ', $css ) . '
			  }';

			  wp_add_inline_style( 'ugb-style-css', $generated_color_css );
			  wp_add_inline_style( 'ugb-style-css', implode( ' ', $core_css ) );
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
			if ( ! $typography || ! is_array( $typography ) ) {
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
			} else if ( $this->get_apply_typography_to() === 'content' ) {
				$selectors = array( '.entry-content' );
			} else { // Entire site.
				$selectors = array( 'body' );
			}

			$css = array();
			$google_fonts = array();

			// $tags = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );
			foreach ( $active_typography as $tag => $styles ) {

				$heading_selector = array();

				foreach ( $selectors as $selector ) {
					// Headings which are children of the selector.
					$heading_selector[] = $selector . ' ' . $tag;

					// Only proceed if we're targeting blocks.
					if ( $this->get_apply_typography_to() === 'content' || $this->get_apply_typography_to() === 'site' ) {
						continue;
					}

					// Stackable blocks for sure only have headings as children.
					if ( $selector === '.ugb-main-block' ) {
						continue;
					}

					// Handle native blocks that don't have a wrapper element and just output heading tags right away.
					if ( $selector === '[data-block-type="core"]' || $selector === '[class*="wp-block-"]' ) {
						$heading_selector[] = $tag . $selector;
					}
				}

				$css[] = $this->generate_typography_styles( implode( ', ', $heading_selector ), $styles );

				// Gather the Google Fonts.
				if ( array_key_exists( 'fontFamily', $styles ) ) {
					if ( Stackable_Google_Fonts::is_web_font( $styles['fontFamily'] ) ) {
						if ( ! in_array( $styles['fontFamily'], $google_fonts ) ) {
							$google_fonts[] = $styles['fontFamily'];
						}
					}
				}
			}

			// Load the Google Font.
			Stackable_Google_Fonts::enqueue_google_fonts( $google_fonts, 'stackable-global-typography-google-fonts' );

			wp_add_inline_style( 'ugb-style-css', implode( "\n", $css ) );
		}

		/**
		 * Generates typography CSS for the $selector based on the styles given
		 * in the $styles object. This also generates media queries.
		 *
		 * Mimic how createTypographyStyles does it
		 * @see src/util/typography/styles.js createTypographyStyles function
		 *
		 * @param string $selector The CSS selector to use.
		 * @param Array $styles An array containing the styles defined by the
		 *                      global typography styles
		 *
		 * @return string A CSS string
		 */
		public function generate_typography_styles( $selector, $styles ) {
			$inherit = true;
			$inherit_max = 50;
			$tablet_breakpoint = 1025;
			$mobile_breakpoint = 768;

			// Create desktop styles.
			$css = array(
				'desktop' => array(),
				'tablet' => array(),
				'mobile' => array(),
			);

			/**
			 * Desktop styles.
			 */
			if ( array_key_exists( 'fontFamily', $styles ) ) {
				$css['desktop'][] = 'font-family: ' . $this->get_font_family( $styles['fontFamily'] ) . ';';
			}
			if ( array_key_exists( 'fontSize', $styles ) ) {
				$css['desktop'][] = 'font-size: ' . $styles['fontSize'] . ( $styles['fontSizeUnit'] ?: 'px' ) . ';';
			}
			if ( array_key_exists( 'fontWeight', $styles ) ) {
				$css['desktop'][] = 'font-weight: ' . $styles['fontWeight'] . ';';
			}
			if ( array_key_exists( 'textTransform', $styles ) ) {
				$css['desktop'][] = 'text-transform: ' . $styles['textTransform'] . ';';
			}
			if ( array_key_exists( 'lineHeight', $styles ) ) {
				$css['desktop'][] = 'line-height: ' . $styles['lineHeight'] . ( $styles['lineHeightUnit'] ?: 'em' ) . ';';
			}

			/**
			 * Tablet styles.
			 */
			if ( array_key_exists( 'tabletLineHeight', $styles ) ) {
				$css['tablet'][] = 'line-height: ' . $styles['tabletLineHeight'] . ( $styles['tabletLineHeightUnit'] ?: 'em' ) . ';';
			}
			$font_size = '';
			if ( $inherit ) {
				if ( array_key_exists( 'fontSize', $styles ) ) {
					$clamp_desktop_value = $this->clamp_inherited_style( $styles['fontSize'], $inherit_max );
					if ( $clamp_desktop_value ) {
						$font_size = 'font-size: ' . $clamp_desktop_value . ( $styles['fontSizeUnit'] ?: 'px' ) . ';';
					}
				}
			}
			if ( array_key_exists( 'tabletFontSize', $styles ) ) {
				$font_size = 'font-size: ' . $styles['tabletFontSize'] . ( $styles['tabletFontSizeUnit'] ?: 'px' ) . ';';
			}
			if ( $font_size ) {
				$css['tablet'][] = $font_size;
			}

			/**
			 * Mobile styles.
			 */
			if ( array_key_exists( 'mobileLineHeight', $styles ) ) {
				$css['mobile'][] = 'line-height: ' . $styles['mobileLineHeight'] . ( $styles['mobileLineHeightUnit'] ?: 'em' ) . ';';
			}

			$font_size = '';
			if ( $inherit ) {
				$clamp_desktop_value = null;
				$has_clamped_font_size = false;
				if ( array_key_exists( 'fontSize', $styles ) ) {
					$clamp_desktop_value = $this->clamp_inherited_style( $styles['fontSize'], $inherit_max );
					if ( $clamp_desktop_value ) {
						$font_size = 'font-size: ' . $clamp_desktop_value . ( $styles['fontSizeUnit'] ?: 'px' ) . ';';
					}
				}

				$clamp_tablet_value = null;
				if ( array_key_exists( 'tabletFontSize', $styles ) ) {
					$clamp_tablet_value = $this->clamp_inherited_style( $style['tabletFontSize'], $inherit_max );
					if ( $clamp_tablet_value ) {
						$font_size = 'font-size: ' . $clamp_tablet_value . ( $styles['tabletFontSizeUnit'] ?: 'px' ) . ';';
					}
				}
				if ( ! $clamp_tablet_value ) {
					if ( $clamp_desktop_value || array_key_exists( 'tabletFontSize', $styles ) ) {
						// If we have a desktop value clamped, and there's a tablet value, don't do anything.
						if ( $has_clamped_font_size ) {
							$font_size = '';
						}
					}
				}
			}
			if ( array_key_exists( 'mobileFontSize', $styles ) ) {
				$font_size = 'font-size: ' . $styles['mobileFontSize'] . ( $styles['mobileFontSizeUnit'] ?: 'px' ) . ';';
			}
			if ( $font_size ) {
				$css['mobile'][] = $font_size;
			}

			// Convert to actual CSS.
			$generated_css = '';
			if ( ! empty( $css['desktop'] ) ) {
				$generated_css .= $selector . ' { ' . implode( '', $css['desktop'] ) . ' }';
			}
			if ( ! empty( $css['tablet'] ) ) {
				$generated_css .= '@media screen and (max-width: ' . $tablet_breakpoint . 'px) {';
				$generated_css .= $selector . ' { ' . implode( '', $css['tablet'] ) . ' }';
				$generated_css .= '}';
			}
			if ( ! empty( $css['mobile'] ) ) {
				$generated_css .= '@media screen and (max-width: ' . $mobile_breakpoint . 'px) {';
				$generated_css .= $selector . ' { ' . implode( '', $css['mobile'] ) . ' }';
				$generated_css .= '}';
			}

			return $generated_css;
		}

		/**
		 * @see src/util/font.js getFontFamily function
		 */
		public function get_font_family( $font_name ) {
			$lower_font_name = strtolower( $font_name );
			// System fonts.
			if ( $lower_font_name === 'serif' ) {
				return '"Palatino Linotype", Palatino, Palladio, "URW Palladio L", "Book Antiqua", Baskerville, "Bookman Old Style", "Bitstream Charter", "Nimbus Roman No9 L", Garamond, "Apple Garamond", "ITC Garamond Narrow", "New Century Schoolbook", "Century Schoolbook", "Century Schoolbook L", Georgia, serif';
			} else if ( $lower_font_name === 'serif-alt' ) {
				return 'Constantia, Lucida Bright, Lucidabright, "Lucida Serif", Lucida, "DejaVu Serif", "Bitstream Vera Serif", "Liberation Serif", Georgia, serif';
			} else if ( $lower_font_name === 'monospace' ) {
				return 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
			} else if ( $lower_font_name === 'sans-serif' ) {
				return '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
			}

			// Google font.
			return '"' . $font_name . '", sans-serif';
		}

		/**
		 * Clamps the desktop value based on given min and max
		 *
		 * @see src/util/styles/index.js clampInheritedStyle
		 *
		 * @param {*} value
		 * @param {Object} options
		 */
		public function clamp_inherited_style( $value, $max = 999999, $min = -999999 ) {
			if ( isset( $value ) ) {
				$clamped_value = max( $min, min( $max, $value ) );
				return $clamped_value !== $value ? $clamped_value : null;
			}

			return null;
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
