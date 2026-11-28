<?php
/**
 * Plugin Name: Stackable - Gutenberg Blocks
 * Plugin URI: https://wpstackable.com
 * Description: The complete website builder for the WordPress block editor. Build professional sites faster with powerful blocks, block styles, and a global design system.
 * Author: Gambit Technologies, Inc
 * Author URI: http://gambit.ph
 * Text Domain: stackable-ultimate-gutenberg-blocks
 * Version: 3.20.4
 *
 * @package Stackable
 * @fs_premium_only /freemius.php, /freemius/
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_multiple_plugins_check' ) ) {
	// Prevent multiple Stackable plugin versions from being active simultaneously.
	function stackable_multiple_plugins_check() {
		if ( is_plugin_active( $GLOBALS['OTHER_STACKABLE_FILE'] ) ) {
			deactivate_plugins( $GLOBALS['OTHER_STACKABLE_FILE'] );
		}
	}
}

if ( defined('STACKABLE_FILE') && STACKABLE_FILE !== __FILE__ && ! isset( $GLOBALS['OTHER_STACKABLE_FILE'] ) &&
	defined( 'STACKABLE_BUILD' ) && defined( 'STACKABLE_VERSION' ) ) {
	// Get relative file path of the other Stackable version.
	$GLOBALS['OTHER_STACKABLE_FILE'] = plugin_basename( STACKABLE_FILE );

	// Use a temporary option to store the other Stackable Plugin info needed for the admin notice. This will be deleted later.
	// Note: We cannot use add_action in the register_activation_hook callback so we use this temporary option.
	// See https://developer.wordpress.org/reference/functions/register_activation_hook/#process-flow for more info.
	add_option( 'stackable_other_stackable_plugin_info', [ 'BUILD' => STACKABLE_BUILD, 'VERSION' => STACKABLE_VERSION ] );

	register_activation_hook( __FILE__, 'stackable_multiple_plugins_check' );
}

// Freemius SDK: Auto deactivate the free version when activating the paid one.
if ( function_exists( 'sugb_fs' ) ) {
	sugb_fs()->set_basename( true, __FILE__ );
	return;
}

defined( 'STACKABLE_SHOW_PRO_NOTICES' ) || define( 'STACKABLE_SHOW_PRO_NOTICES', true );
defined( 'STACKABLE_BUILD' ) || define( 'STACKABLE_BUILD', 'free' );
defined( 'STACKABLE_VERSION' ) || define( 'STACKABLE_VERSION', '3.20.4' );
defined( 'STACKABLE_FILE' ) || define( 'STACKABLE_FILE', __FILE__ );
defined( 'STACKABLE_I18N' ) || define( 'STACKABLE_I18N', 'stackable-ultimate-gutenberg-blocks' ); // Plugin slug.
defined( 'STACKABLE_DESIGN_LIBRARY_URL' ) || define( 'STACKABLE_DESIGN_LIBRARY_URL', 'https://stackable-files.pages.dev' ); // Design Library CDN URL

/**
 * Whether this is a page view in the frontend (not the admin, AJAX, REST API,
 * cron or WP-CLI). Code only used outside the frontend isn't loaded here.
 *
 * @since 3.21.0
 */
if ( ! function_exists( 'stackable_is_frontend_request' ) ) {
	function stackable_is_frontend_request() {
		static $is_frontend = null;
		if ( $is_frontend === null ) {
			$uri = isset( $_SERVER['REQUEST_URI'] ) ? (string) $_SERVER['REQUEST_URI'] : ''; // phpcs:ignore
			$is_frontend = ! is_admin() && ! wp_doing_ajax() && ! wp_doing_cron() && ! ( defined( 'WP_CLI' ) && WP_CLI ) &&
				strpos( $uri, '/' . rest_get_url_prefix() . '/' ) === false && ! isset( $_GET['rest_route'] ) && // phpcs:ignore WordPress.Security.NonceVerification
				apply_filters( 'stackable_lazy_load', true );
		}
		return $is_frontend;
	}
}

/**
 * Load every saved Stackable option in one query so later get_option() calls
 * don't each hit the database.
 *
 * Stackable option names all start with `stackable_`. A new setting such as
 * `stackable_new_setting` is included automatically — there is no list to
 * keep in sync. Options that were never saved are remembered as missing the
 * first time they're requested, still without a second query (see
 * stackable_mark_unsaved_option()).
 *
 * Autoloaded options are already in WordPress's `alloptions` cache, so they
 * are skipped. Very large values (for example a custom icon library) are
 * also left alone, so a frontend page doesn't load them unless that page
 * actually needs them.
 *
 * WordPress transients use a `_transient_` prefix, so they would miss the
 * `stackable_` rule. The theme block-style inheritance transients are read
 * on the frontend (`get_transient( 'stackable_block_style_inheritance_css' )`
 * and `_hash`), so those two prefixes are included as well. Other transients
 * (for example the design library) are left for get_transient() to load when
 * needed.
 *
 * @since 3.21.0
 */
if ( ! function_exists( 'stackable_prime_option_caches' ) ) {

	/**
	 * Names this request already loaded from the options table (or saw in
	 * alloptions). Used so unsaved `stackable_*` options can be marked missing
	 * without a second query.
	 *
	 * @var array<string, true>
	 */
	$GLOBALS['stackable_primed_option_names'] = array();

	/**
	 * Whether this option name is covered by the prefix query above.
	 *
	 * @param string $option Option name.
	 * @return bool
	 */
	function stackable_is_primed_option_name( $option ) {
		if ( strpos( $option, 'stackable_' ) === 0 ) {
			return true;
		}
		// The inheritance transients (see stackable_prime_option_caches()).
		return strpos( $option, '_transient_stackable_block_style_inheritance_' ) === 0
			|| strpos( $option, '_transient_timeout_stackable_block_style_inheritance_' ) === 0;
	}

	/**
	 * When get_option() asks for a covered name we didn't find in the
	 * database, add it to WordPress's `notoptions` cache so the lookup
	 * returns the default without a query.
	 *
	 * This hook runs *before* get_option() checks `notoptions`. Returning
	 * false here means "keep looking" — we can't return the default
	 * ourselves because a false value is how WordPress says "no short
	 * circuit". After we add the name to `notoptions`, the rest of
	 * get_option() sees it and stops.
	 *
	 * If the option was added later in this same request, its value is
	 * already in the options cache and we leave it alone.
	 *
	 * @param mixed  $pre     Value already supplied by another filter, or false.
	 * @param string $option  Option name.
	 * @param mixed  $default Default passed to get_option() (unused).
	 * @return mixed
	 */
	function stackable_mark_unsaved_option( $pre, $option, $default = false ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter
		if ( false !== $pre || ! stackable_is_primed_option_name( $option ) ) {
			return $pre;
		}
		if ( ! empty( $GLOBALS['stackable_primed_option_names'][ $option ] ) ) {
			return $pre;
		}
		$alloptions = wp_load_alloptions();
		if ( isset( $alloptions[ $option ] ) ) {
			return $pre;
		}
		if ( false !== wp_cache_get( $option, 'options' ) ) {
			return $pre;
		}
		$notoptions = wp_cache_get( 'notoptions', 'options' );
		if ( ! is_array( $notoptions ) ) {
			$notoptions = array();
		}
		if ( ! isset( $notoptions[ $option ] ) ) {
			$notoptions[ $option ] = true;
			wp_cache_set( 'notoptions', $notoptions, 'options' );
		}
		return $pre;
	}

	function stackable_prime_option_caches() {
		global $wpdb;

		if ( ( function_exists( 'wp_installing' ) && wp_installing() ) || empty( $wpdb ) ) {
			return;
		}

		// A LIKE pattern of `stackable_` plus %, with `_` escaped so it is a
		// literal underscore (LIKE treats `_` as "any one character").
		$stackable_like = $wpdb->esc_like( 'stackable_' ) . '%';
		$transient_like = $wpdb->esc_like( '_transient_stackable_block_style_inheritance_' ) . '%';
		$timeout_like = $wpdb->esc_like( '_transient_timeout_stackable_block_style_inheritance_' ) . '%';

		$rows = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT option_name, option_value FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s OR option_name LIKE %s",
				$stackable_like,
				$transient_like,
				$timeout_like
			)
		);
		if ( ! is_array( $rows ) ) {
			$rows = array();
		}

		// 100 KB. Larger than color-scheme CSS and typography settings we
		// always want primed; smaller than a full custom icon library.
		$max_bytes = 100000;

		$alloptions = wp_load_alloptions();
		if ( ! is_array( $alloptions ) ) {
			$alloptions = array();
		}
		$notoptions = wp_cache_get( 'notoptions', 'options' );
		if ( ! is_array( $notoptions ) ) {
			$notoptions = array();
		}

		$to_cache = array();
		foreach ( $rows as $row ) {
			$name = $row->option_name;
			$value = $row->option_value;
			$GLOBALS['stackable_primed_option_names'][ $name ] = true;

			if ( isset( $alloptions[ $name ] ) ) {
				continue;
			}
			if ( isset( $notoptions[ $name ] ) ) {
				// The row exists, so a stale notoptions entry would hide it.
				unset( $notoptions[ $name ] );
				wp_cache_set( 'notoptions', $notoptions, 'options' );
			}
			if ( strlen( $value ) > $max_bytes ) {
				// Leave it for get_option() if this request actually needs it.
				unset( $GLOBALS['stackable_primed_option_names'][ $name ] );
				continue;
			}
			// Already in the individual options cache (same as
			// wp_prime_option_caches() skipping a cache hit).
			$cached = wp_cache_get( $name, 'options' );
			if ( false !== $cached ) {
				continue;
			}
			// Store the raw value. get_option() unserializes it later.
			$to_cache[ $name ] = $value;
		}

		if ( $to_cache ) {
			if ( function_exists( 'wp_cache_set_multiple' ) ) {
				wp_cache_set_multiple( $to_cache, 'options' );
			} else {
				foreach ( $to_cache as $name => $value ) {
					wp_cache_add( $name, $value, 'options' );
				}
			}
		}

		if ( function_exists( 'add_filter' ) && (
			! function_exists( 'has_filter' ) || ! has_filter( 'pre_option', 'stackable_mark_unsaved_option' )
		) ) {
			add_filter( 'pre_option', 'stackable_mark_unsaved_option', 10, 3 );
		}
	}
	stackable_prime_option_caches();
}

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
		if ( version_compare( PHP_VERSION, '7.4.0', '<' ) ) {
			deactivate_plugins( basename( __FILE__ ) );
			wp_die(
				sprintf(
					esc_html__( '%s"Stackable" can not be activated. %s It requires PHP version 7.4.0 or higher, but PHP version %s is used on the site. Please upgrade your PHP version first ✌️ %s Back %s', STACKABLE_I18N ),
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
if ( version_compare( PHP_VERSION, '7.4.0', '<' ) ) {
	if ( ! function_exists( 'stackable_php_requirement_notice' ) ) {
		function stackable_php_requirement_notice() {
	        printf(
	            '<div class="notice notice-error"><p>%s</p></div>',
	            sprintf( esc_html__( '"Stackable" requires PHP version 7.4.0 or higher, but PHP version %s is used on the site.', STACKABLE_I18N ), PHP_VERSION )
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

/**
 * Show notice if another Stackable plugin has been deactivated.
 *
 * @since 3.18.1
 */
if ( ! function_exists( 'stackable_notice_other_stackable_plugin_deactivated' ) ) {
    function stackable_notice_other_stackable_plugin_deactivated() {
        $OTHER_STACKABLE_INFO = get_option( 'stackable_other_stackable_plugin_info', false );
        if ( $OTHER_STACKABLE_INFO ) {
            printf(
                '<div class="notice notice-info is-dismissible stackable_notice_gutenberg_plugin"><p>%s</p></div>',
                sprintf( esc_html__( '%sStackable Notice%s: The Stackable plugin (%s version %s) has been deactivated. Only one active Stackable plugin is needed.', STACKABLE_I18N ), '<strong>', '</strong>', $OTHER_STACKABLE_INFO['BUILD'], $OTHER_STACKABLE_INFO['VERSION'] )
            );
            delete_option( 'stackable_other_stackable_plugin_info' );
        }
	}

	if ( get_option( 'stackable_other_stackable_plugin_info', false ) ) {
		add_action( 'admin_notices', 'stackable_notice_other_stackable_plugin_deactivated' );
	}
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

// PHPUnit loads this file only for deactivation cleanup + is_frontend().
if ( defined( 'STACKABLE_PHPUNIT' ) && STACKABLE_PHPUNIT ) {
	return;
}

/**
 * Freemius.
 * This needs to be first.
 */
if ( STACKABLE_BUILD !== 'free' ) {
	require_once( plugin_dir_path( __FILE__ ) . 'freemius.php' );
}

/**
 * Block Initializer.
 */
require_once( plugin_dir_path( __FILE__ ) . 'src/editor-settings.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/admin.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/init.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/frontend-css.php' );
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
if ( ! stackable_is_frontend_request() ) { // Editor and REST API only.
	require_once( plugin_dir_path( __FILE__ ) . 'src/design-library/init.php' );
}
require_once( plugin_dir_path( __FILE__ ) . 'src/styles/block-design-system.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/plugins/theme-block-style-inheritance/index.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/global-settings.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/plugins/global-settings/spacing-and-borders/index.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/plugins/global-settings/buttons-and-icons/index.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/plugins/global-settings/color-schemes/deprecated/index.php' );  // We need to add this so the filter for deprecation gets applied.
require_once( plugin_dir_path( __FILE__ ) . 'src/plugins/global-settings/color-schemes/index.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/plugins/global-settings/preset-controls/index.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/plugins/global-settings/block-styles/index.php' );
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
if ( ! stackable_is_frontend_request() ) { // Admin and REST API only.
	require_once( plugin_dir_path( __FILE__ ) . 'src/welcome/getting-started.php' );
}
if ( is_admin() ) {
	require_once( plugin_dir_path( __FILE__ ) . 'src/welcome/useful-plugins.php' ); // For cross-marketing
	require_once( plugin_dir_path( __FILE__ ) . 'src/welcome/index.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/welcome/news.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/welcome/freemius.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/welcome/updates.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/welcome/notification.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'src/welcome/notification-rate.php' );
}

if ( STACKABLE_BUILD === 'premium' ) {
	if ( sugb_fs()->is__premium_only() ) {
		/**
		 * Premium initialize code.
		 */
		if ( file_exists( plugin_dir_path( __FILE__ ) . 'pro__premium_only/index.php' ) ) {
			require_once( plugin_dir_path( __FILE__ ) . 'pro__premium_only/index.php' );
		}
	}
}

// Deprecated.
require_once( plugin_dir_path( __FILE__ ) . 'src/deprecated/editor-settings.php' );
// The "Use Legacy Frontend CSS Loading" setting: the old loading turns the new one off through hooks.
if ( get_option( Stackable_Frontend_CSS::LEGACY_OPTION ) ) {
	require_once( plugin_dir_path( __FILE__ ) . 'src/deprecated/legacy-frontend-css.php' );
}
require_once( plugin_dir_path( __FILE__ ) . 'src/deprecated/native-global-colors.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/deprecated/navigation-panel-pre-enabled.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/deprecated/font-awesome-version.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/deprecated/global-color-schemes.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/deprecated/block-defaults.php' );

/**
 * V2 Deprecated
 */
require_once( plugin_dir_path( __FILE__ ) . 'src/deprecated/v2/init.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/deprecated/v2/blocks.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/deprecated/v2/disabled-blocks.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/deprecated/v2/design-library/init.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/deprecated/v2/optimization-settings.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/deprecated/v2/global-settings.php' );
