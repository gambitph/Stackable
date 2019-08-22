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

if ( ! class_exists( 'Stackable_Welcome_Notification_Updates' ) ) {
    class Stackable_Welcome_Notification_Updates {

        /**
         * If the user just installed Stackable, ignore the first update notice.
         *
         * @var int
         */
        const NEWLY_INSTALLED_TIME = 86400; // 1 * 24 * 60 * 60

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
			$article = stackable_get_latest_update_article_cached();

			if ( empty( $article ) ) {
				return;
			}

			$notification_id = 'update-article-' . $article['slug'];

			// If the user just installed Stackable, ignore/hide the first update notice.
            if ( $elapsed_time < self::NEWLY_INSTALLED_TIME ) {
				stackable_add_in_notification_dismissed( $notification_id );
			}

			// Show our notice.
			stackable_add_welcome_notification( $notification_id, sprintf(
				'<p><strong>%s</strong><br />%s<br />%s%s →%s</br>',
				sprintf( __( 'Plugin Update: %s', STACKABLE_I18N ), $article['title'] ),
				$article['excerpt'],
				'<a href="' . $article['url'] . '" target="_blank" rel="noopener noreferrer">',
				__( 'Continue Reading', STACKABLE_I18N ),
				'</a>' )
			);
        }
    }

    new Stackable_Welcome_Notification_Updates();
}
