<?php
/**
 * Navigation panel was enabled by default in v3.10.1 and below.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_deprecated_navigation_panel_pre_enabled' ) ) {

	/**
	 * When upgrading to v3.10.2 and above, if the navigation panel was enabled, keep it enabled.
	 *
	 * @since 3.10.2
	 */
	function stackable_deprecated_navigation_panel_pre_enabled( $old_version, $new_version ) {
		if ( ! empty( $old_version ) && version_compare( $old_version, "3.10.2", "<" ) ) {
			// If the option was left as default (enabled), enable it because we changed the default to disabled.
			if ( get_option( 'stackable_enable_navigation_panel' ) === false ) {
				update_option( 'stackable_enable_navigation_panel', '1', 'no' ); // Enable the navigation panel
			}
		}
	}
	add_action( 'stackable_early_version_upgraded', 'stackable_deprecated_navigation_panel_pre_enabled', 10, 2 );
}
