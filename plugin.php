<?php
/**
 * Plugin Name: Stackable - Gutenberg Blocks
 * Plugin URI: https://wpstackable.com
 * Description: Blocks for everyone
 * Author: Gambit Technologies, Inc
 * Author URI: http://gambit.ph
 * Text Domain: stackable-ultimate-gutenberg-blocks
 * Version: 1.17.3
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
defined( 'STACKABLE_VERSION' ) || define( 'STACKABLE_VERSION', '1.17.3' );
defined( 'STACKABLE_FILE' ) || define( 'STACKABLE_FILE', __FILE__ );
defined( 'STACKABLE_I18N' ) || define( 'STACKABLE_I18N', 'stackable-ultimate-gutenberg-blocks' ); // Plugin slug.

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
		if ( version_compare( PHP_VERSION, '5.3.0', '<' ) ) {
			deactivate_plugins( basename( __FILE__ ) );
			wp_die(
				sprintf(
					__( '%s"Stackable" can not be activated. %s It requires PHP version 5.3.0 or higher, but PHP version %s is used on the site. Please upgrade your PHP version first ✌️ %s Back %s', STACKABLE_I18N ),
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
if ( version_compare( PHP_VERSION, '5.3.0', '<' ) ) {
	if ( ! function_exists( 'stackable_php_requirement_notice' ) ) {
		function stackable_php_requirement_notice() {
	        printf(
	            '<div class="notice notice-error"><p>%s</p></div>',
	            sprintf( __( '"Stackable" requires PHP version 5.3.0 or higher, but PHP version %s is used on the site.', STACKABLE_I18N ), PHP_VERSION )
	        );
		}
	}
	add_action( 'admin_notices', 'stackable_php_requirement_notice' );
	return;
}

/********************************************************************************************
 * END Activation & PHP version checks.
 ********************************************************************************************/

/**
 * Freemius.
 * This needs to be first.
 */
require_once( plugin_dir_path( __FILE__ ) . 'freemius.php' );

/**
 * Block Initializer.
 */
require_once( plugin_dir_path( __FILE__ ) . 'src/block/disabled-blocks.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/init-deprecated.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/init.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/block/blog-posts/index.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/block/blog-posts/designs.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/pro.php' );

/**
 * Welcome screen.
 */
require_once( plugin_dir_path( __FILE__ ) . 'src/welcome/index.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/welcome/news.php' );
// require_once( plugin_dir_path( __FILE__ ) . 'src/welcome/updates.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/welcome/notification.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/welcome/notification-rate.php' );
// require_once( plugin_dir_path( __FILE__ ) . 'src/welcome/notification-updates.php' );

if ( sugb_fs()->is__premium_only() ) {
	/**
	 * Premium initialize code.
	 */
	if ( file_exists( plugin_dir_path( __FILE__ ) . 'pro__premium_only/index.php' ) ) {
		require_once( plugin_dir_path( __FILE__ ) . 'pro__premium_only/index.php' );
	}
}
