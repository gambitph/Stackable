<?php
/**
 * FontAwesome icons v5.15.4 is used in v3.12.6 and below.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_font_awesome_icons_version_set_default' ) ) {

	/**
	 * When upgrading to v3.12.7 and above, use FontAwesome icons v5.15.4 by default.
	 * If new installation, use FontAwesome icons v6.5.1.
	 *
	 */
	function stackable_font_awesome_icons_version_set_default( $old_version, $new_version ) {
		if ( ! empty( $old_version ) && version_compare( $old_version, "3.12.7", "<" ) ) {
			// Use FontAwesome icons v5.15.4 for users upgrading from v3.12.6 and below.
			if ( ! get_option( 'stackable_icons_fa_free_version' ) || get_option( 'stackable_icons_fa_free_version' ) === '5.15.4' ) {
				update_option( 'stackable_icons_fa_free_version', '5.15.4', 'no' );
			}
		}
	}
	add_action( 'stackable_early_version_upgraded', 'stackable_font_awesome_icons_version_set_default', 10, 2 );
}
