<?php
/**
 * Global Color Schemes
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Global_Color_Schemes' ) ) {

	/**
	 * Stackable Global Color Schemes
	 */
    class Stackable_Global_Color_Schemes {

		public $block_background_schemes = array(); // List of non-default background color schemes used by blocks.

		public $block_container_schemes = array(); // List of non-default container color schemes used by blocks.

		public $color_schemes = array(); // List of all color schemes

		/**
		 * Initialize
		 */

  		function __construct() {
			// Register our settings.
			add_action( 'register_stackable_global_settings', array( $this, 'register_color_schemes' ) );
			if ( is_frontend() ) {

				/**
				 * Global Color Schemes hooks
				 */
				// Add the Global Color Schemes styles in the frontend only.
				add_filter( 'stackable_inline_styles_nodep', array( $this, 'add_global_color_schemes_styles' ) );
			}
		}

		/**
		 * Register the settings we need for global color schemes.
		 *
		 * @return void
		 */
		public function register_color_schemes() {
			$string_properties = Stackable_Global_Settings::get_string_properties();

			register_setting(
				'stackable_global_settings',
				'stackable_global_color_schemes',
				array(
					'type' => 'array',
					'description' => __( 'Stackable Global Color Schemes', STACKABLE_I18N ),
					'sanitize_callback' => array( $this, 'sanitize_array_setting' ),
					'show_in_rest' => array(
						'schema' => array(
							'items' => array(
								'type'=>'object',
								'properties'=> array(
									'name' => array( 'type' => 'string' ),
									'key' => array( 'type' => 'string' ),
									'colorScheme' => array(
										'type' => 'object',
										'properties' => Stackable_Global_Color_Schemes::get_color_scheme_properties( $string_properties )
									),
									'hideInPicker' => array( 'type' => 'boolean' )
								)
							)
						)
					),
					'default' => '',
				)
			);

			register_setting(
				'stackable_global_settings',
				'stackable_global_hide_color_scheme_colors',
				array(
					'type' => 'boolean',
					'description' => __( 'Hide color scheme colors in the Stackable color picker', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);

			register_setting(
				'stackable_global_settings',
				'stackable_global_base_color_scheme',
				array(
					'type' => 'string',
					'description' => __( 'Stackable Global Base Color Scheme', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);

			register_setting(
				'stackable_global_settings',
				'stackable_global_background_mode_color_scheme',
				array(
					'type' => 'string',
					'description' => __( 'Stackable Global Background Mode Color Scheme', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);

			register_setting(
				'stackable_global_settings',
				'stackable_global_container_mode_color_scheme',
				array(
					'type' => 'string',
					'description' => __( 'Stackable Global Container Mode Color Scheme', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);

			register_setting(
				'stackable_global_settings',
				'stackable_global_color_scheme_generated_css',
				array(
					'type' => 'string',
					'description' => __( 'Stackable Global Color Scheme Generated CSS', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);

			register_setting(
				'stackable_global_settings',
				'stackable_use_v3_16_0_color_scheme_inheritance',
				array(
					'type' => 'boolean',
					'description' => __( 'Stackable Global Color Scheme v3.16.0 Color Scheme Inheritance', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => false,
				)
			);
		}

		// Make this function static so it can be used when
		// registering the custom color schemes in premium
		public static function sanitize_array_setting( $input ) {
			return ! is_array( $input ) ? array( array() ) : $input;
		}

		/**
		 * Get the Color Scheme Properties/Settings
		 *
		 * @param 	any $values
		 * if $values is null, return an array. Otherwise, return an associative array
		 * where the keys are the Color Scheme properties and the values are $values.
		 *
		 * Note: All keys will have the value $values.
		 * ( E.g., if $values = array('desktop' => ''), then
		 *  properties[ 'backgroundColor' ] = array('desktop' => '' ),
		 *  properties[ 'headingColor' ] = array('desktop' => '' ),
		 *  etc. )
		 *
		 * @return 	Array
		 */
		public static function get_color_scheme_properties( $values = null ) {
			$properties = [
				'backgroundColor',
				'headingColor',
				'textColor',
				'linkColor',
				'accentColor',
				'buttonBackgroundColor',
				'buttonTextColor',
				'buttonOutlineColor'
			];

			if ( $values == null ) {
				return $properties;
			}

			$_properties = array();
			foreach ( $properties as $key ) {
				$_properties[ $key ] = $values;
			}

			return $_properties;
		}

		/**-----------------------------------------------------------------------------
		 * Global Color Scheme functions
		 *-----------------------------------------------------------------------------*/

		public static function get_color_schemes_array() {
			$schemes_array = is_array( get_option( 'stackable_global_color_schemes' ) ) ? get_option( 'stackable_global_color_schemes' ) : [];

			// Get all color schemes, including custom color schemes if any
			$all_color_schemes = apply_filters( 'stackable_global_color_schemes/get_color_schemes', $schemes_array );

			if ( ! is_array( $all_color_schemes ) ) {
				return false;
			}

			return self::convert_to_assoc_array( $all_color_schemes );
		}

		/**
		 * Add the default global color schemes in the frontend (Base, Default Background, Default Container).
		 * Other color schemes used by blocks will be added on `render_block` filter.
		 *
		 * @param String 	$current_css
		 * @return String
		 */
		public function add_global_color_schemes_styles( $current_css ) {
			$cached_color_scheme_css = get_option( 'stackable_global_color_scheme_generated_css' );

			// If there is cached CSS, use it
			if ( $cached_color_scheme_css ) {
				// Add a body class if there are any global color schemes styles.
				add_filter( 'body_class', array( $this, 'add_body_class_color_schemes' ) );
				$current_css .= $cached_color_scheme_css;
				return apply_filters( 'stackable_frontend_css' , $current_css );
			}

			// Generate the CSS for the color schemes if there is no cached CSS
			$all_color_schemes = $this::get_color_schemes_array();

			if ( ! $all_color_schemes ) {
				return $current_css;
			}

			$this->color_schemes = $all_color_schemes;

			$base_default = isset( $this->color_schemes[ get_option( 'stackable_global_base_color_scheme' ) ] ) ? get_option( 'stackable_global_base_color_scheme' ) : 'scheme-default-1';
			$background_default = isset( $this->color_schemes[ get_option( 'stackable_global_background_mode_color_scheme' ) ] )  ? get_option( 'stackable_global_background_mode_color_scheme' ) : 'scheme-default-2';
			$container_default = isset( $this->color_schemes[ get_option( 'stackable_global_container_mode_color_scheme' ) ] )  ? get_option( 'stackable_global_container_mode_color_scheme' ) : 'scheme-default-1';

			$styles = array();

			// list CSS selectors for default schemes
			$default_color_schemes = array(
				array(
					'key' => $base_default,
					'mode' => '',
					'selectors' => array(
						'desktop' => ':root'
					)
				),
				array(
					'key' => $background_default,
					'mode' => 'background',
					'selectors' => array(
						'desktop' => '.stk-block-background',
						'desktopParentHover' => ':where(.stk-hover-parent:hover) .stk-block-background'
					)
				),
				array(
					'key' => $container_default,
					'mode' => 'container',
					'selectors' => array(
						'desktop' => '.stk-container:where(:not(.stk--no-background))',
						'desktopParentHover' => array( '.stk-container:where(:not(.stk--no-background):hover)', ':where(.stk-hover-parent:hover) .stk-container:where(:not(.stk--no-background))')
					)
				)
			);

			$block_color_schemes = array(
				'background' => array(),
				'container' => array(),
			);

			// generate selectors for all schemes in background and container mode
			foreach ($this->color_schemes as $key => $_ ) {
				$block_color_schemes['background'][] = array(
					'key' => $key,
					'mode' => 'background',
					'selectors' => array(
						'desktop' => ".stk--background-scheme--$key",
						'desktopParentHover' => ":where(.stk-hover-parent:hover) .stk--background-scheme--$key"
					)
				);
				$block_color_schemes['container'][] = array(
					'key' => $key,
					'mode' => 'container',
					'selectors' => array(
						'desktop' => ".stk--container-scheme--$key",
						'desktopParentHover' => array(".stk--container-scheme--$key:where(:hover)",":where(.stk-hover-parent:hover) .stk--container-scheme--$key")
					)
				);
			}

			foreach( $default_color_schemes as $scheme ) {
				$styles = $this->generate_color_scheme_styles( $styles, $scheme );
			}

			// This fixes the issue wherein if there is a background scheme and no container/base scheme, the container inherits the background scheme which may cause the text to be unreadable
			if ( isset( $this->color_schemes[ $container_default ] ) && $this::is_scheme_empty( $this->color_schemes[ $container_default ] ) ) {
				$styles = $this->getDefaultContainerColors( $styles, $default_color_schemes[ 2 ] );
			}

			$color_scheme_css = '';
			$generated_css = wp_style_engine_get_stylesheet_from_css_rules( $styles );
			if ( $generated_css != '' ) {
				$color_scheme_css .= "\n/* Global Color Schemes */\n";
				$color_scheme_css .= $generated_css;
			}

			foreach( $block_color_schemes as $mode => $block_schemes ) {
				foreach( $block_schemes as $scheme ) {
					$styles = $this->generate_color_scheme_styles( array(), $scheme );
					$generated_css = wp_style_engine_get_stylesheet_from_css_rules( $styles );
					if ( $generated_css != '' ) {
						$scheme_key = $scheme[ 'key' ];
						$color_scheme_css .= "\n/* Global Color Schemes ($mode-$scheme_key) */\n";
						$color_scheme_css .= $generated_css;
					}
				}
			}

			// Add a body class if there are any global color schemes styles.
			if ( $color_scheme_css !== '' ) {
				add_filter( 'body_class', array( $this, 'add_body_class_color_schemes' ) );
			}

			// Add the generated CSS to the database
			update_option( 'stackable_global_color_scheme_generated_css', $color_scheme_css );

			$current_css .= $color_scheme_css;
			return apply_filters( 'stackable_frontend_css' , $current_css );
		}

		public function add_body_class_color_schemes( $classes ) {
			$classes[] = 'stk-has-color-schemes';
			return $classes;
		}

		/**
		 * This converts the Color Schemes from the database to an associative array where
		 * the key is the color scheme slug and the value is the color scheme array itself.
		 *
		 * This allows us to easily check if the color scheme exists
		 * and retrieve the color scheme by slug
		 *
		 * @param Array 	$schemes_array
		 * @return Array
		 */
		public static function convert_to_assoc_array( $schemes_array ) {
			return array_column( $schemes_array, 'colorScheme', 'key' );
		}

		/**
		 * This converts the camel-cased properties to kebab case for CSS custom properties.
		 * E.g., headingColor ==> --stk-heading-color
		 *
		 * @param String 	$property
		 * @return String
		 */
		public function css_property_camel_to_kebab_case( $property ) {
			$result = preg_replace('/([a-z0-9])([A-Z])/', '$1-$2', $property);

			// Convert the result to lowercase and return
			return '--stk-' . strtolower($result);
		}

		/**
		 * This returns an associative array of the color scheme properties where
		 * the key is the camel-cased Property and the value is the kebab-cased CSS custom property
		 *
		 * @param String 	$mode ('', 'background', 'container')
		 * @return Array
		 */
		public function get_css_custom_properties( $mode = '' ) {
			$properties_per_state = array();
			$keys = Stackable_Global_Color_Schemes::get_color_scheme_properties();
			$states = array(
				'desktop' => '',
				'desktopHover' => '-hover',
				'desktopParentHover' => ''
			);
			foreach ( $states as $device_state => $state ) {
				$properties = array();
				foreach( $keys as $key ) {
					if ( $key === 'backgroundColor' ) {
						if ( $mode ) {
							$prefix = $mode === 'background' ? 'block' : 'container';
							$properties[ $key ] = "--stk-$prefix-background-color" . $state;
						}
						continue;
					}
					$properties[ $key ] = $this->css_property_camel_to_kebab_case( $key ) . $state;
				}
				$properties_per_state[ $device_state ] = $properties;
			}


			return $properties_per_state;
		}

		public function get_inherited_value( $property, $current_state, $inheritParentHover = true ) {
			$value = $property[ $current_state ] ?? false;

			if ( ! $value && $current_state == 'desktopHover' && $inheritParentHover ) {
				$value = $property[ 'desktopParentHover' ] ?? false;
			}

			if ( ! $value && $current_state !== 'desktop' ) {
				$value = $property[ 'desktop' ];
			}

			return $value;
		}

		public function has_value( $scheme, $property, $state ) {
			if ( ! isset( $scheme[ $property ] ) ) {
				return false;
			}

			if ( ! isset( $scheme[ $property ][ $state ] ) ) {
				return false;
			}

			if ( $scheme[ $property ][ $state ] === '' ) {
				return false;
			}

			return true;
		}

		public static function is_scheme_empty( $scheme ) {
			foreach( $scheme as $property => $values ) {
				if ( is_array( $values ) ) {
					foreach( $values as $device_state => $value ) {
						if ( $value ) return false;
					}
				}
			}

			return true;
		}

		public function is_gradient( $scheme, $property, $state ) {
			if ( ! $this->has_value( $scheme, $property, $state ) ) {
				return false;
			}
			$value = $scheme[ $property ][ $state ];
			return strpos( $value, 'linear-' ) !== false || strpos( $value, 'radial-' ) !== false;
		}

		// These colors are used when there are color schemes but the default container scheme is empty
		public function getDefaultContainerColors( $styles, $scheme ) {
			$selectors = $scheme[ 'selectors' ];

			$default_styles = array();
			$default_styles[] = array(
				'selector'     => $selectors[ 'desktop' ],
				'declarations' => array(
					'--stk-background-color' => 'var(--stk-default-container-background-color, #fff)',
					'--stk-heading-color' => 'var(--stk-default-heading-color, initial)',
					'--stk-text-color' => 'var(--stk-container-color, initial)',
					'--stk-link-color' => 'var(--stk-default-link-color, var(--stk-text-color, initial))',
					'--stk-accent-color' => '#ddd',
					'--stk-subtitle-color' => 'var(--stk-default-subtitle-color, #39414d)',
					'--stk-default-icon-color' => 'var(--stk-icon-color)',
					'--stk-button-background-color' => 'var(--stk-default-button-background-color, #008de4)',
					'--stk-button-text-color' => 'var(--stk-default-button-text-color, #fff)',
					'--stk-button-outline-color' => 'var(--stk-default-button-background-color, #008de4)'
				)
			);

			$default_styles = apply_filters( 'stackable.global-settings.global-color-schemes.default-container-scheme', $default_styles );

			foreach ( $default_styles as $styles ) {
				$styles[] = $default_styles;
			}


			return $styles;
		}

		/**
		 * This returns the CSS declarations for the CSS rules.
		 *
		 * @param Array 	$scheme
		 * @param String 	$mode ('', 'background', 'container')
		 * @return Array
		 */
		public function generate_css_rules( $scheme, $mode = '' ) {
			$decls = array(
				'desktop' => array(),
				'desktopHover' => array(),
				'desktopParentHover' => array(),
			);

			$button_plain_decls = array(
				'desktop' => array(),
				'desktopHover' => array(),
				'desktopParentHover' => array(),
			);

			$properties_per_state = $this->get_css_custom_properties( $mode );

			foreach ( $properties_per_state as $state => $properties ) {
				foreach ( $properties as $property => $css_property ) {
					if ( $this->has_value( $scheme, $property, $state ) ) {
						$decls[ $state ][ $css_property ] = $scheme[ $property ][ $state ];

						if ( $property === 'accentColor' ) {
							$suffix = $state === 'desktopHover' ? '-hover' : '';
							$decls[ $state ][ "--stk-subtitle-color$suffix" ] = $scheme[ $property ][ $state ];
						}
					}

					/**
					 * DEV NOTE: The code below is commented out because it is the initial implementation.
					 * Before, we set the `*-hover` properties to inherit the normal/parent-hover values.
					 * However, this was causing some issues with the hover states.
					 *
					 * The new implementation now relies on CSS variables and fallback values.
					 */
					/* $inherited_value = $this->get_inherited_value( $scheme[ $property ], $state );
					$inherited_normal_value = $this->get_inherited_value( $scheme[ $property ], $state, false );

					// Inherit the normal value on hover state
					if ( $state === 'desktopHover' && ! $this->has_value( $scheme, $property, $state ) && $inherited_normal_value) {
						$decls[ 'desktop' ][ $css_property ] = $inherited_normal_value;
					}

					// Inherit the parent-hover value on hover state
					if ( $state === 'desktopHover' && ! $this->has_value( $scheme, $property, $state ) && $inherited_value) {
						$decls[ 'desktopParentHover' ][ $css_property ] = $inherited_value;
					} */

					// If button background color is gradient, plain style buuttons should use the button outline color.
					if ( $property == 'buttonBackgroundColor' && $this->is_gradient( $scheme, $property, $state ) ) {
						$suffix = $state === 'desktopHover' ? '-hover' : '';
						$button_plain_decls[ $state ][ "--stk-button-plain-text-color$suffix" ] = "var(--stk-button-outline-color$suffix)";
					}
				}
			}

			/**
			 * DEV NOTE: The code below is commented out because it is the initial implementation.
			 * Before, we set the `*-hover` properties to inherit the normal/parent-hover values.
			 * However, this was causing some issues with the hover states.
			 *
			 * The new implementation now relies on CSS variables and fallback values.
			 */
			// if the button background color is gradient on normal or parent-hover states,
			// and there's no button background color set on hover,
			// plain-style buttons will turn black.
			// To prevent this, use button-outline-color-hover.
			/* if ( $this->is_gradient( $scheme, 'buttonBackgroundColor', 'desktop' )
			 	&& ! $this->has_value( $scheme, 'buttonBackgroundColor', 'desktopHover' )
			) {
			 	$button_plain_decls[ 'desktopHover' ][ '--stk-button-plain-text-color-hover' ] = 'var(--stk-button-outline-color-hover)';
			}

			if ( $this->is_gradient( $scheme, 'buttonBackgroundColor', 'desktopParentHover' )
				&& ! $this->has_value( $scheme, 'buttonBackgroundColor', 'desktopHover' )
			) {
			 	$button_plain_decls[ 'desktopParentHover' ][ '--stk-button-plain-text-color-hover' ] = 'var(--stk-button-outline-color-hover)';
			} */

			// if the button background color is gradient on normal state and solid on parent-hover state,
			// we need to unset the --stk-button-plain-text-color,
			// so that plain-style buttons on parent-hover state will use the button background color.
			if ( $this->is_gradient( $scheme, 'buttonBackgroundColor', 'desktop' )
				&& $this->has_value( $scheme, 'buttonBackgroundColor', 'desktopParentHover' )
				&& ! $this->is_gradient( $scheme, 'buttonBackgroundColor', 'desktopParentHover' )
			) {
				$button_plain_decls[ 'desktopParentHover' ][ '--stk-button-plain-text-color' ] = 'unset';
				$button_plain_decls[ 'desktopParentHover' ][ '--stk-button-plain-text-color-hover' ] = 'unset';
			}

			return array( $decls, $button_plain_decls );
		}

		/**
		 * This returns the array that contains the css selectors
		 * and declarations needed for wp_style_engine_get_stylesheet_from_css_rules
		 *
		 * @param Array 	$styles
		 * @param Array 	$scheme
		 * @return Array
		 */
		public function generate_color_scheme_styles( $styles, $scheme ) {
			$scheme_key = $scheme[ 'key' ];
			$selectors = $scheme[ 'selectors' ];
			$mode = $scheme[ 'mode' ];

			if ( isset( $this->color_schemes[ $scheme_key ] ) ) {
				list($decls, $button_plain_decls) = $this->generate_css_rules( $this->color_schemes[ $scheme_key ], $mode );

				$styles[] = array(
					'selector'     => $selectors[ 'desktop' ],
					'declarations' => array_merge( $decls[ 'desktop' ], $decls[ 'desktopHover'] )
				);

				$styles[] = array(
					'selector'     => $selectors[ 'desktop' ] . ' :where(.is-style-plain)',
					'declarations' => array_merge( $button_plain_decls[ 'desktop' ], $button_plain_decls[ 'desktopHover'] )
				);

				if ( isset( $selectors[ 'desktopParentHover' ] ) ) {
					$parent_hover_selector = is_array( $selectors[ 'desktopParentHover' ] ) ? $selectors[ 'desktopParentHover' ] : array( $selectors[ 'desktopParentHover' ] );

					$styles[] = array(
						'selector'     => implode(", ", $parent_hover_selector),
						'declarations' => $decls[ 'desktopParentHover' ]
					);
					$styles[] = array(
						'selector'     => implode(", ", array_map( function ( $s ){ return "$s :where(.is-style-plain)";}, $parent_hover_selector ) ),
						'declarations' => $button_plain_decls[ 'desktopParentHover' ]
					);
				}

				$styles = $this->add_theme_compatibility( $styles, $this->color_schemes[ $scheme_key ], $selectors, $mode );
			}

			return $styles;
		}

		public function add_theme_compatibility( $styles, $scheme, $selectors, $mode ) {
			$classes = get_body_class();

			$styles = apply_filters( 'stackable.global-settings.global-color-schemes.add-theme-compatibility', $styles, $scheme, $selectors, $mode, $classes );

			return $styles;
		}
	}

	new Stackable_Global_Color_Schemes();
}
