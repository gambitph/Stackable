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

		// Signal that SDK was initiated.
		do_action( 'sugb_fs_loaded' );
	}

	/**
	 * In the frontend, the Freemius SDK (about 1.6 MB of PHP) is only used to
	 * check the license. When we have the result of these checks from a
	 * recent request that loaded the SDK (any admin page, cron run, AJAX
	 * request), use that instead of loading the SDK. Anything else asked of
	 * the SDK loads it.
	 *
	 * @since 3.21.0
	 */
	function stackable_freemius_frontend_cache() {
		// Not in the admin, AJAX, REST API, cron or WP-CLI.
		if ( ! function_exists( 'stackable_is_frontend_request' ) || ! stackable_is_frontend_request() || is_multisite() ) {
			return false;
		}
		if ( defined( 'STACKABLE_FREEMIUS_FRONTEND_CACHE' ) && ! STACKABLE_FREEMIUS_FRONTEND_CACHE ) {
			return false;
		}
		$cache = get_option( 'stackable_freemius_frontend_cache' );
		if ( ! is_array( $cache ) || ! isset( $cache['version'], $cache['time'], $cache['can_use_premium_code'] ) ) {
			return false;
		}
		if ( $cache['version'] !== STACKABLE_VERSION || $cache['time'] < time() - DAY_IN_SECONDS || $cache['time'] > time() + HOUR_IN_SECONDS ) {
			return false;
		}
		return $cache;
	}

	/**
	 * Saves the license checks the frontend uses, when the SDK is loaded.
	 */
	function stackable_freemius_save_frontend_cache() {
		global $sugb_fs;
		if ( ! is_object( $sugb_fs ) || $sugb_fs instanceof Stackable_Freemius_Frontend || ! function_exists( 'update_option' ) ) {
			return;
		}
		try {
			$data = array(
				'can_use_premium_code' => (bool) $sugb_fs->can_use_premium_code(),
				'is__premium_only' => (bool) $sugb_fs->is__premium_only(),
				'plans' => array(
					'starter' => (bool) $sugb_fs->is_plan( 'starter', true ),
					'professional' => (bool) $sugb_fs->is_plan( 'professional', true ),
					'business' => (bool) $sugb_fs->is_plan( 'business', true ),
				),
			);
		} catch ( Exception $e ) {
			return;
		}
		$cache = get_option( 'stackable_freemius_frontend_cache' );
		$data['version'] = STACKABLE_VERSION;
		// Only write if something changed, or to keep it fresh.
		if ( is_array( $cache ) && isset( $cache['time'] ) ) {
			$old = $cache;
			unset( $old['time'] );
			if ( $old == $data && $cache['time'] > time() - 6 * HOUR_IN_SECONDS && $cache['time'] <= time() ) {
				return;
			}
		}
		$data['time'] = time();
		update_option( 'stackable_freemius_frontend_cache', $data, true );
	}

	if ( ! class_exists( 'Stackable_Freemius_Frontend' ) ) {
		/**
		 * Answers the license checks from the cache, loads the SDK for
		 * anything else.
		 */
		class Stackable_Freemius_Frontend {
			private $cache;
			private $filters = array();

			function __construct( $cache ) {
				$this->cache = $cache;
			}

			public function can_use_premium_code() {
				return (bool) $this->cache['can_use_premium_code'];
			}

			public function is__premium_only() {
				return isset( $this->cache['is__premium_only'] ) ? (bool) $this->cache['is__premium_only'] : true;
			}

			public function is_plan( $plan, $exact = false ) {
				if ( $exact && isset( $this->cache['plans'][ $plan ] ) ) {
					return (bool) $this->cache['plans'][ $plan ];
				}
				return $this->__call( 'is_plan', array( $plan, $exact ) );
			}

			// Freemius filters/actions are kept for when the SDK loads.
			public function add_filter( ...$args ) {
				$this->filters[] = array( 'add_filter', $args );
			}

			public function add_action( ...$args ) {
				$this->filters[] = array( 'add_action', $args );
			}

			public function __call( $name, $args ) {
				global $sugb_fs;
				if ( $sugb_fs === $this ) {
					$sugb_fs = null;
					stackable_freemius_init();
					foreach ( $this->filters as $filter ) {
						call_user_func_array( array( $sugb_fs, $filter[0] ), $filter[1] );
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
		add_action( 'shutdown', 'stackable_freemius_save_frontend_cache' );
	}
	unset( $stackable_freemius_cache );
}
