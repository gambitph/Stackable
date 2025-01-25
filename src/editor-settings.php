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
				'stackable_block_states',
				// Use an object to store the block names as keys and the value that represents if disabled or hidden.
				// Enabled blocks are not stored in the object to save memory.
				array(
					'type' => 'object',
					'description' => __( 'Blocks that should be hidden in the block editor', STACKABLE_I18N ),
					'sanitize_callback' => array( $this, 'sanitize_array_setting' ),
					'show_in_rest' => array(
						'schema' => array(
							'type' => 'object',
							'additionalProperties' => array(
								'type' => 'number',
							),
						),
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
				'stackable_enable_global_settings',
				array(
					'type' => 'boolean',
					'description' => __( 'Allow the configuration of global settings such as color palette, typography, and block defaults', STACKABLE_I18N ),
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

			register_setting(
				'stackable_editor_settings',
				'stackable_enable_text_highlight',
				array(
					'type' => 'boolean',
					'description' => __( 'Adds a toolbar button for highlighting text', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => true,
				)
			);

			register_setting(
				'stackable_editor_settings',
				'stackable_enable_dynamic_content',
				array(
					'type' => 'boolean',
					'description' => __( 'Adds a toolbar button for inserting dynamic content', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => true,
				)
			);

			register_setting(
				'stackable_editor_settings',
				'stackable_enable_copy_paste_styles',
				array(
					'type' => 'boolean',
					'description' => __( 'Adds a toolbar button for copying and pasting block styles', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => true,
				)
			);

			register_setting(
				'stackable_editor_settings',
				'stackable_enable_reset_layout',
				array(
					'type' => 'boolean',
					'description' => __( 'Adds a toolbar button for resetting the layout of a block', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => true,
				)
			);

			register_setting(
				'stackable_editor_settings',
				'stackable_enable_save_as_default_block',
				array(
					'type' => 'boolean',
					'description' => __( 'Adds a toolbar button for saving the current block variation as the default block', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => true,
				)
			);

			register_setting(
				'stackable_editor_settings',
				'stackable_enable_text_default_block',
				array(
					'type' => 'boolean',
					'description' => __( 'If this is enabled, the default block when adding a new block will be the Stackable Text block.', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => false,
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
			$settings['stackable_block_states'] = get_option( 'stackable_block_states' );
			$settings['stackable_enable_design_library'] = get_option( 'stackable_enable_design_library' );
			$settings['stackable_optimize_inline_css'] = get_option( 'stackable_optimize_inline_css' );
			$settings['stackable_auto_collapse_panels'] = get_option( 'stackable_auto_collapse_panels' );
			$settings['stackable_enable_global_settings'] = get_option( 'stackable_enable_global_settings' );
			$settings['stackable_enable_block_linking'] = get_option( 'stackable_enable_block_linking' );
			$settings['stackable_enable_carousel_lazy_loading'] = get_option( 'stackable_enable_carousel_lazy_loading' );
			$settings['stackable_enable_text_highlight'] = get_option( 'stackable_enable_text_highlight' );
			$settings['stackable_enable_dynamic_content'] = get_option( 'stackable_enable_dynamic_content' );
			$settings['stackable_enable_copy_paste_styles'] = get_option( 'stackable_enable_copy_paste_styles' );
			$settings['stackable_enable_reset_layout'] = get_option( 'stackable_enable_reset_layout' );
			$settings['stackable_enable_save_as_default_block'] = get_option( 'stackable_enable_save_as_default_block' );
			$settings['stackable_enable_text_default_block'] = get_option( 'stackable_enable_text_default_block' );

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
