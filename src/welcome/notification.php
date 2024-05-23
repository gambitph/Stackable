<?php
/**
 * Functions to add notifications in the welcome screen and top level menu.
 *
 * @package Stackable
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

global $stackable_notifications;
if ( ! isset( $stackable_notifications ) ) {
    $stackable_notifications = array();
}

if ( ! function_exists( 'stackable_ajax_dismiss_notice' ) ) {
    add_action( 'wp_ajax_stackable_dismiss_notice', 'stackable_ajax_dismiss_notice' );

    /**
     * Handles the dismissal of a notification via ajax.
     *
     * @since 1.7
     */
    function stackable_ajax_dismiss_notice() {
        if ( empty( $_POST['id'] ) || empty( $_POST['nonce'] ) ) { // Input var: okay.
            wp_die();
        }

        // Security check.
        if ( ! wp_verify_nonce( sanitize_key( $_POST['nonce'] ), 'stackable_dismiss_notice' ) ) { // Input var: okay.
            wp_die();
        }

		$id = sanitize_text_field( wp_unslash( $_POST['id'] ) ); // Input var: okay.
		stackable_add_in_notification_dismissed( $id );

        wp_die();
    }
}

if ( ! function_exists( 'stackable_add_in_notification_dismissed' ) ) {

	/**
	 * Adds the ID as a dismissed notification. This hides it from being displayed.
	 *
	 * @since 1.18.0
	 */
	function stackable_add_in_notification_dismissed( $id ) {
        $dismissed = get_option( 'stackable_notifications_dismissed' );
        if ( empty( $dismissed ) ) {
            $dismissed = array();
        }
        if ( ! in_array( $id, $dismissed ) ) {
            $dismissed[] = $id;
        }
		update_option( 'stackable_notifications_dismissed', $dismissed, 'no' );
	}
}

if ( ! function_exists( 'stackable_notification_count' ) ) {
    /**
     * Returns the number of notifications.
     *
     * @since 1.7
     *
     * @return int
     */
    function stackable_notification_count() {
        global $stackable_notifications;
        $num_notifiations = count( $stackable_notifications );
        if ( $num_notifiations ) {
            return sprintf( '<span class="update-plugins stk-update-plugins count-%s"><span class="plugin-count" aria-hidden="true">%s</span><span class="screen-reader-text">%s</span></span>',
                $num_notifiations,
                $num_notifiations,
                sprintf( _n( '%s notification', '%s notifications', $num_notifiations, STACKABLE_I18N ), $num_notifiations )
            );
        }
        return '';
    }
}

if ( ! function_exists( 'stackable_welcome_notification' ) ) {

    /**
     * Echoes out the available notifications in the welcome screen.
     *
     * @since 1.7
     */
    function stackable_welcome_notification() {
        global $stackable_notifications;
        if ( ! count( $stackable_notifications ) ) {
            return;
        }

        ?>
        <script type="text/javascript">
            function stackable_dismiss( button ) {
                jQuery.post(
                    ajaxurl, {
                        action: 'stackable_dismiss_notice',
                        id: button.getAttribute( 'data-id' ),
                        nonce: '<?php echo esc_attr( wp_create_nonce( 'stackable_dismiss_notice' ) ) ?>'
                    },
                    function() {

                        // Remove the notice.
                        jQuery( button ).parents( '.stackable_notice' ).remove();

                        // Remove the notice area if no notices remain.
                        if ( ! jQuery( '.stackable_notice' ).length ) {
                            jQuery( '.stackable_notice_wrapper' ).remove();
                        }

                        // Decrement the menu indicators.
						jQuery( '.stk-update-plugins' ).each( function( i, el ) {
							var indicator = jQuery( el )
							var n = parseInt( indicator.attr( 'class' ).match( /count-(\d*)/ )[1], 10 );
							// Decrement the class.
							indicator.removeClass( 'count-' + n ).addClass( 'count-' + ( n - 1 ) );
							// Decrement the text.
							indicator.find( '> *' ).each( function ( i, el ) {
								jQuery( el ).html( jQuery( el ).html().replace( /\d+/, ( n - 1 ) ) )
							} )
						} )
                    }
                )
            }
        </script>
        <aside class="stackable_notice_wrapper s-box">
            <h3><?php esc_html_e( '👉 Notifications', STACKABLE_I18N ) ?></h3>
            <?php
            foreach ( $stackable_notifications as $notification ) {
                ?>
                <div class="stackable_notice">
                    <?php echo wp_kses_post( $notification['message'] ) ?>
                    <p><button class="button" data-id="<?php echo esc_attr( $notification['id'] ) ?>" onclick="stackable_dismiss(this); event.preventDefault();"><?php _e( 'Don\'t show me this anymore', STACKABLE_I18N ) ?></button></p>
                </div>
                <?php
            }
        ?>
        </aside>
        <?php
    }
}

if ( ! function_exists( 'stackable_add_welcome_notification' ) ) {
    /**
     * Adds a notification to the Stackable welcome screen.
     *
     * Should be called on or before the `admin_menu` action (priority 9)
     * in order for the notification indicator to appear.
     *
     * @since 1.7
     *
     * @param $id       string  A unique ID for the message. This will be used to perma-dismiss the message.
     * @param $message  string  The message to display in the notification.
     */
    function stackable_add_welcome_notification( $id, $message ) {
        global $stackable_notifications;

		// Don't show dismissed.
        $dismissed = get_option( 'stackable_notifications_dismissed' );
        if ( $dismissed && in_array( $id, $dismissed ) ) {
            return;
		}

		// Don't show duplicates.
		foreach ( $stackable_notifications as $notification ) {
			if ( $notification[ 'id' ] === $id ) {
				return;
			}
		}

        $stackable_notifications[] = array(
            'id' => $id,
            'message' => preg_match( '/<(p|h4|h3|h2)/', $message ) ? $message : '<p>' . $message . '</p>',
        );
    }
}
