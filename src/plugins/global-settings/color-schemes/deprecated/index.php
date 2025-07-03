<?php
/**
 * This makes the color scheme inheritance broken.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_global_color_schemes_container_color_scheme_inheritance_deprecation' ) ) {

	function stackable_global_color_schemes_container_color_scheme_inheritance_deprecation( $styles ) {
		if ( get_option( 'stackable_use_v3_16_0_color_scheme_inheritance' ) ) {
			return [];
		}

		return $styles;
	}

	add_filter( 'stackable.global-settings.global-color-schemes.default-container-scheme', 'stackable_global_color_schemes_container_color_scheme_inheritance_deprecation' );
}
