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
			// Activate multisite network integration.
            if ( ! defined( 'WP_FS__PRODUCT_1748_MULTISITE' ) ) {
                define( 'WP_FS__PRODUCT_1748_MULTISITE', true );
            }

	        // Include Freemius SDK.
	        require_once dirname(__FILE__) . '/freemius/start.php';

			// Do not redirect to the getting started when in network activating
			// in multisite or in the mainsite because it will redirect to a 404
			// page.
			$first_path = 'options-general.php?page=stackable-getting-started';
			if ( is_multisite() && is_main_site() ) {
				$first_path = 'plugins.php';
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
					'account'    => true,
					'pricing'    => true,
					'contact'    => true,
                    'support'    => false,
                    'affiliation' => false,
					'parent'     => array(
                        'slug' => 'options-general.php',
					),
				),
	        ) );
	    }

	    return $sugb_fs;
	}

	// Init Freemius.
	sugb_fs();

	// Disable some Freemius features.
	sugb_fs()->add_filter( 'show_deactivation_feedback_form', '__return_false' );
	sugb_fs()->add_filter( 'hide_freemius_powered_by', '__return_true' );
	sugb_fs()->add_filter( 'permission_diagnostic_default', '__return_false' ); // Disable opt-in option by default
	sugb_fs()->add_filter( 'permission_extensions_default', '__return_false' ); // Disable opt-in option by default
	// Hide Freemius notices that can easily annoy users.
	sugb_fs()->add_filter( 'show_admin_notice', function( $show, $message ) {
		if ( in_array( $message['id'], array( 'license_activated', 'premium_activated', 'connect_account' ) ) ) {
			return false;
		}
        return $show;
	}, 10, 2 );


	// Signal that SDK was initiated.
	do_action( 'sugb_fs_loaded' );

}
