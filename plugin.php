<?php
/**
 * Plugin Name: Stackable - Gutenberg Blocks
 * Plugin URI: https://wpstackable.com
 * Description: An Amazing Block Library That Lets You Reimagine the Way You Use the WordPress Block Editor (Gutenberg).
 * Author: Gambit Technologies, Inc
 * Author URI: http://gambit.ph
 * Text Domain: stackable-ultimate-gutenberg-blocks
 * Version: 3.13.12
 *
 * @package Stackable
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Freemius SDK: Auto deactivate the free version when activating the paid one.
if ( function_exists( 'sugb_fs' ) ) {
	sugb_fs()->set_basename( true, __FILE__ );
	return;
}

defined( 'STACKABLE_SHOW_PRO_NOTICES' ) || define( 'STACKABLE_SHOW_PRO_NOTICES', true );
defined( 'STACKABLE_BUILD' ) || define( 'STACKABLE_BUILD', 'free' );
defined( 'STACKABLE_VERSION' ) || define( 'STACKABLE_VERSION', '3.13.12' );
defined( 'STACKABLE_FILE' ) || define( 'STACKABLE_FILE', __FILE__ );
defined( 'STACKABLE_I18N' ) || define( 'STACKABLE_I18N', 'stackable-ultimate-gutenberg-blocks' ); // Plugin slug.
defined( 'STACKABLE_DESIGN_LIBRARY_URL' ) || define( 'STACKABLE_DESIGN_LIBRARY_URL', 'https://storage.googleapis.com/stackable-plugin-assets' ); // Design Library CDN URL

/********************************************************************************************
 * Activation & PHP version checks.
 ********************************************************************************************/

if ( ! function_exists( 'stackable_php_requirement_activation_check' ) ) {

	/**
	 * Upon activation, check if we have the proper PHP version.
	 * Show an error if needed and don't continue with the plugin.
	 *
	 * @since 1.9
	 */
	function stackable_php_requirement_activation_check() {
		if ( version_compare( PHP_VERSION, '7.3.0', '<' ) ) {
			deactivate_plugins( basename( __FILE__ ) );
			wp_die(
				sprintf(
					esc_html__( '%s"Stackable" can not be activated. %s It requires PHP version 7.3.0 or higher, but PHP version %s is used on the site. Please upgrade your PHP version first ✌️ %s Back %s', STACKABLE_I18N ),
					'<strong>',
					'</strong><br><br>',
					PHP_VERSION,
					'<br /><br /><a href="' . esc_url( get_dashboard_url( get_current_user_id(), 'plugins.php' ) ) . '" class="button button-primary">',
					'</a>'
				)
			);
		}
	}
	register_activation_hook( __FILE__, 'stackable_php_requirement_activation_check' );
}

/**
 * Always check the PHP version at the start.
 * If the PHP version isn't sufficient, don't continue to prevent any unwanted errors.
 *
 * @since 1.9
 */
if ( version_compare( PHP_VERSION, '7.3.0', '<' ) ) {
	if ( ! function_exists( 'stackable_php_requirement_notice' ) ) {
		function stackable_php_requirement_notice() {
	        printf(
	            '<div class="notice notice-error"><p>%s</p></div>',
	            sprintf( esc_html__( '"Stackable" requires PHP version 7.3.0 or higher, but PHP version %s is used on the site.', STACKABLE_I18N ), PHP_VERSION )
	        );
		}
	}
	add_action( 'admin_notices', 'stackable_php_requirement_notice' );
	return;
}

/**
 * Always keep note of the Stackable version.
 *
 * @since 2.0
 */
if ( ! function_exists( 'stackable_version_upgrade_check' ) ) {
	function stackable_version_upgrade_check() {
		// This is triggered only when V1 was previously activated, and this is the first time V2 is activated.
		// Will not trigger after successive V2 activations.
		if ( get_option( 'stackable_activation_date' ) && ! get_option( 'stackable_current_version_installed' ) ) {
			update_option( 'stackable_current_version_installed', '1', 'no' );
		}

		// Always check the current version installed. Trigger if it changes.
		if ( get_option( 'stackable_current_version_installed' ) !== STACKABLE_VERSION ) {
			do_action( 'stackable_version_upgraded', get_option( 'stackable_current_version_installed' ), STACKABLE_VERSION );
			update_option( 'stackable_current_version_installed', STACKABLE_VERSION, 'no' );
		}
	}
	add_action( 'admin_menu', 'stackable_version_upgrade_check', 1 );
}

/**
 * Allow early version upgrade processes.
 *
 * @since 3.10.2
 */
if ( ! function_exists( 'stackable_early_version_upgrade_check' ) ) {
	function stackable_early_version_upgrade_check() {
		// Always check the current version installed. Trigger if it changes.
		if ( get_option( 'stackable_current_version_installed' ) !== STACKABLE_VERSION ) {
			if ( is_admin() ) {
				do_action( 'stackable_early_version_upgraded', get_option( 'stackable_current_version_installed' ), STACKABLE_VERSION );
			} else {
				do_action( 'stackable_early_version_upgraded_frontend', get_option( 'stackable_current_version_installed' ), STACKABLE_VERSION );
			}
		}
	}
	add_action( 'init', 'stackable_early_version_upgrade_check', 1 );
}

/**
 * If Gutenberg plugin is activated, add a notice to disable it since it may cause issues.
 *
 * @since 2.11.4
 */
if ( ! function_exists( 'stackable_notice_gutenberg_plugin_activated' ) ) {
	function stackable_notice_gutenberg_plugin_activated() {
		if ( is_plugin_active( 'gutenberg/gutenberg.php' ) ) {
			$ignore = get_option( 'stackable_notice_gutenberg_plugin_ignore' );
			if ( ! $ignore ) {
				printf(
					'<div class="notice notice-warning is-dismissible stackable_notice_gutenberg_plugin"><p>%s</p>%s</div>',
					sprintf( esc_html__( '%sStackable Notice%s: We noticed that the Gutenberg plugin is active! Please be aware the Gutenberg plugin is used to try out the new Block Editor features, and Stackable might not be compatible with it. Click the close button on the side to dismiss this notice.', STACKABLE_I18N ), '<strong>', '</strong>' ),
					'<script>( function() {
						document.body.addEventListener( "click", function( event ) {
							if( event.target.matches( ".notice.stackable_notice_gutenberg_plugin button.notice-dismiss" ) ) {
								wp.ajax.post( "stackable_notice_gutenberg_plugin_ignore" );
							}
						} );
					} )();
					</script>'
				);
			}
		}
	}

	if ( defined( 'GUTENBERG_VERSION' ) ) {
		add_action( 'admin_notices', 'stackable_notice_gutenberg_plugin_activated' );
	}
}

if ( ! function_exists( 'stackable_notice_gutenberg_plugin_ignore' ) ) {
	function stackable_notice_gutenberg_plugin_ignore() {
		update_option( 'stackable_notice_gutenberg_plugin_ignore', true );
	}
	add_action( 'wp_ajax_stackable_notice_gutenberg_plugin_ignore', 'stackable_notice_gutenberg_plugin_ignore' );
}

/********************************************************************************************
 * END Activation & PHP version checks.
 ********************************************************************************************/

/********************************************************************************************
 * Deactivation & cleanup
 ********************************************************************************************/

 if ( ! function_exists( 'stackable_deactivation_cleanup' ) ) {

	/**
	 * Upon deactivation, delete some Stackable database entries which are no
	 * longer needed (even if re-activating).
	 *
	 * @since 3.7.1
	 */
	function stackable_deactivation_cleanup() {
		// Delete deprecated cached dynamic content auto-detected fields.
		delete_option( 'stackable_dynamic_content_other_fields_frontend' );
		// Delete cached dynamic content auto-detected fields.
		delete_option( 'stackable_dynamic_content_meta_keys_frontend' );
		// Delete old v2 go premium notice status.
		delete_option( 'stackable_inspector_premium_notice_status' );
		// Delete old Navigation Panel setting.
		delete_option( 'stackable_enable_navigation_panel' );
		// Delete stored signatures for display conditions
		delete_option( 'stackable_custom_php_sigs' );
		delete_option( 'stackable_disp_cond_custom_php_sigs' );
	}
	register_deactivation_hook( __FILE__, 'stackable_deactivation_cleanup' );
}

/********************************************************************************************
 * END Deactivation & cleanup
 ********************************************************************************************/

if ( ! function_exists( 'is_frontend' ) ) {
	/**
	 * Check if we are in the frontend.
	 *
	 * @since 3.13.0
	 *
	 * @return bool
	 */
	function is_frontend() {
		return ! is_admin() && ! wp_is_json_request();
	}
}

/**
 * Freemius.
 * This needs to be first.
 */
require_once( plugin_dir_path( __FILE__ ) . 'freemius.php' );

/**
 * Block Initializer.
 */
require_once( plugin_dir_path( __FILE__ ) . 'src/editor-settings.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/init.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/stk-block-types.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/blocks.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/fonts.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/icons.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/unique-id.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/block/posts/index.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/pro.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/jetpack.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/multisite.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/kses.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/dynamic-breakpoints.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/design-library/init.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/global-settings.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/custom-block-styles.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/css-optimize.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/compatibility/index.php' );
if ( ! is_admin() ) {
	require_once( plugin_dir_path( __FILE__ ) . 'src/lightbox/index.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/block/accordion/index.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/block/carousel/index.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/block/count-up/index.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/block/countdown/index.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/block/expand/index.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/block/notification/index.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/block/video-popup/index.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/block/table-of-contents/index.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/block/map/index.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/block/progress-bar/index.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/block/progress-circle/index.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/block/horizontal-scroller/index.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/block/tabs/index.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/block-components/alignment/index.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/block/columns/index.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/block/timeline/index.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/block/icon-label/deprecated.php' );
}

/**
 * Welcome screen.
 */
if ( is_admin() ) {
	require_once( plugin_dir_path( __FILE__ ) . 'src/welcome/index.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/welcome/news.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/welcome/freemius.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/welcome/updates.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/welcome/notification.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/welcome/notification-rate.php' );
}

if ( sugb_fs()->is__premium_only() ) {
	if ( STACKABLE_BUILD === 'premium' ) {
		/**
		 * Premium initialize code.
		 */
		if ( file_exists( plugin_dir_path( __FILE__ ) . 'pro__premium_only/index.php' ) ) {
			require_once( plugin_dir_path( __FILE__ ) . 'pro__premium_only/index.php' );
		}
	}
}

// Deprecated.
require_once( plugin_dir_path( __FILE__ ) . 'src/deprecated/native-global-colors.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/deprecated/navigation-panel-pre-enabled.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/deprecated/font-awesome-version.php' );

/**
 * V2 Deprecated
 */
require_once( plugin_dir_path( __FILE__ ) . 'src/deprecated/v2/init.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/deprecated/v2/blocks.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/deprecated/v2/disabled-blocks.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/deprecated/v2/design-library/init.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/deprecated/v2/admin.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/deprecated/v2/optimization-settings.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/deprecated/v2/global-settings.php' );
