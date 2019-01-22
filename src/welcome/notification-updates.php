<?php
/**
 * Adds a version update notifications.
 * 
 * @package Stackable
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Welcome_Notification_Updates' ) ) {
    class Stackable_Welcome_Notification_Updates {

        function __construct() {
            add_action( 'admin_menu', array( $this, 'check_activation_date' ), 9 );
            stackable_add_welcome_notification( 'rate19', 'Stackable has been updated, here\'s what\'s new:<ul><li>Better Block Experience & Improved Image Box Block <a href="https://rebrand.ly/plugin-welcome-update-1-6">Read full article</a></li></ul>' );
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
                stackable_add_welcome_notification( 'rate', sprintf( __( 'We\'ve noticed that you\'ve been using Stackable for some time now, we hope you are loving it! We would appreciate it if you can %sgive us a 5 star rating on WordPress.org%s!', 'stackable' ), '<a href="https://rebrand.ly/plugin-welcome-notice-rate" target="_blank">', '</a>' ) );
            }
        }
    }

    new Stackable_Welcome_Notification_Updates();
}