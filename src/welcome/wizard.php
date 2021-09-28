<?php
/**
 * Welcome screen.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Onboarding_Wizard' ) ) {
    class Stackable_Onboarding_Wizard {
        function __construct() {
            add_action( 'admin_menu', array( $this, 'add_dashboard_page' ) );

			// Redirect to the onboarding wizard if the user hasn't seen it yet.
			add_action( 'stackable_redirect_to_welcome_page', array( $this, 'redirect_to_onboarding_wizard' ) );

            // Add the admin settings for our wizard.
			add_filter( 'stackable_localize_settings_script', array( $this, 'add_wizard_settings' ) );
        }

		public function redirect_to_onboarding_wizard() {
			// If we have never redirected to the onboarding wizard before, redirect to it now.
			if ( get_option( 'stackable_redirect_to_wizard' ) === false ) {
				update_option( 'stackable_redirect_to_wizard', '1' );
				wp_redirect( esc_url( admin_url( 'options-general.php?page=stackable-settings-wizard' ) ) );
				die();
			}
		}

        public function add_dashboard_page() {
			// Our wizard page.
			add_submenu_page(
				isset( $_GET['page'] ) && $_GET['page'] === 'stackable-settings-wizard' ? 'options-general.php' : null, // Parent slug. Only show when in the page.
				__( 'Wizard', STACKABLE_I18N ), // Page title.
				'<span class="fs-submenu-item fs-sub"></span>' . __( 'Wizard', STACKABLE_I18N ), // Menu title.
				'manage_options', // Capability.
				'stackable-settings-wizard', // Menu slug.
				array( $this, 'onboard_wizard_content' ), // Callback function.
				null // Position
			);
		}

		public function onboard_wizard_content() {
			?>
			<div class="wrap s-wrapper--no-menu s-wrap-onboarding-wizard">
				<?php Stackable_Welcome_Screen::print_header( __( 'Stackable Onboarding Wizard', STACKABLE_I18N ) ) ?>
                <section class="s-body-container s-body-container-grid">
					<div class="s-body">
						<div class="s-onboarding-wizard"></div>
					</div>
				</section>
			</div>
			<?php
		}

		public function add_wizard_settings( $args ) {
			$args['wizard'] = array(
				'disabled_blocks' => get_option( 'stackable_disabled_blocks' ),
			);
			return $args;
		}
	}

	new Stackable_Onboarding_Wizard();
}
