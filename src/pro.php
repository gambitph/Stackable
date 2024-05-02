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

if ( ! function_exists( 'stackable_register_show_pro_notice_option' ) ) {

	/**
	 * Ajax handler for saving the setting for the Go Premium show/hide notices.
	 */
	function stackable_register_show_pro_notice_option() {
		register_setting(
			'stackable_show_pro_notices',
			'stackable_show_pro_notices',
			array(
				'type' => 'string',
				'description' => __( 'Hide "Go Premium" notices', STACKABLE_I18N ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest' => true,
				'default' => '1',
			)
		);
	}
	add_action( 'admin_init', 'stackable_register_show_pro_notice_option' );
	add_action( 'rest_api_init', 'stackable_register_show_pro_notice_option' );
}

if ( ! function_exists( 'stackable_should_show_pro_notices' ) ) {

	/**
	 * Should we show all premium notices?
	 *
	 * @return Boolean
	 */
	function stackable_should_show_pro_notices() {
		return STACKABLE_SHOW_PRO_NOTICES && stackable_show_pro_notices_option() && ( ! sugb_fs()->can_use_premium_code() || STACKABLE_BUILD === 'free' );
	}
}

if ( ! class_exists( 'Stackable_Go_Premium_Notification' ) ) {
    class Stackable_Go_Premium_Notification {

        /**
         * The amount of time from plugin activation to wait in seconds to display the Go Premium notices.
         *
         * @var int
         */
		const SHOW_NOTICE_TIME = 604800; // 7 * 24 * 60 * 60

		/**
         * The amount of time for old plugin users to see the premium notice.
         *
         * @var int
         */
		const OLD_TIMER_NOTICE_TIME = 604800; // 7 * 24 * 60 * 60

        function __construct() {
            add_action( 'admin_menu', array( $this, 'check_pro_notice_date' ), 9 );
			add_action( 'admin_menu', array( $this, 'go_premium_notice_old_raters' ), 9 );
        }

        /**
         * Checks whether the activation date surpasses our limit and then displays a rating notification.
         *
         * @since 1.13.0
         */
        public function check_pro_notice_date() {
            if ( get_option( 'stackable_pro_notice_start_date' ) === false ) {
                update_option( 'stackable_pro_notice_start_date', time(), 'no' );
            }

            $activation_time = get_option( 'stackable_pro_notice_start_date' );
            $elapsed_time = time() - absint( $activation_time );

			if ( self::SHOW_NOTICE_TIME < $elapsed_time ) {
				$this->show_notification();
			}
		}

		/**
		 * Show Premium notice to old timers
		 */
		public function go_premium_notice_old_raters() {
			if ( get_option( 'stackable_activation_date' ) === false ) {
				return;
			}

			$activation_time = get_option( 'stackable_activation_date' );
			$elapsed_time = time() - absint( $activation_time );

			// This time should be more than the rating notice so as not to be annoying.
			if ( $elapsed_time > self::OLD_TIMER_NOTICE_TIME ) {
				$this->show_notification();
			}
		}

		/**
		 * Show Premium notification.
		 */
		public function show_notification() {
			stackable_add_welcome_notification( 'premium', sprintf( __( 'We hope you\'re enjoying Stackable. If you want more, you may want to check out %sStackable Premium%s. Ready to upgrade and do more? %sGo premium now%s', STACKABLE_I18N ),
				'<a href="https://wpstackable.com/premium/?utm_source=wp-settings-notification&utm_campaign=gopremium&utm_medium=wp-dashboard" target="_blank">', '</a>',
				'<a href="https://wpstackable.com/premium/?utm_source=wp-settings-notification&utm_campaign=gopremium&utm_medium=wp-dashboard">', '</a>'
			) );
		}
    }

	if ( STACKABLE_SHOW_PRO_NOTICES && ! sugb_fs()->can_use_premium_code() ) {
		new Stackable_Go_Premium_Notification();
	}
}
