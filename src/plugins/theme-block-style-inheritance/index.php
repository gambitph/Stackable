<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Block_Style_Inheritance' ) ) {

	/**
	 * Stackable Block Style Inheritance
	 */
    class Stackable_Block_Style_Inheritance {

		/**
		 * Initialize
		 */
  		function __construct() {
			add_action( 'register_stackable_global_settings', array( $this, 'register_block_style_inheritance' ) );
			add_action( 'stackable_early_version_upgraded', array( $this, 'block_style_inheritance_set_default' ), 10, 2 );

			add_action( 'body_class', array( $this, 'add_body_class_block_style_inheritance' ) );
			add_filter( 'stackable_block_style_inheritance_inline_styles_nodep', array( $this, 'add_block_style_inheritance' ) );

			add_filter( 'safecss_filter_attr_allow_css', array( $this, 'allow_css' ), 10, 2 );
		}

		// Register the settings for block style inheritance
		function register_block_style_inheritance() {
			register_setting(
				'stackable_global_settings',
				'stackable_disable_block_style_inheritance',
				array(
					'type' => 'boolean',
					'description' => __( 'Inherit block style from theme.json', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);
		}

		/**
		 * When upgrading to v3.15.3 and above, set option to true for backward compatibility
		 * so that for old users, existing stackable blocks won't inherit the styles from theme.json
		 * unless they change it in the settings.
		 */
		function block_style_inheritance_set_default( $old_version, $new_version ) {
			if ( ! empty( $old_version ) && version_compare( $old_version, "3.16.0", "<" ) ) {
				if ( ! get_option( 'stackable_disable_block_style_inheritance' ) ) {
					update_option( 'stackable_disable_block_style_inheritance', 'true' );
				}
			}
		}

		/**
		 * Adds block style inheritance from theme.json styles to Stackable blocks.
		 * This allows Stackable blocks to inherit styling defined in the theme's theme.json file.
		 *
		 * @param string $current_css The current CSS string to modify
		 * @return string Modified CSS string with theme style inheritance added
		 */
		function add_block_style_inheritance( $current_css ) {
			$disable_block_style_inheritance = get_option( 'stackable_disable_block_style_inheritance' );

			// Do not generate styles if it is disabled in the settings.
			if ( $disable_block_style_inheritance ) {
				return $current_css;
			}

			// Grab all the styles defined in the current theme.json
			if ( class_exists( 'WP_Theme_JSON_Resolver' ) ) {
				// This only gets the styles from the theme.json and from the user.
				$styles_data = new WP_Theme_JSON();
				$styles_data->merge( WP_Theme_JSON_Resolver::get_theme_data() );
				$styles_data->merge( WP_Theme_JSON_Resolver::get_user_data() );
				$raw_data = $styles_data->get_raw_data();

				// Don't generate styles if it's not a block theme/there's no theme.json
				if ( ! isset( $raw_data[ 'styles' ] ) ) {
					return;
				}

				$styles = $raw_data['styles'];
			} else {
				// This gets the merged styles from core, theme, and user data
				$styles = wp_get_global_styles();
			}

			// Caching since this can be expensive.
			$hash = md5( serialize( $styles ) );
			if ( $hash === get_transient( 'stackable_block_style_inheritance_hash' ) ) {
				$generated_css = get_transient( 'stackable_block_style_inheritance_css' );
				if ( $generated_css ) {
					$current_css .= $generated_css;
					return apply_filters( 'stackable_frontend_css' , $current_css );
				}
			}

			// This consists of the selectors and declarations
			// to be used in wp_style_engine_get_stylesheet_from_css_rules
			$style_declarations = array(
				'root' => array(
					'selector' => ':root',
					'declarations' => array(),
				),
				'button' => array(
					'selector' => ':where(.stk-block-button, .stk-block-icon-button, .stk-block-pagination):not(.is-style-link) .stk-button',
					'declarations' => array(),
				),
				'button-hover' => array(
					'selector' => ':where(.stk-block-button, .stk-block-icon-button, .stk-block-pagination):not(.is-style-link) .stk-button:hover',
					'declarations' => array(),
				),
				'button-default' => array(
					'selector' => ':where(.stk-block-button, .stk-block-pagination):not(.is-style-link, .is-style-ghost, .is-style-plain) > .stk-button',
					'declarations' => array(),
				),
				'button-default-hover' => array(
					'selector' => ':where(.stk-block-button, .stk-block-pagination):not(.is-style-link, .is-style-ghost, .is-style-plain) > .stk-button:hover',
					'declarations' => array(),
				),
				'button-ghost' => array(
					'selector' => ':where(.stk-block-button, .stk-block-pagination).is-style-ghost > .stk-button',
					'declarations' => array(),
				),
				'button-ghost-hover' => array(
					'selector' => ':where(.stk-block-button, .stk-block-pagination).is-style-ghost > .stk-button:hover',
					'declarations' => array(),
				),
				'columns' => array(
					'selector' => '.stk-block-columns',
					'declarations' => array(),
				),
				'column' => array(
					'selector' => '.stk-block-column',
					'declarations' => array(),
				),
				'heading' => array(
					'selector' => ':where(.stk-block-heading) > :is(h1,h2,h3,h4,h5,h6)',
					'declarations' => array(),
				),
				'h1' => array(
					'selector' => ':where(.stk-block-heading) > h1',
					'declarations' => array(),
				),
				'h2' => array(
					'selector' => ':where(.stk-block-heading) > h2',
					'declarations' => array(),
				),
				'h3' => array(
					'selector' => ':where(.stk-block-heading) > h3',
					'declarations' => array(),
				),
				'h4' => array(
					'selector' => ':where(.stk-block-heading) > h4',
					'declarations' => array(),
				),
				'h5' => array(
					'selector' => ':where(.stk-block-heading) > h5',
					'declarations' => array(),
				),
				'h6' => array(
					'selector' => ':where(.stk-block-heading) > h6',
					'declarations' => array(),
				),
				'link' => array(
					'selector' => ':where(.stk-block-heading__text, .stk-block-text__text, .stk-block-table-of-contents__link-wrapper, .stk-block-subtitle__text, .is-style-link) a',
					'declarations' => array(),
				),
			);

			/** These properties will be added to the `:root` selector
			 * 	Dev note:
			 * 	`blockGap` doesn't get parsed by the function `wp_style_engine_get_styles`
			 *  so we manually retrieve them and add to the `:root` declarations
			 */
			$root_properties = array(
				// DEV NOTE: Remove column gap from inheritance since it breaks our design library.
				// 'columns-gap' => $this->get_value( $styles, ['blocks', 'core/columns', 'spacing', 'blockGap'] ),
				'button-group-gap' =>  $this->get_value( $styles, ['blocks', 'core/buttons', 'spacing', 'blockGap'] ),
				'default-gap' => $this->get_value( $styles, ['spacing', 'blockGap'] ),
				'text-color' => $this->get_value( $styles, ['color', 'text'] ),
				'heading-color' => $this->get_value( $styles, [ 'elements', 'heading', 'color', 'text' ] ),
				'link-color' => $this->get_value( $styles, [ 'elements', 'link', 'color', 'text' ] )
			);

			if ( $root_properties[ 'button-group-gap' ] || $root_properties[ 'default-gap' ] ) {
				$style_declarations['root']['declarations'][ '--stk-button-column-gap' ] = $root_properties[ 'button-group-gap' ] ?? $root_properties[ 'default-gap' ];
				$style_declarations['root']['declarations'][ '--stk-button-row-gap' ] = $root_properties[ 'button-group-gap' ] ?? $root_properties[ 'default-gap' ];
			}

			// DEV NOTE: Remove column gap from inheritance since it breaks our design library.
			// if ( $root_properties[ 'columns-gap' ] || $root_properties[ 'default-gap' ] ) {
			// 	$style_declarations['root']['declarations'][ '--stk-columns-column-gap' ] = $root_properties[ 'columns-gap' ] ?? $root_properties[ 'default-gap' ];
			// }

			if ( $root_properties[ 'text-color' ] ) {
				$style_declarations['root']['declarations'][ '--stk-container-color' ] = $root_properties[ 'text-color' ];
				$style_declarations['root']['declarations'][ '--stk-text-color' ] = $root_properties[ 'text-color' ];
				$style_declarations['root']['declarations'][ '--stk-default-text-color' ] = $root_properties[ 'text-color' ];
				$style_declarations['root']['declarations'][ '--stk-subtitle-color' ] = $root_properties[ 'text-color' ];
				$style_declarations['root']['declarations'][ '--stk-default-subtitle-color' ] = $root_properties[ 'text-color' ];
			}

			if ( $root_properties[ 'heading-color' ] ) {
				$style_declarations['root']['declarations'][ '--stk-default-heading-color' ] = $root_properties[ 'heading-color' ];
			} else if ( $root_properties[ 'text-color' ] ) {
				$style_declarations['root']['declarations'][ '--stk-default-heading-color' ] = $root_properties[ 'text-color' ];
			}

			if ( $root_properties[ 'link-color' ] ) {
				$style_declarations['root']['declarations'][ '--stk-default-link-color' ] = $root_properties[ 'link-color' ];
			} else if ( $root_properties[ 'text-color' ] ) {
				$style_declarations['root']['declarations'][ '--stk-default-link-color' ] = $root_properties[ 'text-color' ];
			}

			/**
			 * Array that defines how which theme.json styles will be inherited by Stackable blocks.
			 *
			 * Each element can have the following properties:
			 * @property {array} keys - Array of keys to look up styles in the $styles array generated from theme.json.
			 * 							Can be single array or array of arrays for multiple lookups
			 * @property {array} hover-keys - Array of keys for hover styles
			 * @property {array} remove_properties - CSS properties to remove from the element's declarations
			 * @property {array} get_properties - CSS properties to keep in the element's declarations
			 * @property {array} set_custom_properties - Mapping of CSS properties to custom property names
			 * @property {string} custom_properties_selector - Selector key where custom properties will be added
			 * @property {string} custom_properties_selector_hover - Selector key where hover custom properties will be added
			 */
			$element_settings = array(
				'button' => array(
					'keys' => array(
						array( 'blocks', 'core/button' ),
						array( 'elements', 'button' ),
					),
					'hover-keys' => array(
						array( 'blocks', 'core/button', ':hover' ),
						array( 'elements', 'button', ':hover' ),
					),
					'remove_properties' => array( 'color', 'background', 'background-color' ),
					'set_custom_properties' => array(
						'padding' => '--stk-button-padding'
					),
					'custom_properties_selector' => 'root',
					'custom_properties_selector_hover' => 'button-hover',
				),
				'button-default' => array(
					'keys' => array(
						array( 'blocks', 'core/button' ),
						array( 'elements', 'button' ),
					),
					'hover-keys' => array(
						array( 'blocks', 'core/button', ':hover' ),
						array( 'elements', 'button', ':hover' ),
					),
					'get_properties' => array( 'color', 'background', 'background-color' ),
					'set_custom_properties' => array(
						'color' => array('--stk-button-text-color', '--stk-default-button-text-color'),
						'background' => array('--stk-button-background-color', '--stk-default-button-background-color'),
					),
					'custom_properties_selector' => 'root',
					'custom_properties_selector_hover' => 'button-default-hover',
				),
				'button-ghost' => array(
					'keys' => array( 'blocks', 'core/button', 'variations', 'outline' ),
					'hover-keys' => array( 'blocks', 'core/button', 'variations', 'outline', ':hover' ),
					'set_custom_properties' => array(
						'padding' => '--stk-button-padding',
						'border-width' => '--stk-button-ghost-border-width' ),
					'custom_properties_selector' => 'button-ghost',
					'custom_properties_selector_hover' => 'button-ghost-hover',
				),
				'columns' =>  array( 'keys' => array( 'blocks', 'core/columns' ) ),
				'column' => array( 'keys' => array( 'blocks', 'core/column' ) ),
				'link' => array( 'keys' => array( 'elements', 'link' ) ),
				'heading' => array(
					'keys' => array(
						array( 'blocks', 'core/heading' ),
						array( 'elements', 'heading' ),
					),
				),
				'h1' => array( 'keys' => array( 'elements', 'h1' ) ),
				'h2' => array( 'keys' => array( 'elements', 'h2' ) ),
				'h3' => array( 'keys' => array( 'elements', 'h3' ) ),
				'h4' => array( 'keys' => array( 'elements', 'h4' ) ),
				'h5' => array( 'keys' => array( 'elements', 'h5' ) ),
				'h6' => array( 'keys' => array( 'elements', 'h6' ) ),
			);

			foreach ($element_settings as $element => $settings ) {
				$keys = array( 'normal' => $settings[ 'keys' ] );
				if ( isset( $settings[ 'hover-keys' ] ) ) {
					$keys[ 'hover' ] = $settings[ 'hover-keys' ];
				}

				foreach( $keys as $state => $key ) {
					$selector = $state == 'hover' ? "$element-hover" : $element;

					// add style declarations
					$style_declarations = $this->get_declarations( $styles, $style_declarations, $selector, $key );

					// remove properties from style declarations
					if ( isset( $settings[ 'remove_properties' ] ) ) {
						$style_declarations = $this->remove_properties( $style_declarations, $settings[ 'remove_properties' ], $selector );
					}

					// remove all properties except those specified in $settings[ 'get_properties' ]
					if ( isset( $settings[ 'get_properties' ] ) ) {
						$style_declarations = $this->remove_all_properties_except( $style_declarations, $settings[ 'get_properties' ], $selector );
					}

					// add css custom properties
					if ( isset( $settings[ 'set_custom_properties' ] ) ) {
						$custom_properties_selector = $state == 'hover' ? $settings[ 'custom_properties_selector_hover' ] : $settings[ 'custom_properties_selector' ];
						$style_declarations = $this->add_custom_properties( $style_declarations, $settings[ 'set_custom_properties' ], $custom_properties_selector, $selector );
					}
				}
			}
			$styles = array();

			// remove the keys from $style_declarations
			foreach( $style_declarations as $key => $declaration ) {
				$styles[] = $declaration;
			}

			$generated_css = wp_style_engine_get_stylesheet_from_css_rules( $styles );
			if ( $generated_css ) {
				$generated_css = "/* Block style inheritance */\n" . $generated_css;
			}

			// Keep the hash and block style inheritance CSS in the cache.
			set_transient( 'stackable_block_style_inheritance_hash', $hash, 60 * 60 * 24 );
			set_transient( 'stackable_block_style_inheritance_css', $generated_css, 60 * 60 * 24 );

			$current_css .= $generated_css;

			return apply_filters( 'stackable_frontend_css' , $current_css );
		}

		/**
		 * Add a class in the body to indicate if it stackable blocks will inherit styles from theme.json
		 */
		function add_body_class_block_style_inheritance( $classes ) {
			$disable_block_style_inheritance = get_option( 'stackable_disable_block_style_inheritance' );
			if ( ! $disable_block_style_inheritance ) {
				$classes[] = 'stk-has-block-style-inheritance';
			}
			return $classes;
		}

		/**
		 * Some themes uses color-mix in their theme.json file.
		 * This allows us to inherit the styles that uses color-mix.
		 *
		 * Below is the identical test performed in wp-includes/kses.php:2659
		 * @see wp-includes/kses.php
		 */
		function allow_css( $allow_css, $css_test_string ) {
			/**
			 * Allow CSS functions like color-mix(). by removing them from the test string.
			 * Nested functions and parentheses are also removed, so long as the parentheses are balanced.
			 */
			$css_test_string = preg_replace(
				'/\b(?:color-mix)(\((?:[^()]|(?1))*\))/',
				'',
				$css_test_string
			);
			/*
			 * Disallow CSS containing \ ( & } = or comments, except for within url(), var(), calc(), etc.
			 * which were removed from the test string above.
			 */
			$allow_css = ! preg_match( '%[\\\(&=}]|/\*%', $css_test_string );
			return $allow_css;
		}

		/**
		 * Helper function to safely traverse a nested associative array using an array of keys.
		 * Returns null if any key in the path doesn't exist.
		 *
		 * @param array $arr The array to traverse
		 * @param array $keys Array of keys representing the path to traverse
		 * @return mixed The value at the end of the path, or null if path is invalid
		 */
		function get_value( $arr, $keys ) {
			foreach ( $keys as $key ) {
				if ( ! isset( $arr[ $key ] ) ) {
					return null;
				}
				$arr = $arr[ $key ];
			}
			return $arr;
		}

		/**
		 * Adds CSS custom properties to style declarations.
		 *
		 * @param array $style_declarations 	Array of style declarations to modify
		 * @param array $custom_properties 		Mapping of css properties to custom property names
		 * @param string $selector 				a key in $style_declarations where the custom properties will be added to
		 * @param string $element 				a key in $style_declarations to get the values from
		 * @return array Modified style declarations with added custom properties
		 */
		function add_custom_properties( $style_declarations, $custom_properties, $selector, $element ) {
			$element_declarations = $style_declarations[ $element ][ 'declarations' ];

			// add a CSS custom property from `color`
			if ( isset( $custom_properties['color'] ) && isset( $element_declarations['color'] ) ) {
				$color_custom_properties = is_array( $custom_properties[ 'color' ] ) ? $custom_properties[ 'color' ] : array( $custom_properties[ 'color' ] );

				foreach ($color_custom_properties as $custom_property ) {
					$style_declarations[ $selector ][ 'declarations' ][ $custom_property ] = $element_declarations[ 'color' ];
				}
			}

			// add a CSS custom property from `background` or `background-color`
			if ( isset( $custom_properties['background'] ) && (
				isset( $element_declarations[ 'background' ] ) || isset( $element_declarations[ 'background-color' ] )
			) ) {
				$background_value = $element_declarations[ 'background' ] ?? $element_declarations[ 'background-color' ];

				$background_custom_properties = is_array( $custom_properties[ 'background' ] ) ? $custom_properties['background'] : array( $custom_properties['background'] );

				foreach ($background_custom_properties as $custom_property ) {
					$style_declarations[ $selector ][ 'declarations' ][ $custom_property ] = $background_value;
				}

				unset( $style_declarations[ $element ][ 'declarations' ][ 'background' ] );
				unset( $style_declarations[ $element ][ 'declarations' ][ 'background-color' ] );
			}

			// add a CSS custom property from `border-width`
			if ( isset( $custom_properties['border-width'] ) && isset( $element_declarations[ 'border-width' ] ) ) {
				$border_width_value = $element_declarations[ 'border-width' ];
				$style_declarations[ $selector ][ 'declarations' ][ $custom_properties['border-width'] ] = $border_width_value;
				unset( $style_declarations[ $element ][ 'declarations' ][ 'border-width' ] );
			}

			// add a CSS custom property from `padding`
			if ( isset( $custom_properties['padding'] ) &&
				isset( $element_declarations[ 'padding-top' ] ) &&
				isset( $element_declarations[ 'padding-bottom' ] ) &&
				isset( $element_declarations[ 'padding-left' ] ) &&
				isset( $element_declarations[ 'padding-right' ] )
			) {
				$padding_value = $element_declarations[ 'padding-top' ] . ' ' . $element_declarations[ 'padding-right' ] . ' ' . $element_declarations[ 'padding-bottom' ] . ' ' . $element_declarations[ 'padding-left' ];

				$style_declarations[ $selector ][ 'declarations' ][ $custom_properties['padding'] ] = $padding_value;

				unset( $style_declarations[ $element ][ 'declarations' ][ 'padding-top' ] );
				unset( $style_declarations[ $element ][ 'declarations' ][ 'padding-bottom' ] );
				unset( $style_declarations[ $element ][ 'declarations' ][ 'padding-left' ] );
				unset( $style_declarations[ $element ][ 'declarations' ][ 'padding-right' ] );
			}

			return $style_declarations;
		}

		/**
		 * Removes specified CSS properties from a selector's declarations in the $style_declarations array.
		 *
		 * @param array  $style_declarations 	The array containing all style declarations
		 * @param array  $properties         	Array of property names to remove
		 * @param string $selector          	The selector key to remove properties from
		 * @return array Modified style declarations with properties removed
		 */
		function remove_properties( $style_declarations, $properties, $selector ) {
			foreach( $properties as $property ) {
				if ( isset( $style_declarations[ $selector ][ 'declarations' ][ $property ] ) ) {
					unset( $style_declarations[ $selector ][ 'declarations' ][ $property ] );
				}
			}
			return $style_declarations;
		}

		/**
		 * Removes all properties from a selector's declarations except for the specified ones.
		 *
		 * @param array  $style_declarations 	The array containing all style declarations
		 * @param array  $properties         	Array of property names to keep
		 * @param string $selector          	The selector key to filter properties for
		 * @return array Modified style declarations with only specified properties kept
		 */
		function remove_all_properties_except( $style_declarations, $properties, $selector ) {
			$new_declarations = array();
			$properties_to_keep = array_flip( $properties );
			foreach( $style_declarations[ $selector ][ 'declarations' ] as $property => $value ) {
				if ( isset( $properties_to_keep[ $property ] ) ) {
					$new_declarations[ $property ] = $value;
				}
			}
			$style_declarations[ $selector ][ 'declarations' ] = $new_declarations;
			return $style_declarations;
		}

		/**
		 * Gets style declarations for an element from the theme.json styles data.
		 *
		 * @param array  $styles             The raw styles data from theme.json
		 * @param array  $style_declarations The array containing all style declarations
		 * @param string $element            The key in $style_declarations where the styles will be stored
		 * @param array  $element_keys       Keys to look up in the styles array. Can be a single array of keys
		 *                                   or an array of arrays for multiple lookups to merge
		 * @return array Modified style declarations with new declarations added
		 */
		function get_declarations( $styles, $style_declarations, $element, $element_keys ) {
			// If $element_keys is an array of arrays (e.g., merging styles from elements/button and core/button)
			if ( is_array( $element_keys[ 0 ] ) ) {
				$element_declarations = array();

				foreach( $element_keys as $keys ) {
					$element_styles = $this->get_value( $styles, $keys );

					$rendered_styles = wp_style_engine_get_styles( $element_styles );
					if ( ! $rendered_styles ) {
						continue;
					}
					$element_declarations[] = $rendered_styles[ 'declarations' ];
				}

				if ( count( $element_declarations ) == 0 ) {
					return $style_declarations;
				}

				$merged_declarations = array_merge( ...$element_declarations );

				$style_declarations[ $element ][ 'declarations' ] = $merged_declarations;
			// If $element_keys is a single arrray of keys
			} else {
				$element_styles = $this->get_value( $styles, $element_keys );
				$rendered_styles = wp_style_engine_get_styles( $element_styles );
				if ( ! $rendered_styles ) {
					return $style_declarations;
				}

				$style_declarations[ $element ][ 'declarations' ] = $rendered_styles[ 'declarations' ];
			}

			return $style_declarations;
		}
	}

	new Stackable_Block_Style_Inheritance();
}
