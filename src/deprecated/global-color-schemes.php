<?php
/**
 * Global Color Schemes has a bug in v3.16.0-v3.16.2
 * We added an option that allows users to use the v3.16.0 color scheme inheritance (broken)
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_global_color_schemes_set_color_scheme_inheritance' ) ) {

	/**
	 * When upgrading to v3.16.3 and above, check if the default container scheme is empty.
	 * If so, update the option to true -- keep the borken color scheme inheritance.
	 * Otherwise, it will use the fixed color scheme inheritance.
	 */
	function stackable_global_color_schemes_set_color_scheme_inheritance( $old_version, $new_version ) {
		if ( ! empty( $old_version ) && version_compare( $old_version, "3.16.3", "<" ) ) {
			$color_schemes = Stackable_Global_Color_Schemes::get_color_schemes_array();

			// If there are no color schemes, do nothing
			if ( ! $color_schemes ) {
				return;
			}

			$container_default = isset( $color_schemes[ get_option( 'stackable_global_container_mode_color_scheme' ) ] )  ? get_option( 'stackable_global_container_mode_color_scheme' ) : 'scheme-default-1';

			if ( Stackable_Global_Color_Schemes::is_scheme_empty( $color_schemes[ $container_default ] ) ) {
				update_option( 'stackable_use_v3_16_0_color_scheme_inheritance', true, 'no' );
			}
		}
	}
	add_action( 'stackable_early_version_upgraded', 'stackable_global_color_schemes_set_color_scheme_inheritance', 10, 2 );
}
