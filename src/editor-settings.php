<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Editor_Settings' ) ) {
	class Stackable_Editor_Settings {

		/**
		 * Add our hooks.
		 */
		function __construct() {
			// Register settings.
			add_action( 'admin_init', array( $this, 'register_settings' ) );
			add_action( 'rest_api_init', array( $this, 'register_settings' ) );

			// Make our settings available in the editor.
			add_filter( 'stackable_js_settings', array( $this, 'add_settings' ) );

			// Add block nested widths CSS.
			add_action( 'stackable_inline_styles', array( $this, 'add_nested_block_width' ) );
			add_action( 'stackable_inline_editor_styles', array( $this, 'add_nested_block_width' ) );
		}

		/**
		 * Register the setting.
		 *
		 * @return void
		 */
		public function register_settings() {
			register_setting(
				'stackable_editor_settings',
				'stackable_disabled_blocks',
				array(
					'type' => 'array',
					'description' => __( 'Blocks that should be hidden in the block editor', STACKABLE_I18N ),
					'sanitize_callback' => array( $this, 'sanitize_array_setting' ),
					'show_in_rest' => array(
						'schema' => array(
							'items' => array(
								'type' => 'string',
							)
						)
					),
					'default' => array(),
				)
			);

			register_setting(
				'stackable_editor_settings',
				'stackable_google_maps_api_key',
				array(
					'type' => 'string',
					'description' => __( 'Enables additional customization options for the Map Block.', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);

			register_setting(
				'stackable_editor_settings',
				'stackable_enable_design_library',
				array(
					'type' => 'boolean',
					'description' => __( 'Hides the Stackable Design Library button on the top of the editor', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => true,
				)
			);

			register_setting(
				'stackable_editor_settings',
				'stackable_optimize_inline_css',
				array(
					'type' => 'boolean',
					'description' => __( 'Optimizes inlined CSS styles, combines together similar selectors', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => true,
				)
			);

			register_setting(
				'stackable_editor_settings',
				'stackable_block_default_width',
				array(
					'type' => 'string',
					'description' => __( 'The width used when a Columns block has its Content Width set to center.', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);

			register_setting(
				'stackable_editor_settings',
				'stackable_block_wide_width',
				array(
					'type' => 'string',
					'description' => __( 'The width used when a Columns block has its Content Width set to wide.', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);

			register_setting(
				'stackable_editor_settings',
				'stackable_auto_collapse_panels',
				array(
					'type' => 'boolean',
					'description' => __( 'Collapse other inspector panels when opening another, keeping only one open at a time.', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => true,
				)
			);

			register_setting(
				'stackable_editor_settings',
				'stackable_enable_block_linking',
				array(
					'type' => 'boolean',
					'description' => __( 'Gives you the ability to link columns. Any changes you make on one column will automatically get applied on the other columns.', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => false,
				)
			);

			register_setting(
				'stackable_editor_settings',
				'stackable_help_tooltip_disabled',
				array(
					'type' => 'string',
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);

			register_setting(
				'stackable_editor_settings',
				'stackable_enable_carousel_lazy_loading',
				array(
					'type' => 'boolean',
					'description' => __( 'Disables image lazy loading when using images inside carousel-type blocks to prevent space or layout issues .', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => true,
				)
			);
		}

		public function sanitize_array_setting( $input ) {
			return ! is_array( $input ) ? array( array() ) : $input;
		}

		/**
		 * Make our settings available in the editor.
		 *
		 * @param Array $settings
		 * @return Array Settings array to be loaded in the editor.
		 */
		public function add_settings( $settings ) {
			$settings['stackable_google_maps_api_key'] = get_option( 'stackable_google_maps_api_key' );
			$settings['stackable_disabled_blocks'] = get_option( 'stackable_disabled_blocks' );
			$settings['stackable_enable_design_library'] = get_option( 'stackable_enable_design_library' );
			$settings['stackable_optimize_inline_css'] = get_option( 'stackable_optimize_inline_css' );
			$settings['stackable_auto_collapse_panels'] = get_option( 'stackable_auto_collapse_panels' );
			$settings['stackable_enable_block_linking'] = get_option( 'stackable_enable_block_linking' );
			$settings['stackable_enable_carousel_lazy_loading'] = get_option( 'stackable_enable_carousel_lazy_loading' );
			return $settings;
		}

		/**
		 * Add styles for the block nested widths.
		 *
		 * @param String $css
		 * @return String CSS to be added.
		 */
		public function add_nested_block_width( $css ) {
			$default_width = get_option( 'stackable_block_default_width' );
			$wide_width = get_option( 'stackable_block_wide_width' );

			if ( ! empty( $default_width ) || ! empty( $wide_width ) ) {
				$css .= ':root {';
					if ( ! empty( $default_width ) ) {
						$default_width .= is_numeric( $default_width ) ? 'px' : '';
						$css .= '--stk-block-default-width: ' . esc_attr( $default_width ) . ';';
					}
					if ( ! empty( $wide_width ) ) {
						$wide_width .= is_numeric( $wide_width ) ? 'px' : '';
						$css .= '--stk-block-wide-width: ' . esc_attr( $wide_width ) . ';';
					}

					$css .= '}';
			}

			return $css;
		}
	}

	new Stackable_Editor_Settings();
}
