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
		 * Becomes true if there are global typography styles generated
		 *
		 * @var boolean
		 */
		public $generated_typography_css = false;

		/**
		 * Becomes true if there are global typography heading styles generated
		 *
		 * @var boolean
		 */
		public $generated_heading_typography_css = false;

		/**
		 * Becomes true if there are global typography body text styles generated
		 *
		 * @var boolean
		 */
		public $generated_body_typography_css = false;

		/**
		 * Initialize
		 */
  	function __construct() {
			// Register our settings.
			add_action( 'admin_init', array( $this, 'register_global_settings' ) );
			add_action( 'rest_api_init', array( $this, 'register_global_settings' ) );

			if ( ! is_admin() ) {

				/**
				 * Color hooks
				 */
				// Add the color styles in the frontend only.
				add_filter( 'stackable_inline_styles_nodep', array( $this, 'color_add_global_styles' ) );

				/**
				 * Typography hooks
				 */

				/**
				 * Use `after_setup_theme` to check early if there are global
				 * typography used the `typograhy_detect_native_blocks`  method.
				 *
				 * @since 2.17.1
				 */
				// Don't do anything if we don't have any global typography.
				$typography = get_option( 'stackable_global_typography' );
				if ( ! empty( $typography ) && is_array( $typography ) ) {
					add_action( 'after_setup_theme', array( $this, 'typography_parse_global_styles' ) );
				}

				// For some native blocks, add a note that they're core blocks.
				// Only do this when we need to style native blocks.
				if ( in_array( $this->get_apply_typography_to(), array( 'blocks-stackable-native', 'blocks-all' ) ) ) {
					add_filter( 'render_block', array( $this, 'typography_detect_native_blocks' ), 10, 2 );
				}

				// Fixes columns issue with Native Posts block.
				add_filter( 'stackable_global_typography_selectors', array( $this, 'posts_block_columns_fix' ), 10, 2 );

				// Add our global typography styles in the frontend only.
				add_filter( 'stackable_inline_styles_nodep', array( $this, 'typography_add_global_styles' ) );
			}
		}

		/**
		 * Register the settings we need for global settings.
		 *
		 * @return void
		 */
		public function register_global_settings() {
			$this->fix_deprecated_options();

			register_setting(
				'stackable_global_settings',
				'stackable_global_colors',
				array(
					'type' => 'array',
					'description' => __( 'Stackable global color palette', STACKABLE_I18N ),
					'sanitize_callback' => array( $this, 'sanitize_array_setting' ),
					'show_in_rest' => array(
						'schema' => array(
							'items' => array(
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
										'color' => array(
											'type' => 'string',
										),
										'rgb' => array(
											'type' => 'string',
										),
									)
								)
							)
						)
					),
					'default' => '',
				)
			);

			register_setting(
				'stackable_global_settings',
				'stackable_global_hide_theme_colors',
				array(
					'type' => 'boolean',
					'description' => __( 'Hide theme colors in the Stackable color picker', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);

			register_setting(
				'stackable_global_settings',
				'stackable_global_hide_default_colors',
				array(
					'type' => 'boolean',
					'description' => __( 'Hide default colors in the Stackable color picker', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);

			register_setting(
				'stackable_global_settings',
				'stackable_global_hide_site_editor_colors',
				array(
					'type' => 'boolean',
					'description' => __( 'Hide Site Editor colors in the Stackable color picker', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
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
				'stackable_global_force_typography',
				array(
					'type' => 'boolean',
					'description' => __( 'Stackable global typography add important to global styles', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);

			$stackable_global_typography_schema = array(
				'type' => 'object',
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
						'type' => 'number',
					),
					'tabletLineHeight' => array(
						'type' => 'number',
					),
					'mobileLineHeight' => array(
						'type' => 'number',
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
						'type' => 'number',
					),
					'tabletLetterSpacing' => array(
						'type' => 'number',
					),
					'mobileLetterSpacing' => array(
						'type' => 'number',
					),
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
							'items' => array(
								'type' => 'object',
								'properties' => array(
									'h1' => $stackable_global_typography_schema,
									'h2' => $stackable_global_typography_schema,
									'h2' => $stackable_global_typography_schema,
									'h3' => $stackable_global_typography_schema,
									'h4' => $stackable_global_typography_schema,
									'h5' => $stackable_global_typography_schema,
									'h6' => $stackable_global_typography_schema,
									'p' => $stackable_global_typography_schema,
									'.stk-subtitle' => $stackable_global_typography_schema,
								)
							)
						)
					),
					'default' => '',
				)
			);
		}

		/**
		 * Updates the old "use Stackable colors only" option to the new individual hide options.
		 *
		 * @return void
		 *
		 * @since 3.11.0
		 */
		public function fix_deprecated_options() {
			if ( ! empty( get_option( 'stackable_global_colors_palette_only' ) ) ) {
				update_option( 'stackable_global_hide_theme_colors', '1' );
				update_option( 'stackable_global_hide_default_colors', '1' );
				update_option( 'stackable_global_hide_site_editor_colors', '1' );
				delete_option( 'stackable_global_colors_palette_only' );
			}
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
		 * @param String $current_css
		 * @return String
		 */
		public function color_add_global_styles( $current_css ) {
			// Don't do anything if we doon't have any global color.
			$colors = get_option( 'stackable_global_colors' );
			if ( ! $colors || ! is_array( $colors ) ) {
				return $current_css;
			}

			$css = array();

			foreach ( $colors as $color_palette ) {
				if ( ! is_array( $color_palette ) ) {
					continue;
				}

				foreach ( $color_palette as $color ) {
					if ( ! is_array( $color ) ) {
						continue;
					}
					if ( ! array_key_exists( 'slug', $color ) || ! array_key_exists( 'color', $color ) || ! array_key_exists( 'rgb', $color ) ) {
						continue;
					}

					// Only do this for our global colors.
					if ( $color['color'] && $color['slug'] ) {
						// Add the custom css property.
						$css[] = '--' . $color['slug'] . ': ' . $color['color'] . ';';
						$css[] = '--' . $color['slug'] . '-rgba: ' . $color['rgb'] . ';';
					}
				}
			}

			if ( count( $css ) ) {
				$generated_color_css = "/* Global colors */\n";
				$generated_color_css .= ':root {' . implode( ' ', $css ) . '}';
				$current_css .= $generated_color_css;
			}

			return apply_filters( 'stackable_global_colors_frontend_css', $current_css, $colors );
		}

		/**-----------------------------------------------------------------------------
		 * Typography functions
		 *-----------------------------------------------------------------------------*/

		/**
		 * Add our global typography styles in the frontend.
		 *
		 * @return void
		 */
		public function typography_parse_global_styles() {
			$typography = get_option( 'stackable_global_typography' );
			if ( ! $typography || ! is_array( $typography ) ) {
				return;
			}

			// We can have multiple entries in the future, use the first one.
			$active_typography = $typography[0];
			if ( empty( $active_typography ) || ! is_array( $active_typography ) ) {
				return;
			}

			$css = array();

			// $tags = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );
			foreach ( $active_typography as $tag => $styles ) {

				if ( ! is_array( $styles ) ) {
					continue;
				}

				$selectors = $this->form_selectors( $tag );
				$css[] = $this->generate_typography_styles( implode( ', ', $selectors ), $styles );

				// Gather the Google Fonts.
				if ( array_key_exists( 'fontFamily', $styles ) ) {
					Stackable_Google_Fonts::register_font( $styles['fontFamily'] );
				}

				// Note whether we have global typography.
				if ( in_array( $tag, array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ) ) ) {
					$this->generated_heading_typography_css = true;
				} else if ( $tag === 'p' || stripos( $tag, '.' ) === 0 ) {
					// When the $tag passed is a class selector, set the generated_body_typography_css also to true so
					// that we can also generate `data-block-type` attributes to core blocks.
					$this->generated_body_typography_css = true;
				}
			}

			if ( count( $css ) ) {
				$inline_css = "/* Global typography */\n";
				$inline_css .= implode( "\n", $css );
				$this->generated_typography_css = apply_filters( 'stackable_frontend_css', $inline_css );
			}
		}

		/**
		* Add the inline global typography styles in the frontend
		*
		* @return void
		*
		* @since 2.17.2
		*/
		public function typography_add_global_styles( $css ) {
			return $css . $this->generated_typography_css;
		}

		public function form_selectors( $selector ) {
			if ( in_array( $selector, array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ) ) ) {
				return $this->form_tag_selector( $selector );
			} else if ( $selector === 'p' ) {
				return $this->form_paragraph_selector();
			} else if ( stripos( $selector, '.' ) === 0 ) {
				return $this->form_class_selector( $selector );
			}
		}

		public function form_class_selector( $selector ) {
			// Content area of the theme.
			$selectors = array( $selector );
			// Include Stackable blocks.
			$selectors[] = '.stk-block ' . $selector;
			$selectors[] = '.stk-block' . $selector;

			// Include native blocks.
			$selectors[] = '[data-block-type="core"] ' . $selector;
			$selectors[] = '[data-block-type="core"]' . $selector;
			$selectors[] = $selector . '[data-block-type="core"]';
			$selectors[] = $selector . '[data-block-type="core"] ';

			// Include all other blocks.
			$selectors[] = '[class*="wp-block-"] ' . $selector;
			$selectors[] = '[class*="wp-block-"]' . $selector;
			$selectors[] = $selector . '[class*="wp-block-"]';
			$selectors[] = $selector . '[class*="wp-block-"] ';

			return apply_filters( 'stackable_global_typography_selectors', $selectors, $selector );
		}

		public function form_tag_selector( $tag ) {
			// Content area of the theme.
			$selectors = array();

			// Include Stackable blocks.
			$selectors[] = '.stk-block ' . $tag;

			// Include native blocks.
			if ( $this->get_apply_typography_to() !== 'blocks-stackable' ) {
				$selectors[] = '[data-block-type="core"] ' . $tag;
				$selectors[] = $tag . '[data-block-type="core"]';
			}

			// Include all other blocks.
			if ( $this->get_apply_typography_to() === 'blocks-all' ) {
				$selectors[] = '[class*="wp-block-"] ' . $tag;
				$selectors[] = $tag . '[class*="wp-block-"]';
			}

			return apply_filters( 'stackable_global_typography_selectors', $selectors, $tag );
		}

		public function form_paragraph_selector() {
			return array_merge(
				$this->form_tag_selector( 'p' ), // Core text.
				$this->form_tag_selector( 'li' ), // Core lists.
				$this->form_tag_selector( 'td' ) // Core table cells.
			);
		}

		/**
		 * Creates a CSS style rule with an added !important if necessary.
		 *
		 * @param strying $style e.g. font-size
		 * @param string $value e.g. 10px
		 *
		 * @return string
		 */
		public function create_style( $style, $value ) {
			$imp = get_option( 'stackable_global_force_typography' ) ? ' !important' : '';

			return sprintf( '%s: %s%s;',
				$style,
				$value,
				$imp
			);
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

			// Default units.
			$default_units = array(
				'fontSizeUnit' => 'px',
				'tabletFontSizeUnit' => 'px',
				'mobileFontSizeUnit' => 'px',
				'lineHeightUnit' => 'em',
				'tabletLineHeightUnit' => 'em',
				'mobileLineHeightUnit' => 'em',
			);
			$styles = array_merge( $default_units, $styles );

			/**
			 * Desktop styles.
			 */
			if ( array_key_exists( 'fontFamily', $styles ) ) {
				$css['desktop'][] = $this->create_style( 'font-family', $this->get_font_family( $styles['fontFamily'] ) );
			}
			if ( array_key_exists( 'fontSize', $styles ) ) {
				$css['desktop'][] = $this->create_style( 'font-size', $styles['fontSize'] . $styles['fontSizeUnit'] );
			}
			if ( array_key_exists( 'fontWeight', $styles ) ) {
				$css['desktop'][] = $this->create_style( 'font-weight', $styles['fontWeight'] );
			}
			if ( array_key_exists( 'textTransform', $styles ) ) {
				$css['desktop'][] = $this->create_style( 'text-transform', $styles['textTransform'] );
			}
			if ( array_key_exists( 'lineHeight', $styles ) ) {
				$css['desktop'][] = $this->create_style( 'line-height', $styles['lineHeight'] . $styles['lineHeightUnit'] );
			}
			if ( array_key_exists( 'letterSpacing', $styles ) ) {
				$css['desktop'][] = $this->create_style( 'letter-spacing', $styles['letterSpacing'] . 'px' );
			}

			/**
			 * Tablet styles.
			 */
			if ( array_key_exists( 'tabletLineHeight', $styles ) ) {
				$css['tablet'][] = $this->create_style( 'line-height', $styles['tabletLineHeight'] . $styles['tabletLineHeightUnit'] );
			}
			if ( array_key_exists( 'tabletLetterSpacing', $styles ) ) {
				$css['tablet'][] = $this->create_style( 'letter-spacing', $styles['tabletLetterSpacing'] . 'px' );
			}
			$font_size = '';
			if ( $inherit ) {
				if ( array_key_exists( 'fontSize', $styles ) ) {
					$clamp_desktop_value = $this->clamp_inherited_style( $styles['fontSize'], $inherit_max );
					if ( ! empty( $clamp_desktop_value ) ) {
						$font_size = $this->create_style( 'font-size', $clamp_desktop_value . $styles['fontSizeUnit'] );
					}
				}
			}
			if ( array_key_exists( 'tabletFontSize', $styles ) ) {
				$font_size = $this->create_style( 'font-size', $styles['tabletFontSize'] . $styles['tabletFontSizeUnit'] );
			}
			if ( ! empty( $font_size ) ) {
				$css['tablet'][] = $font_size;
			}

			/**
			 * Mobile styles.
			 */
			if ( array_key_exists( 'mobileLineHeight', $styles ) ) {
				$css['mobile'][] = $this->create_style( 'line-height', $styles['mobileLineHeight'] . $styles['mobileLineHeightUnit'] );
			}
			if ( array_key_exists( 'mobileLetterSpacing', $styles ) ) {
				$css['mobile'][] = $this->create_style( 'letter-spacing', $styles['mobileLetterSpacing'] . 'px' );
			}

			$font_size = '';
			if ( $inherit ) {
				$clamp_desktop_value = null;
				$has_clamped_font_size = false;
				if ( array_key_exists( 'fontSize', $styles ) ) {
					$clamp_desktop_value = $this->clamp_inherited_style( $styles['fontSize'], $inherit_max );
					if ( ! empty( $clamp_desktop_value ) ) {
						$font_size = $this->create_style( 'font-size', $clamp_desktop_value . $styles['fontSizeUnit'] );
					}
				}

				$clamp_tablet_value = null;
				if ( array_key_exists( 'tabletFontSize', $styles ) ) {
					$clamp_tablet_value = $this->clamp_inherited_style( $styles['tabletFontSize'], $inherit_max );
					if ( ! empty( $clamp_tablet_value ) ) {
						$font_size = $this->create_style( 'font-size', $clamp_tablet_value . $styles['tabletFontSizeUnit'] );
					}
				}
				if ( empty( $clamp_tablet_value ) ) {
					if ( ! empty( $clamp_desktop_value ) || array_key_exists( 'tabletFontSize', $styles ) ) {
						// If we have a desktop value clamped, and there's a tablet value, don't do anything.
						if ( $has_clamped_font_size ) {
							$font_size = '';
						}
					}
				}
			}
			if ( array_key_exists( 'mobileFontSize', $styles ) ) {
				$font_size = $this->create_style( 'font-size', $styles['mobileFontSize'] . $styles['mobileFontSizeUnit'] );
			}
			if ( ! empty( $font_size ) ) {
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
			$block_name = isset( $block['blockName'] ) ? $block['blockName'] : '';

			if ( $block_content === null ) {
				return $block_content;
			}

			// Only do this if we have some global typography settings to apply.
			if ( empty( $this->generated_typography_css ) ) {
				return $block_content;
			}

			// Only do this for native blocks.
			if ( stripos( $block_name, 'core/' ) !== 0 ) {
				return $block_content;
			}

			// Only do the native paragraph blocks only if body text is used.
			if ( $block_name === 'core/paragraph' && ! $this->generated_body_typography_css ) {
				return $block_content;
			}

			// Only do the native hedaing blocks only if headings is used.
			if ( $block_name === 'core/heading' && ! $this->generated_heading_typography_css ) {
				return $block_content;
			}

			// Don't do this for custom HTML blocks.
			if ( in_array( $block_name, array( 'core/html', 'core/embed' ) ) ) {
				return $block_content;
			}

			// If a native block, let's add a new data- attribute to it so we can target it in css.
			if ( stripos( $block_content, '>' ) !== false ) {
				$new_block_content = $this->str_replace_first( '>', ' data-block-type="core">', $block_content );
				// If we encounter a comment that got converted, we can detect that.
				if ( stripos( $new_block_content, '-- data-block-type="core">' ) === false ) {
					return $new_block_content;
				}
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

		/**
		 * Prevent global settings from affecting the styles of the native Post
		 * block. This fixes the issue where the last column of the native Posts
		 * block incorrectly wraps below and leaves a gap.
		 *
		 * @param array $selectors
		 * @param string $tag
		 * @return void
		 */
		public function posts_block_columns_fix( $selectors, $tag ) {
			// Prevent global settings from affecting the native wp block post.
			if ( $tag === 'li' ) {
				$index = array_search( '[data-block-type="core"] li', $selectors );
				if ( $index !== false ) {
					$selectors[ $index ] = '[data-block-type="core"] li:not(.wp-block-post)';
				}
			}

			return $selectors;
		}
	}

	new Stackable_Global_Settings();
}
