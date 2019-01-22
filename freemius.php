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
	        // Include Freemius SDK.
	        require_once dirname(__FILE__) . '/freemius/start.php';

	        $sugb_fs = fs_dynamic_init( array(
	            'id'                  => '1748',
	            'slug'                => 'stackable-ultimate-gutenberg-blocks',
	            'type'                => 'plugin',
	            'public_key'          => 'pk_771ae29c5255d20a4880980729a17',
				'is_premium'          => false,
				'has_premium_version' => false,
	            'has_addons'          => false,
	            'has_paid_plans'      => false,
				'menu'                => array(
					'slug'       => 'stackable',
					'first-path' => 'admin.php?page=stackable',
					'account'    => false,
					'pricing'    => false,
					'contact'    => false,
					'support'    => false,
				),
	        ) );
	    }

	    return $sugb_fs;
	}

	// Init Freemius.
	sugb_fs();
	// Signal that SDK was initiated.
	do_action( 'sugb_fs_loaded' );
}
