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
		 * Corresponds to the stackable_global_force_typography option for forcing important
		 *
		 * @var boolean
		 */
		private $force_typography = false;

		/**
		 * Initialize
		 */
  		function __construct() {
			// Register our settings.
			add_action( 'admin_init', array( $this, 'register_global_settings' ) );
			add_action( 'rest_api_init', array( $this, 'register_global_settings' ) );

			if ( is_frontend() ) {

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
					$this->force_typography = get_option( 'stackable_global_force_typography' );
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
		 * Creates a complete schema for a given type.
		 *
		 * This function generates a schema that defines values for various device types
		 * and hover states. It also includes the units associated with each device type.
		 *
		 * @param array $type The type definition for the schema
		 * @return array The generated schema.
		 */
		public static function create_global_schema( $type ) {
			return array(
				'type' => 'object',
				'properties' => array(
					'desktop' => $type,
					'tablet' => $type,
					'mobile' => $type,
					'desktopHover' => $type,
					'tabletHover' => $type,
					'mobileHover' => $type,
					'desktopParentHover' => $type,
					'tabletParentHover' => $type,
					'mobileParentHover' => $type,
					'desktopUnit' => array( 'type' => 'string' ),
					'tabletUnit' => array( 'type' => 'string' ),
					'mobileUnit' => array( 'type' => 'string' ),
					'desktopHoverUnit' => array( 'type' => 'string' ),
					'tabletHoverUnit' => array( 'type' => 'string' ),
					'mobileHoverUnit' => array( 'type' => 'string' ),
					'desktopParentHoverUnit' => array( 'type' => 'string' ),
					'tabletParentHoverUnit' => array( 'type' => 'string' ),
					'mobileParentHoverUnit' => array( 'type' => 'string' ),
				)
			);
		}

		/**
		 * This function defines a schema for a four-range type and utilizes the
		 * `create_global_schema` function to generate the complete schema.
		 *
		 * @return array The generated schema for four-range type.
		 */
		public static function get_four_range_properties() {
			$four_range_type  = array(
				'type' => 'object',
				'properties' => array(
					'top' => array( 'type' => 'number', 'default' => '' ),
					'right' => array( 'type' => 'number', 'default' => '' ),
					'bottom' => array( 'type' => 'number', 'default' => '' ),
					'left' => array( 'type' => 'number', 'default' => '' ),
				)
			);

			return Stackable_Global_Settings::create_global_schema( $four_range_type );
		}
		
		/**
		 * This function defines a schema for a string four-range type and utilizes the
		 * `create_global_schema` function to generate the complete schema.
		 *
		 * @return array The generated schema for four-range type.
		 */
		public static function get_string_four_range_properties() {
			$string_four_range_type  = array(
				'type' => 'object',
				'properties' => array(
					'top' => array( 'type' => 'string', 'default' => '' ),
					'right' => array( 'type' => 'string', 'default' => '' ),
					'bottom' => array( 'type' => 'string', 'default' => '' ),
					'left' => array( 'type' => 'string', 'default' => '' ),
				)
			);

			return Stackable_Global_Settings::create_global_schema( $string_four_range_type );
		}

		/**
		 * This function defines a schema for a string type and utilizes the
		 * `create_global_schema` function to generate the complete schema.
		 *
		 * @return array The generated schema for string type.
		 */
		public static function get_string_properties() {
			$string_type = array( 'type' => 'string' );

			return Stackable_Global_Settings::create_global_schema( $string_type );
		}

		/**
		 * This function defines a schema for a number type and utilizes the
		 * `create_global_schema` function to generate the complete schema.
		 *
		 * @return array The generated schema for number type.
		 */
		public static function get_number_properties() {
			$number_type = array( 'type' => 'number' );

			return Stackable_Global_Settings::create_global_schema( $number_type );
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
						'type' => 'string',
					),
					'tabletFontSize' => array(
						'type' => 'string',
					),
					'mobileFontSize' => array(
						'type' => 'string',
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
									'.stk-button__inner-text' => $stackable_global_typography_schema,
								)
							)
						)
					),
					'default' => '',
				)
			);

			register_setting(
				'stackable_global_settings',
				'stackable_selected_font_pair',
				array(
					'type' => 'string',
					'description' => __( 'Stackable currently selected global font pair', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);

			register_setting(
				'stackable_global_settings',
				'stackable_custom_font_pairs',
				array(
					'type' => 'array',
					'description' => __( 'Stackable added custom font pairs', STACKABLE_I18N ),
					'sanitize_callback' => array( $this, 'sanitize_array_setting' ),
					'show_in_rest' => array(
						'schema' => array(
							'items' => array(
								'type' => 'object',
								'properties' => array(
									'name' => array(
										'type' => 'string',
									),
									'typography' => array(
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
											'.stk-button__inner-text' => $stackable_global_typography_schema,
										)
									),
								)
							)
						)
					),
					'default' => '',
				)
			);

			register_setting(
				'stackable_global_settings',
				'stackable_use_typography_as_presets',
				array(
					'type' => 'boolean',
					'description' => __( 'Use Global Typography font sizes as preset', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);

			register_setting(
				'stackable_global_settings',
				'stackable_is_apply_body_to_html',
				array(
					'type' => 'boolean',
					'description' => __( 'Stackable global typography apply to setting', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);

			register_setting(
				'stackable_global_settings',
				'stackable_icon_library',
				array(
					'type' => 'array',
					'description' => __( 'Stackable Icon Library', STACKABLE_I18N ),
					'sanitize_callback' => array( $this, 'sanitize_array_setting' ),
					'show_in_rest' => array(
						'schema' => array(
							'items' => array(
								'type' => 'object',
								'properties' => array(
									'name' => array(
										'type' => 'string',
									),
									'key' => array(
										'type' => 'string',
									),
									'icon' => array(
										'type' => 'string',
									),
								)
							)
						)
					),
					'default' => '',
				)
			);

			do_action( 'register_stackable_global_settings' );
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
				update_option( 'stackable_global_hide_theme_colors', '1', 'no' );
				update_option( 'stackable_global_hide_default_colors', '1', 'no' );
				update_option( 'stackable_global_hide_site_editor_colors', '1', 'no' );
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
				$typography_css = $this->generate_typography_styles( implode( ', ', $selectors ), $styles );
				if ( ! empty( $typography_css ) ) {
					$css[] = $typography_css;
				}

				// Gather the Google Fonts.
				if ( isset( $styles['fontFamily'] ) ) {
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

			$apply_to = $this->get_apply_typography_to();

			// Include native blocks.
			if ( $apply_to !== 'blocks-stackable' ) {
				$selectors[] = '[data-block-type="core"] ' . $tag;
				$selectors[] = $tag . '[data-block-type="core"]';
			}

			// Include all other blocks.
			if ( $apply_to === 'blocks-all' ) {
				$selectors[] = '[class*="wp-block-"] ' . $tag;
				$selectors[] = $tag . '[class*="wp-block-"]';
			}

			return apply_filters( 'stackable_global_typography_selectors', $selectors, $tag );
		}

		public function form_paragraph_selector() {
			$selectors = array_merge(
				$this->form_tag_selector( 'p' ), // Core text
				$this->form_tag_selector( 'li' ), // Core lists
				$this->form_tag_selector( 'td' )  // Core table cells
			);
		
			// Add 'html' only if is_apply_body_to_html is true
			$is_apply_body_to_html = get_option( 'stackable_is_apply_body_to_html' );
			if ( $is_apply_body_to_html ) {
				$selectors[] = 'html';
			}
		
			return $selectors;
		}

		public function clean_font_size( $font_size, $font_size_unit = '' ) {
			if ( is_string( $font_size ) && str_starts_with( $font_size, 'var' ) ) {
				return $font_size;
			}

			return $font_size . $font_size_unit;
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
			return $style . ': ' . $value . ( $this->force_typography ? ' !important' : '' ) . ';';
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
			$tablet_breakpoint = 1023;
			$mobile_breakpoint = 767;

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
			if ( isset( $styles['fontFamily'] ) ) {
				$css['desktop'][] = $this->create_style( 'font-family', $this->get_font_family( $styles['fontFamily'] ) );
			}
			if ( isset( $styles['fontSize'] ) ) {
				$css['desktop'][] = $this->create_style( 'font-size', $this->clean_font_size( $styles['fontSize'], $styles['fontSizeUnit'] ) );
			}
			if ( isset( $styles['fontWeight'] ) ) {
				$css['desktop'][] = $this->create_style( 'font-weight', $styles['fontWeight'] );
			}
			if ( isset( $styles['textTransform'] ) ) {
				$css['desktop'][] = $this->create_style( 'text-transform', $styles['textTransform'] );
			}
			if ( isset( $styles['lineHeight'] ) ) {
				$css['desktop'][] = $this->create_style( 'line-height', $styles['lineHeight'] . $styles['lineHeightUnit'] );
			}
			if ( isset( $styles['letterSpacing'] ) ) {
				$css['desktop'][] = $this->create_style( 'letter-spacing', $styles['letterSpacing'] . 'px' );
			}

			/**
			 * Tablet styles.
			 */
			if ( isset( $styles['tabletLineHeight'] ) ) {
				$css['tablet'][] = $this->create_style( 'line-height', $styles['tabletLineHeight'] . $styles['tabletLineHeightUnit'] );
			}
			if ( isset( $styles['tabletLetterSpacing'] ) ) {
				$css['tablet'][] = $this->create_style( 'letter-spacing', $styles['tabletLetterSpacing'] . 'px' );
			}
			$font_size = '';
			if ( $inherit ) {
				if ( isset( $styles['fontSize'] ) ) {
					$clamp_desktop_value = $this->clamp_inherited_style( $styles['fontSize'], $inherit_max );
					if ( ! empty( $clamp_desktop_value ) ) {
						$font_size = $this->create_style( 'font-size', $this->clean_font_size( $clamp_desktop_value, $styles['fontSizeUnit'] ) );
					}
				}
			}
			if ( isset( $styles['tabletFontSize'] ) ) {
				$font_size = $this->create_style( 'font-size', $this->clean_font_size( $styles['tabletFontSize'], $styles['tabletFontSizeUnit'] ) );
			}
			if ( ! empty( $font_size ) ) {
				$css['tablet'][] = $font_size;
			}

			/**
			 * Mobile styles.
			 */
			if ( isset( $styles['mobileLineHeight'] ) ) {
				$css['mobile'][] = $this->create_style( 'line-height', $styles['mobileLineHeight'] . $styles['mobileLineHeightUnit'] );
			}
			if ( isset( $styles['mobileLetterSpacing'] ) ) {
				$css['mobile'][] = $this->create_style( 'letter-spacing', $styles['mobileLetterSpacing'] . 'px' );
			}

			$font_size = '';
			if ( $inherit ) {
				$clamp_desktop_value = null;
				$has_clamped_font_size = false;
				if ( isset( $styles['fontSize'] ) ) {
					$clamp_desktop_value = $this->clamp_inherited_style( $styles['fontSize'], $inherit_max );
					if ( ! empty( $clamp_desktop_value ) ) {
						$font_size = $this->create_style( 'font-size', $this->clean_font_size( $clamp_desktop_value, $styles['fontSizeUnit'] ) );
					}
				}

				$clamp_tablet_value = null;
				if ( isset( $styles['tabletFontSize'] ) ) {
					$clamp_tablet_value = $this->clamp_inherited_style( $styles['tabletFontSize'], $inherit_max );
					if ( ! empty( $clamp_tablet_value ) ) {
						$font_size = $this->create_style( 'font-size', $this->clean_font_size( $clamp_tablet_value, $styles['tabletFontSizeUnit'] ) );
					}
				}
				if ( empty( $clamp_tablet_value ) ) {
					if ( ! empty( $clamp_desktop_value ) || isset( $styles['tabletFontSize'] ) ) {
						// If we have a desktop value clamped, and there's a tablet value, don't do anything.
						if ( $has_clamped_font_size ) {
							$font_size = '';
						}
					}
				}
			}
			if ( isset( $styles['mobileFontSize'] ) ) {
				$font_size = $this->create_style( 'font-size', $this->clean_font_size( $styles['mobileFontSize'], $styles['mobileFontSizeUnit'] ) );
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

			// If the font is a CSS custom property, return it directly.
			if ( strpos( $font_name, 'var(' ) === 0 ) {
				return $font_name;
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
			if ( isset( $value ) && is_numeric( $value ) ) {
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
			// Only do this if we have some global typography settings to apply.
			if ( empty( $this->generated_typography_css ) ) {
				return $block_content;
			}

			// Only do this for native blocks.
			if ( ! isset( $block['blockName'] ) || strpos( $block['blockName'], 'core/' ) !== 0 ) {
				return $block_content;
			}

			if ( $block_content === null ) {
				return $block_content;
			}

			// Only do the native paragraph blocks only if body text is used.
			if ( $block['blockName'] === 'core/paragraph' && ! $this->generated_body_typography_css ) {
				return $block_content;
			}

			// Only do the native hedaing blocks only if headings is used.
			if ( $block['blockName'] === 'core/heading' && ! $this->generated_heading_typography_css ) {
				return $block_content;
			}

			// Don't do this for custom HTML blocks.
			if ( in_array( $block['blockName'], array( 'core/html', 'core/embed' ) ) ) {
				return $block_content;
			}

			// If a native block, let's add a new data- attribute to it so we can target it in css.
			if ( strpos( $block_content, '>' ) !== false ) {
				$new_block_content = $this->str_replace_first( '>', ' data-block-type="core">', $block_content );
				// If we encounter a comment that got converted, we can detect that.
				if ( strpos( $new_block_content, '-- data-block-type="core">' ) === false ) {
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

		/**-----------------------------------------------------------------------------
		 * Block Layouts functions
		 *-----------------------------------------------------------------------------*/
		/**
		 * Generate CSS for:
		 *  - Global Spacing and Borders
		 *  - Global Buttons and Icons
		 *
		 * @param String $option_name
		 * @param String $settings_name
		 *
		 * @return String generated css
		 */
		public static function generate_global_block_layouts( $option_name, $settings_name ) {
			$block_layouts = get_option( $option_name );
			$defaults = Stackable_Block_Design_System::get_block_design_system();

			if ( ! $block_layouts || ! is_array( $block_layouts ) ) {
				return false;
			}

			$tablet_breakpoint = 1023;
			$mobile_breakpoint = 767;

			$css = array(
				'desktop' => array(),
				'tablet' => array(),
				'mobile' => array(),
			);

			foreach ( $block_layouts as $property => $values ) {
				$states = array_filter( $values, array( 'Stackable_Global_Settings', 'get_block_layout_states' ), ARRAY_FILTER_USE_KEY );

				foreach ( $states as $state => $value ) {
					$unit = Stackable_Global_Settings::get_block_layout_unit( $block_layouts, $property, $state );

					$device = strpos( $state, 'desktop' ) !== false ? 'desktop' : ( strpos( $state, 'tablet' ) !== false ? 'tablet' : 'mobile' );
					$hover_state = strpos( $state, 'ParentHover' ) !== false ? 'parent-hover' : ( strpos( $state, 'Hover' ) !== false ? 'hover' : 'normal' );

					$custom_property = '--stk-' . $property;

					if ( $hover_state !== 'normal' ) {
						$custom_property .= '-' . $hover_state;
					}

					if ( is_string( $value ) && ! is_numeric( $value ) ) {
						if ( strpos( $value, 'rgb' ) ) {
							// Convert rgba colors to hex alpha colors because
							// the function wp_style_engine_get_stylesheet_from_css_rules() doesn't allow css values to have '('
							// See safecss_filter_attr() of wp-includes/kses.php
							$split_value = Stackable_Global_Settings::extract_rgba( $value );
							$color = Stackable_Global_Settings::rgba_to_hex_alpha( $split_value['color'] );

							$style = $split_value[ 'options' ] . ' ' . $color;
						} else {
							$style = $value;
						}
					} else if ( is_array( $value ) ) {
						$default_value = Stackable_Global_Settings::get_block_layout_defaults( $defaults, $property, $device );

						// In case the default value is a number (same value for all sides)
						if ( ! is_array( $default_value ) ) {
							$_default_value = $default_value;
							$default_value = array(
								"top" => $_default_value,
								"right" => $_default_value,
								"bottom" => $_default_value,
								"left" => $_default_value
							);
						}

						$top = isset( $value[ 'top' ] ) ? $value[ 'top' ] : $default_value[ 'top' ];
						$right = isset( $value[ 'right' ] ) ? $value[ 'right' ] : $default_value[ 'right' ];
						$bottom = isset( $value[ 'bottom' ] ) ? $value[ 'bottom' ] : $default_value[ 'bottom' ];
						$left = isset( $value[ 'left' ] ) ? $value[ 'left' ] : $default_value[ 'left' ];

						$style  = Stackable_Global_Settings::append_unit_if_needed( $top, $unit ) . ' '
								. Stackable_Global_Settings::append_unit_if_needed( $right, $unit ) . ' '
								. Stackable_Global_Settings::append_unit_if_needed( $bottom, $unit ) . ' '
								. Stackable_Global_Settings::append_unit_if_needed( $left, $unit );
					} else {
						$style = $value . $unit;
					}

					$css[ $device ][ $custom_property ] = $style;

					// This is for backward compatibility. Add a custom property for the icon size of custom icons.
					// This is to ensure that for custom icons that don't have iconSize attribute,
					// their icon size won't change after upgrading.
					// The custom property allows us to also apply the global icon size setting to custom icons.
					if ( $property === 'button-icon-size' || $property === 'icon-size' ) {
						$css[ $device ][ '--stk-custom-' . $property ] = $style;
					}
				}
			}

			$styles = array();
			$generated_css = '';

			if ( ! empty( $css[ 'desktop' ] ) || ! empty( $css[ 'tablet' ] ) || ! empty( $css[ 'mobile' ] ) ) {
				$generated_css .= "\n/* " . $settings_name . " */\n";
			}

			if ( ! empty( $css['desktop'] ) ) {
				$styles[] = array(
						'selector'     => ':root',
						'declarations' => $css[ 'desktop' ]
				);
			}
			if ( ! empty( $css['tablet'] ) ) {
				$styles[] = array(
						'rules_group'  => '@media (max-width:' . $tablet_breakpoint .'px)',
						'selector'     => ':root',
						'declarations' => $css[ 'tablet' ]
				);
			}

			if ( ! empty( $css['mobile'] ) ) {
				$styles[] = array(
					'rules_group'  => '@media (max-width:' . $mobile_breakpoint .'px)',
					'selector'     => ':root',
					'declarations' => $css[ 'mobile' ]
				);
			}

			$generated_css .= wp_style_engine_get_stylesheet_from_css_rules( $styles );
			return $generated_css;
		}

		public static function append_unit_if_needed( $value, $unit ) {
			if ( is_string( $value ) && str_starts_with( trim( $value ), 'var(' ) ) {
				return $value;
			}
			return $value . $unit;
		}


		public static function extract_rgba($value) {
			$options = $value;
			$color = '';

			// Use a regex to find and extract the rgba value
			if (preg_match('/rgba\(.*\)$/', $options, $matches)) {
				$color = $matches[0];
				$options = str_replace($color, '', $options);
			}

			$options = trim($options);

			return [
				'options' => $options,
				'color' => $color,
			];
		}

		public static function rgba_to_hex_alpha($color) {
			// Remove 'rgba(' and ')' and split the values
			$rgba = explode(',', substr($color, 5, -1));

			$hexAlpha = array_map(function($val, $i) {
				if ($i === 3) {
					$opacity = floatval($val);
					return str_pad(dechex(ceil($opacity * 255)), 2, '0', STR_PAD_LEFT);
				}
				$hex = dechex(intval($val));
				return str_pad($hex, 2, '0', STR_PAD_LEFT);
			}, $rgba, array_keys($rgba));

			return '#' . implode('', $hexAlpha);
		}

		public static function get_block_layout_unit( $block_layouts, $property, $state ) {
			return $block_layouts[ $property ][ $state . 'Unit' ] ?? 'px';
		}

		public static function get_block_layout_states( $state ) {
			return strpos( $state, 'Unit' ) === false;
		}

		public static function get_block_layout_defaults( $defaults, $property, $device ) {
			if ( ! isset( $defaults[ $property ] ) ) {
				return '';
			}

			if ( ! isset( $defaults[ $property ][ $device ] ) ) {
				return $defaults[ $property ][ 'desktop' ];
			}

			return $defaults[ $property ][ $device ];
		}

	}

	new Stackable_Global_Settings();
}
