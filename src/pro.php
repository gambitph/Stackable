<?php
/**
 * This is in charge of enabling/disbling the show Go Premium notices in the editor.
 *
 * There are 2 Go Premium notices: 1 small notices, the rest of the notices.
 * These are controlled by:
 * 1. The const STACKABLE_SHOW_PRO_NOTICES
 *    - If true, then all notices will show up. If false, hide everything.
 * 2. The option 'stackable_show_pro_notice'
 *    - If true, then all notices will show up. If false, hide everything.
 *    - Similar to how the const STACKABLE_SHOW_PRO_NOTICES works.
 * 3. `sugb_fs()->can_use_premium_code()`
 *    - If true, user is in Premium code, hide everything.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_show_pro_notices_option' ) ) {

	/**
	 * Gets whether the Go Premium notices are set to show or hide from the options.
	 * If the option is not yet set (e.g. new install), this is considered "show".
	 *
	 * @return Array
	 */
	function stackable_show_pro_notices_option() {
		$show_pro_notice = get_option( 'stackable_show_pro_notices' );
		if ( $show_pro_notice === false ) {
			return true;
		}
		return $show_pro_notice === '1';
	}
}

if ( ! function_exists( 'stackable_ajax_update_show_pro_notice_notice' ) ) {

	/**
	 * Ajax handler for saving the setting for the Go Premium show/hide notices.
	 */
	function stackable_ajax_update_show_pro_notice_notice() {
		$nonce = isset( $_POST['nonce'] ) ? sanitize_key( $_POST['nonce'] ) : '';

		if ( ! wp_verify_nonce( $nonce, 'stackable_show_pro_notices' ) ) {
			wp_send_json_error( __( 'Security error, please refresh the page and try again.', 'stackable' ) );
		}

		$checked_show_notices = isset( $_POST['checked'] ) ? $_POST['checked'] === 'true' : false;
		update_option( 'stackable_show_pro_notices', $checked_show_notices ? '1' : '0' );
		wp_send_json_success();
	}
	add_action( 'wp_ajax_stackable_update_show_pro_notice_option', 'stackable_ajax_update_show_pro_notice_notice' );
}

if ( ! function_exists( 'stackable_show_pro_notices_option_nonce' ) ) {

	/**
	 * Create a nonce for show/hide Go Premium notice.
	 *
	 * @return String
	 */
	function stackable_show_pro_notices_option_nonce() {
		return wp_create_nonce( 'stackable_show_pro_notices' );
	}
}

if ( ! function_exists( 'stackable_should_show_small_pro_notices' ) ) {

	/**
	 * Should we show small premium notices?
	 *
	 * @return Mixed False if hide, 'show' if visible, 'fade' if visible but slightly less.
	 */
	function stackable_should_show_small_pro_notices() {
		$small_notice_show = get_option( 'stackable_small_pro_notice_show' );
		if ( in_array( $small_notice_show, array( 'show', 'fade' ) ) ) {
			return $small_notice_show;
		}
		return false;
	}
}

if ( ! function_exists( 'stackable_should_show_pro_notices' ) ) {

	/**
	 * Should we show all premium notices?
	 *
	 * @return Boolean
	 */
	function stackable_should_show_pro_notices() {
		return STACKABLE_SHOW_PRO_NOTICES && stackable_show_pro_notices_option() && ! sugb_fs()->can_use_premium_code();
	}
}

if ( ! class_exists( 'Stackable_Go_Premium_Notification' ) ) {
    class Stackable_Go_Premium_Notification {

        /**
         * The amount of time from plugin activation to wait in seconds to display the Go Premium notices.
         *
         * @var int
         */
		const SHOW_NOTICE_TIME = 172800; // 2 * 24 * 60 * 60

		/**
         * The amount of time from plugin activation to wait in seconds to display the Go Premium notices in faded form.
         *
         * @var int
         */
		const FADE_NOTICE_TIME = 864000; // 10 * 24 * 60 * 60


        function __construct() {
            add_action( 'admin_menu', array( $this, 'check_pro_notice_date' ), 9 );
        }

        /**
         * Checks whether the activation date surpasses our limit and then displays a rating notification.
         *
         * @since 1.13.0
         */
        public function check_pro_notice_date() {
            if ( get_option( 'stackable_pro_notice_start_date' ) === false ) {
                update_option( 'stackable_pro_notice_start_date', time() );
            }

            $activation_time = get_option( 'stackable_pro_notice_start_date' );
            $elapsed_time = time() - absint( $activation_time );

			// Hide notices.
			if ( $elapsed_time < self::SHOW_NOTICE_TIME ) {
				delete_option( 'stackable_small_pro_notice_show' );

			// Show notices.
			} else if ( self::SHOW_NOTICE_TIME < $elapsed_time && $elapsed_time < self::FADE_NOTICE_TIME ) {
				update_option( 'stackable_small_pro_notice_show', 'show' );

			// Show faded.
			} else if ( self::FADE_NOTICE_TIME < $elapsed_time ) {
				update_option( 'stackable_small_pro_notice_show', 'fade' );
                stackable_add_welcome_notification( 'premium', sprintf( __( 'Did you know that there\'s a Premium version for Stackable? Get more designs per block and new effects per block. %sClick here to learn more.%s', 'stackable' ), '<a href="https://rebrand.ly/plugin-learn-premium" target="_blank">', '</a>' ) );
			}
        }
    }

	if ( STACKABLE_SHOW_PRO_NOTICES && ! sugb_fs()->can_use_premium_code() ) {
		new Stackable_Go_Premium_Notification();
	}
}
