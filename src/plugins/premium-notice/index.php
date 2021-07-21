<?php
/**
 * Display a premium notice in our inspector.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Plugin_Premium_Notice' ) ) {
    class Stackable_Plugin_Premium_Notice {

        /**
         * The amount of time from plugin activation to wait in seconds to display the Premium notice.
         *
         * @var int
         */
		const SHOW_NOTICE_TIME = 604800; // 7 * 24 * 60 * 60

        function __construct() {
			add_action( 'init', array( $this, 'should_display_notice' ) );
			add_action( 'init', array( $this, 'register_dismissed_option' ) );
		}

		public function register_dismissed_option() {
			/**
			 * This can either be:
			 * - "" (blank or falsey) - Means we're waiting for a good time to show the notice
			 * - "show" - The notice should be shown
			 * - "dismissed" - The notice was dismissed already
			 */
			register_setting(
				'stackable_inspector_premium_notice_status',
				'stackable_inspector_premium_notice_status',
				array(
					'type' => 'string',
					'description' => __( 'True if the inspector "Go Premium" notice was already dismissed', STACKABLE_I18N ),
					'sanitize_callback' => 'sanitize_text_field',
					'show_in_rest' => true,
					'default' => '',
				)
			);
		}

		/**
		 * Set whether we should show the premium upgrade notice.
		 *
		 * @return void
		 */
		public function should_display_notice() {
			if ( ! get_option( 'stackable_inspector_premium_notice_status' ) ) {
				if ( get_option( 'stackable_pro_notice_start_date' ) === false ) {
					update_option( 'stackable_pro_notice_start_date', time() );
				}

				$activation_time = get_option( 'stackable_pro_notice_start_date' );
				$elapsed_time = time() - absint( $activation_time );

				if ( self::SHOW_NOTICE_TIME < $elapsed_time ) {
					update_option( 'stackable_inspector_premium_notice_status', 'show' );
				}
			}
		}
	}

	new Stackable_Plugin_Premium_Notice();
}
