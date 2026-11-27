<?php
/**
 * Init Freemius.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Create a helper function for easy SDK access.
if ( ! function_exists( 'sugb_fs' ) ) {
	function sugb_fs() {
	    global $sugb_fs;

	    if ( ! isset( $sugb_fs ) ) {
			stackable_freemius_init();
		}

		return $sugb_fs;
	}

	/**
	 * Loads the Freemius SDK.
	 */
	function stackable_freemius_init() {
	    global $sugb_fs;

			// Activate multisite network integration.
            if ( ! defined( 'WP_FS__PRODUCT_1748_MULTISITE' ) ) {
                define( 'WP_FS__PRODUCT_1748_MULTISITE', true );
            }

	        // Include Freemius SDK.
	        require_once dirname(__FILE__) . '/freemius/start.php';

			// Do not redirect to the getting started when in network activating
			// in multisite or in the mainsite because it will redirect to a 404
			// page.
			$first_path = 'admin.php?page=stackable';
			if ( is_multisite() && is_main_site() ) {
				$first_path = 'plugins.php';
			}

			// Freemius issue:
			// https://github.com/Freemius/wordpress-sdk/issues/674 If the menu
			// slug is options-general, for a network activated plugin, all
			// admin URLs will be broken. This is a temporary fix.
			$menu_slug = 'stackable';
			if ( is_multisite() && is_main_site() && is_plugin_active_for_network( plugin_basename( STACKABLE_FILE ) ) ) {
				if ( ! empty( $_SERVER ) && isset( $_SERVER['REQUEST_URI'] ) && stripos( $_SERVER['REQUEST_URI'], '/admin.php' ) !== false ) {
					$menu_slug = 'admin.php';
				}
			}

	        $sugb_fs = fs_dynamic_init( array(
	            'id'                  => '1748',
	            'slug'                => 'stackable-ultimate-gutenberg-blocks',
	            'type'                => 'plugin',
	            'public_key'          => 'pk_771ae29c5255d20a4880980729a17',
				'is_premium'          => true,
				'has_premium_version' => true,
	            'has_addons'          => false,
				'has_paid_plans'      => true,
				'navigation'          => 'tabs',
				'menu'                => array(
					'slug'       => 'stackable',
					'first-path'  => $first_path,
					'account'    => false,
					'pricing'    => false,
					'contact'    => true,
                    'support'    => false,
                    'affiliation' => false,
					'parent'     => array(
                        'slug' => $menu_slug,
					),
				),
	        ) );

		stackable_freemius_setup();
	}

	/**
	 * Our Freemius settings, and signal that the SDK was initiated.
	 */
	function stackable_freemius_setup() {
		// Disable some Freemius features.
		sugb_fs()->add_filter( 'show_deactivation_feedback_form', '__return_false' );
		sugb_fs()->add_filter( 'hide_freemius_powered_by', '__return_true' );
		sugb_fs()->add_filter( 'permission_diagnostic_default', '__return_false' ); // Disable opt-in option by default
		sugb_fs()->add_filter( 'permission_extensions_default', '__return_false' ); // Disable opt-in option by default
		// Hide Freemius notices that can easily annoy users.
		sugb_fs()->add_filter( 'show_admin_notice', function( $show, $message ) {
			if ( $message['id'] === 'license_activated' ||
			     $message['id'] === 'premium_activated' ||
			     $message['id'] === 'connect_account'
			) {
				return false;
			}
	        return $show;
		}, 10, 2 );

		// Keep the frontend license cache in step with the SDK: refresh it
		// at the end of every request that loaded the SDK (any admin page),
		// and right away when the license or plan changes.
		if ( ! has_action( 'shutdown', 'stackable_freemius_save_frontend_cache' ) ) {
			add_action( 'shutdown', 'stackable_freemius_save_frontend_cache', 1000 );
		}
		foreach ( stackable_freemius_license_change_hooks() as $hook ) {
			sugb_fs()->add_action( $hook, 'stackable_freemius_license_changed' );
		}
		sugb_fs()->add_action( 'after_uninstall', 'stackable_freemius_delete_frontend_cache' );

		// Signal that SDK was initiated.
		do_action( 'sugb_fs_loaded' );
	}

	/**
	 * Freemius actions fired when the license, plan or account changes.
	 * Trials starting or ending come in as a plan sync or license change.
	 */
	function stackable_freemius_license_change_hooks() {
		return array(
			'after_license_activation',
			'after_license_deactivation',
			'after_license_change',
			'after_account_plan_sync',
			'after_plans_sync',
			'after_account_connection',
			'after_network_account_connection',
			'after_account_delete',
			'after_network_account_delete',
			'after_premium_version_activation',
			'after_free_version_reactivation',
		);
	}

	/**
	 * Uninstalled: remove the cache and don't save it again.
	 */
	function stackable_freemius_delete_frontend_cache() {
		delete_option( 'stackable_freemius_frontend_cache' );
		remove_action( 'shutdown', 'stackable_freemius_save_frontend_cache', 1000 );
	}

	/**
	 * The license or plan changed: drop the frontend cache now, and save it
	 * again with the new values at the end of this request.
	 */
	function stackable_freemius_license_changed() {
		delete_option( 'stackable_freemius_frontend_cache' );
		$GLOBALS['stackable_freemius_cache_changed'] = true;
	}

	/**
	 * The frontend license cache.
	 *
	 * In the frontend, the Freemius SDK (about 1.6 MB of PHP) is only used to
	 * check the license. When we have the results of these checks from a
	 * recent request that loaded the SDK (any admin page, cron run, AJAX
	 * request), we use them instead of loading the SDK. Anything else asked
	 * of the SDK loads it (see Stackable_Freemius_Frontend).
	 *
	 * Turn it off with define( 'STACKABLE_FREEMIUS_FRONTEND_CACHE', false );
	 *
	 * @since 3.21.0
	 *
	 * @return array|false The cached checks, or false to load the SDK.
	 */
	function stackable_freemius_frontend_cache() {
		// Only for pages, not the admin, AJAX, REST API, cron or WP-CLI.
		if ( ! function_exists( 'stackable_is_frontend_request' ) || ! stackable_is_frontend_request() ) {
			return false;
		}
		// Multisite licenses can be per site or per network, always ask the SDK.
		if ( is_multisite() ) {
			return false;
		}
		if ( defined( 'STACKABLE_FREEMIUS_FRONTEND_CACHE' ) && ! STACKABLE_FREEMIUS_FRONTEND_CACHE ) {
			return false;
		}

		$cache = get_option( 'stackable_freemius_frontend_cache' );
		if ( ! is_array( $cache ) || ! isset( $cache['version'], $cache['time'], $cache['can_use_premium_code'] ) ) {
			return false;
		}
		// Saved by another version of the plugin.
		if ( $cache['version'] !== STACKABLE_VERSION ) {
			return false;
		}
		// Older than a day, or from the future (the clock was changed).
		$is_too_old = $cache['time'] < time() - DAY_IN_SECONDS;
		$is_from_the_future = $cache['time'] > time() + HOUR_IN_SECONDS;
		if ( $is_too_old || $is_from_the_future ) {
			return false;
		}
		return $cache;
	}

	/**
	 * The license checks the frontend uses, asked from the SDK.
	 *
	 * @param Freemius $freemius
	 * @return array|false
	 */
	function stackable_freemius_get_license_checks( $freemius ) {
		try {
			return array(
				'can_use_premium_code' => (bool) $freemius->can_use_premium_code(),
				'is__premium_only' => (bool) $freemius->is__premium_only(),
				'plans' => array(
					'starter' => (bool) $freemius->is_plan( 'starter', true ),
					'professional' => (bool) $freemius->is_plan( 'professional', true ),
					'business' => (bool) $freemius->is_plan( 'business', true ),
				),
			);
		} catch ( Exception $e ) {
			return false;
		}
	}

	/**
	 * Whether the saved cache already has these checks and is recent, so
	 * we don't write the option on every admin page load.
	 *
	 * @param array|false $cache The saved cache.
	 * @param array $checks The checks now (with the version).
	 * @return bool
	 */
	function stackable_freemius_is_cache_up_to_date( $cache, $checks ) {
		// The license changed in this request, always save.
		if ( ! empty( $GLOBALS['stackable_freemius_cache_changed'] ) ) {
			return false;
		}
		if ( ! is_array( $cache ) || ! isset( $cache['time'] ) ) {
			return false;
		}
		$cached_checks = $cache;
		unset( $cached_checks['time'] );
		if ( $cached_checks != $checks ) { // Loose compare, the key order can differ.
			return false;
		}
		// Saved in the last 6 hours (and not in the future).
		return $cache['time'] > time() - 6 * HOUR_IN_SECONDS && $cache['time'] <= time();
	}

	/**
	 * Saves the license checks the frontend uses. Runs at the end of
	 * requests that loaded the SDK.
	 */
	function stackable_freemius_save_frontend_cache() {
		global $sugb_fs;
		$is_sdk_loaded = is_object( $sugb_fs ) && ! ( $sugb_fs instanceof Stackable_Freemius_Frontend );
		if ( ! $is_sdk_loaded || ! function_exists( 'update_option' ) ) {
			return;
		}

		$checks = stackable_freemius_get_license_checks( $sugb_fs );
		if ( $checks === false ) {
			return;
		}
		$checks['version'] = STACKABLE_VERSION;

		if ( stackable_freemius_is_cache_up_to_date( get_option( 'stackable_freemius_frontend_cache' ), $checks ) ) {
			return;
		}
		$checks['time'] = time();
		update_option( 'stackable_freemius_frontend_cache', $checks, true );
	}

	if ( ! class_exists( 'Stackable_Freemius_Frontend' ) ) {
		/**
		 * Stands in for the Freemius SDK in the frontend (as $sugb_fs).
		 *
		 * The license checks are answered from the cache. Anything else, e.g.
		 * sugb_fs()->get_user(), loads the real SDK first, and then calls it.
		 */
		class Stackable_Freemius_Frontend {

			/**
			 * See stackable_freemius_frontend_cache().
			 *
			 * @var array
			 */
			private $cache;

			/**
			 * The SDK filters and actions added before the SDK loaded, to add
			 * them to the SDK when it loads.
			 *
			 * @var array
			 */
			private $queued_hooks = array();

			function __construct( $cache ) {
				$this->cache = $cache;
			}

			public function can_use_premium_code() {
				return (bool) $this->cache['can_use_premium_code'];
			}

			public function is__premium_only() {
				if ( ! isset( $this->cache['is__premium_only'] ) ) {
					return true;
				}
				return (bool) $this->cache['is__premium_only'];
			}

			public function is_plan( $plan, $exact = false ) {
				// Only exact plan checks are cached.
				if ( $exact && isset( $this->cache['plans'][ $plan ] ) ) {
					return (bool) $this->cache['plans'][ $plan ];
				}
				return $this->__call( 'is_plan', array( $plan, $exact ) );
			}

			public function add_filter( ...$args ) {
				$this->queued_hooks[] = array( 'add_filter', $args );
			}

			public function add_action( ...$args ) {
				$this->queued_hooks[] = array( 'add_action', $args );
			}

			/**
			 * Anything else: load the SDK, and call it.
			 *
			 * @param string $name The SDK method.
			 * @param array $args
			 * @return mixed
			 */
			public function __call( $name, $args ) {
				global $sugb_fs;
				// The first call replaces this object with the real SDK.
				if ( $sugb_fs === $this ) {
					$sugb_fs = null;
					stackable_freemius_init();
					foreach ( $this->queued_hooks as $hook ) {
						list( $add_hook_method, $hook_args ) = $hook;
						call_user_func_array( array( $sugb_fs, $add_hook_method ), $hook_args );
					}
				}
				return call_user_func_array( array( $sugb_fs, $name ), $args );
			}
		}
	}

	// Init Freemius.
	$stackable_freemius_cache = stackable_freemius_frontend_cache();
	if ( $stackable_freemius_cache ) {
		$GLOBALS['sugb_fs'] = new Stackable_Freemius_Frontend( $stackable_freemius_cache );
	} else {
		sugb_fs();
	}
	unset( $stackable_freemius_cache );
}
