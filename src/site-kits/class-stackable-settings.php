<?php
/**
 * Shared Stackable settings contract for Site Kit export and import.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Stackable_Settings' ) ) {
	class Stackable_Site_Kit_Stackable_Settings {

		/**
		 * Return the portable Stackable option allowlist.
		 *
		 * @return string[]
		 */
		public static function option_names() {
			$option_names = array(
				'stackable_global_hide_theme_colors',
				'stackable_global_hide_default_colors',
				'stackable_global_hide_site_editor_colors',
				'stackable_global_typography_apply_to',
				'stackable_global_force_typography',
				'stackable_selected_font_pair',
				'stackable_custom_font_pairs',
				'stackable_use_typography_as_presets',
				'stackable_is_apply_body_to_html',
				'stackable_icon_library',
				'stackable_global_buttons_and_icons',
				'stackable_global_custom_preset_controls',
				'stackable_global_hide_color_scheme_colors',
				'stackable_global_base_color_scheme',
				'stackable_global_background_mode_color_scheme',
				'stackable_global_container_mode_color_scheme',
				'stackable_use_size_presets_by_default',
				'stackable_global_block_styles',
			);

			$option_names = apply_filters( 'stackable_site_kit_export_stackable_option_names', $option_names );
			return array_values( array_unique( array_filter( $option_names, 'is_string' ) ) );
		}

		/**
		 * Convert portable design-system groups into their existing option shapes.
		 *
		 * @param array $design_system Portable design-system values.
		 * @return array
		 */
		public static function design_system_options( $design_system ) {
			return array(
				'stackable_global_colors' => array( isset( $design_system['colors'] ) ? $design_system['colors'] : array() ),
				'stackable_global_color_schemes' => array_values( isset( $design_system['colorSchemes'] ) ? $design_system['colorSchemes'] : array() ),
				'stackable_global_typography' => array( isset( $design_system['typography'] ) ? $design_system['typography'] : array() ),
				'stackable_global_spacing_and_borders' => isset( $design_system['spacing'] ) ? $design_system['spacing'] : array(),
			);
		}
	}
}
