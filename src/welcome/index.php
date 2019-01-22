<?php
/**
 * Welcome screen.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Welcome_Screen' ) ) {
    class Stackable_Welcome_Screen {
        function __construct() {
            add_action( 'admin_menu', array( $this, 'add_dashboard_page' ) );

            add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_dashboard_script' ) );

            add_action( 'admin_init', array( $this, 'redirect_to_welcome_page' ) );
        }

        public function add_dashboard_page() {
            add_menu_page(
                __( 'Stackable', 'stackable' ), // Page Title.
                __( 'Stackable', 'stackable' ) . ' ' . stackable_notification_count(), // Menu Title.
                'edit_posts', // Capability.
                'stackable', // Menu slug.
                array( $this, 'stackable_welcome_content' ), // Action.
                // Stackable icon.
                'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiBzdHlsZT0iZmlsbDogI2ZmZmZmZjsiPgogIDxwYXRoIGQ9Ik02NC4wOCwxMzZMMjMsMTc2LjY2YTQuNzUsNC43NSwwLDAsMCwzLjUzLDguMTVsODYuOTEsMC4xNFoiLz4KICA8cGF0aCBkPSJNMTc3LjkxLDEyOC4zOWExNywxNywwLDAsMC01LTEyLjA3TDcxLjM5LDE0LjcyaDBMMjYuNjEsNTkuNWExNywxNywwLDAsMC01LDEyLjA1aDBhMTcsMTcsMCwwLDAsNSwxMi4wNUwxMjguMTYsMTg1LjJ2LTAuMDdsMCwwLDQ0Ljc2LTQ0Ljc2YTE3LDE3LDAsMCwwLDUtMTJoMFoiLz4KICA8cGF0aCBkPSJNMTcyLjk1LDE0LjY5bC04Ni44MywwLDQ5LjQyLDQ5LjYyLDQwLjkyLTQxLjE2QTUsNSwwLDAsMCwxNzIuOTUsMTQuNjlaIi8+Cjwvc3ZnPgo='
            );
        }

        public function enqueue_dashboard_script( $hook ) {
            if ( 'toplevel_page_stackable' === $hook ) {
				wp_enqueue_style( 'stackable-welcome', plugins_url( 'dist/admin_welcome.css', STACKABLE_FILE ), array() );

				wp_enqueue_script( 'wp-i18n' );
				wp_enqueue_script( 'wp-element' );
				wp_enqueue_script( 'wp-hooks' );
				wp_enqueue_script( 'wp-util' ); // Need wp.ajax.
				wp_enqueue_script( 'wp-components' ); // Need Spinner.
				wp_enqueue_style( 'wp-components' ); // Need Spinner.

				wp_enqueue_script( 'stackable-welcome', plugins_url( 'dist/admin_welcome.js', STACKABLE_FILE ), array( 'wp-i18n', 'wp-element', 'wp-hooks', 'wp-util', 'wp-components' ) );

				wp_localize_script( 'stackable-welcome', 'stackable', array(
					'srcUrl' => plugins_url( '/', __FILE__ ),
					'isPro' => sugb_fs()->can_use_premium_code(),
					'showProNotice' => STACKABLE_SHOW_PRO_NOTICES && ! sugb_fs()->can_use_premium_code(),
					'pricingURL' => sugb_fs()->get_upgrade_url(),
					'planName' => sugb_fs()->get_plan_name(),
					'disabledBlocks' => stackable_get_disabled_blocks(),
					'nonce' => stackable_get_disabled_blocks_nonce(),
				) );
            }
        }

        public function stackable_welcome_content() {
            $plus_image = 'data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgcm9sZT0iaW1nIiBmb2N1c2FibGU9ImZhbHNlIiBjbGFzcz0iZGFzaGljb24gZGFzaGljb25zLWluc2VydCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCI+PHBhdGggZD0iTTEwIDFjLTUgMC05IDQtOSA5czQgOSA5IDkgOS00IDktOS00LTktOS05em0wIDE2Yy0zLjkgMC03LTMuMS03LTdzMy4xLTcgNy03IDcgMy4xIDcgNy0zLjEgNy03IDd6bTEtMTFIOXYzSDZ2MmgzdjNoMnYtM2gzVjloLTNWNnoiPjwvcGF0aD48L3N2Zz4=';
            ?>
            <div class="wrap">
                <header class="s-header">
                    <h1><?php _e( 'Stackable', 'stackable' ) ?></h1>
                    <img src="<?php echo esc_url( plugins_url( 'images/stackable-logo.svg', __FILE__ ) ) ?>" alt="<?php esc_attr_e( 'Stackable Logo' ) ?>"/>
                </header>
                <section class="s-body-container">
                    <div class="s-body">
                        <?php stackable_welcome_notification() ?>
                        <article class="s-intro s-box">
                            <div class="s-intro-col">
                                <h2><?php _e( '👋 Hello!', 'stackable' ) ?></h2>
                                <p><?php _e( 'Stackable supercharges the new Block Editor to give you the capability to build awesome front pages and landing pages. ⚡️🚀', 'stackable' ) ?></p>
                                <p><?php _e( 'We\'ve come up with a collection of cool blocks that will make website building a breeze. We made sure our blocks look great, fresh and responsive.', 'stackable' ) ?></p>
                            </div>
                            <div class="s-intro-col">
                                <h2><?php _e( '📖 How to Use', 'stackable' ) ?></h2>
                                <ol>
                                    <li><?php printf( __( 'Edit your page and click on the %s button to add a block', 'stackable' ), '<img src="' . esc_attr( $plus_image ) . '" class="s-plus-button"/>' ) ?></li>
                                    <li><?php _e( 'Scroll down and pick a Stackable block and customize it!', 'stackable' ) ?></li>
                                </ol>
                            </div>
                            <div class="s-intro-col">
                                <p><img src="<?php echo esc_url( plugins_url( 'images/stackable-how.gif', __FILE__ ) ) ?>" alt="<?php esc_attr_e( 'Stackable Screenshot' ) ?>" class="s-gif"/></p>
                            </div>
                        </article>
                        <article class="s-box">
                            <h2><?php _e( '🎛 Enable & Disable Blocks', 'stackable' ) ?></h2>
                            <p><?php _e( 'We have a lot of awesome blocks. But if you\'re overwhelmed with awesomeness, you can hide some of them.' , 'stackable' ) ?><br /><em><?php _e( '(If your post contains a disabled block, it will still continue to work. You won\'t just be able to add the disabled blocks.)' , 'stackable' ) ?></em></p>
							<!-- We put all the block controls here. -->
                            <div class="s-settings-wrapper" />
                        </article>
                    </div>
                    <div class="s-side">
                        <aside class="s-box">
                            <h3><?php _e( '🍺 Free Theme Download', 'stackable' ) ?></h3>
                            <p><?php _e( 'Get our FREE WordPress theme that\'s beautiful & flexible, and made especially for Stackable blocks and the new WordPress editor. Subscribe to our newsletter to get the Stackable Theme now.', 'stackable' ) ?></p>
                            <p><a href="https://rebrand.ly/plugin-welcome-theme-download" class="s-button" target="blank" title="Subscibe & Download"><?php _e( 'Subscribe & Download', 'stackable' ) ?></a></p>
                        </aside>
                        <!-- <aside class="s-box s-news-box">
							<h3><?php _e( '🗞 Stackable News', 'stackable' ) ?></h3>
							<?php // stackable_news_feed_links() ?>
							<p><?php _e( 'Keep up to date by subscribing to our newsletter.', 'stackable' ) ?></p>
							<p><a href="https://rebrand.ly/plugin-welcome-subscribe" class="s-button" target="blank" title="Subscibe"><?php _e( 'Subscribe', 'stackable' ) ?></a></p>
                        </aside> -->
                        <aside class="s-box s-support-box">
                            <h3><?php _e( '🐛 Suggestions or Bug Reports', 'stackable' ) ?></h3>
                            <p><?php _e( 'If you have any suggestions and bug reports, let us know in our plugin support forum.', 'stackable' ) ?></p>
                            <p><a href="https://rebrand.ly/plugin-welcome-report" target="blank" title="Support Forum"><?php _e( 'Plugin Support Forum', 'stackable' ) ?></a></p>
                        </aside>
                    </div>
                </section>
            </div>
            <?php
        }

        /**
         * Adds a marker to remember to redirect after activation.
         * Redirecting right away will not work.
         */
        public static function start_redirect_to_welcome_page() {
            update_option( 'stackable_redirect_to_welcome', '1' );
        }

        /**
         * Redirect to the welcome screen if our marker exists.
         */
        public function redirect_to_welcome_page() {
            if ( get_option( 'stackable_redirect_to_welcome' ) ) {
                delete_option( 'stackable_redirect_to_welcome' );
                wp_redirect( esc_url( admin_url( 'admin.php?page=stackable' ) ) );
                die();
            }
        }
    }

    new Stackable_Welcome_Screen();
}

// Redirect to the welcome screen.
register_activation_hook( STACKABLE_FILE, array( 'Stackable_Welcome_Screen', 'start_redirect_to_welcome_page' ) );
