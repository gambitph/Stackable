<?php
/**
 * Adds a Rate us notification if the plugin has been installed for some time.
 *
 * @package Stackable
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Welcome_Notification_Rate' ) ) {
    class Stackable_Welcome_Notification_Rate {

        /**
         * The amount of time from plugin activation to wait in seconds to display the rating notice.
         *
         * @var int
         */
        const RATING_NOTICE_TIME = 432000; // 5 * 24 * 60 * 60

        function __construct() {
            add_action( 'admin_menu', array( $this, 'check_activation_date' ), 9 );
        }

        /**
         * Checks whether the activation date surpasses our limit and then displays a rating notification.
         *
         * @since 1.7
         */
        public function check_activation_date() {
            if ( get_option( 'stackable_activation_date' ) === false ) {
                update_option( 'stackable_activation_date', time() );
            }

            $activation_time = get_option( 'stackable_activation_date' );
            $elapsed_time = time() - absint( $activation_time );

            if ( $elapsed_time > self::RATING_NOTICE_TIME ) {
                stackable_add_welcome_notification( 'rate', sprintf( __( 'We\'ve noticed that you\'ve been using Stackable for some time now, we hope you are loving it! We would appreciate it if you can %sgive us a 5 star rating on WordPress.org%s!', STACKABLE_I18N ), '<a href="https://wordpress.org/support/plugin/stackable-ultimate-gutenberg-blocks/reviews/?rate=5#new-post" target="_rate">', '</a>' ) );
            }
        }
    }

    new Stackable_Welcome_Notification_Rate();
}
