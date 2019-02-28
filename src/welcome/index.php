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

			// @see images/stackable-icon.svg
			$svg = <<< SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style="fill: #ffffff;">
	<path d="M64.08,136L23,176.66a4.75,4.75,0,0,0,3.53,8.15l86.91,0.14Z"/>
	<path d="M177.91,128.39a17,17,0,0,0-5-12.07L71.39,14.72h0L26.61,59.5a17,17,0,0,0-5,12.05h0a17,17,0,0,0,5,12.05L128.16,185.2v-0.07l0,0,44.76-44.76a17,17,0,0,0,5-12h0Z"/>
	<path d="M172.95,14.69l-86.83,0,49.42,49.62,40.92-41.16A5,5,0,0,0,172.95,14.69Z"/>
</svg>
SVG;

            add_menu_page(
                __( 'Stackable', 'stackable' ), // Page Title.
                __( 'Stackable', 'stackable' ) . ' ' . stackable_notification_count(), // Menu Title.
                'edit_posts', // Capability.
                'stackable', // Menu slug.
                array( $this, 'stackable_welcome_content' ), // Action.
                'data:image/svg+xml;base64,' . base64_encode( $svg ) // Stackable icon.
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
					'srcUrl' => untrailingslashit( plugins_url( '/', STACKABLE_FILE ) ),
					'welcomeSrcUrl' => untrailingslashit( plugins_url( '/', __FILE__ ) ),
					'isPro' => sugb_fs()->can_use_premium_code(),
					'showProNotice' => stackable_should_show_pro_notices(),
					'pricingURL' => sugb_fs()->get_upgrade_url(),
					'planName' => sugb_fs()->get_plan_name(),
					'disabledBlocks' => stackable_get_disabled_blocks(),
					'nonce' => stackable_get_disabled_blocks_nonce(),
					'showProNoticesOption' => stackable_show_pro_notices_option(),
					'nonceProNotice' => stackable_show_pro_notices_option_nonce(),
					'nonceNews' => stackable_get_news_feed_nonce(),
				) );
            }
        }

        public function stackable_welcome_content() {
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
                                    <li><?php printf( __( 'Edit your page and click on the %s button to add a block', 'stackable' ), '<img src="' . esc_url( plugins_url( 'images/editor-plus-icon.svg', __FILE__ ) ) . '" class="s-plus-button"/>' ) ?></li>
                                    <li><?php _e( 'Scroll down and pick a Stackable block and customize it!', 'stackable' ) ?></li>
                                </ol>
                            </div>
                            <div class="s-intro-col">
                                <p><img src="https://gambitph.github.io/Stackable/assets/welcome/how.gif" alt="<?php esc_attr_e( 'Stackable Screenshot' ) ?>" class="s-gif"/></p>
                            </div>
                        </article>
                        <article class="s-box">
                            <h2><?php _e( '🎛 Enable & Disable Blocks', 'stackable' ) ?></h2>
                            <p><?php _e( 'We have a lot of awesome blocks. But if you\'re overwhelmed with awesomeness, you can hide some of them.' , 'stackable' ) ?><br /><em><?php _e( '(If your post contains a disabled block, it will still continue to work. You won\'t just be able to add the disabled blocks.)' , 'stackable' ) ?></em></p>
							<!-- We put all the block controls here. -->
                            <div class="s-settings-wrapper" />
						</article>
						<?php if ( STACKABLE_SHOW_PRO_NOTICES && ! sugb_fs()->can_use_premium_code() ): ?>
							<aside class="s-pro-control-wrapper"></aside>
						<?php endif; ?>
                    </div>
                    <div class="s-side">
						<?php if ( ! sugb_fs()->can_use_premium_code() ) : ?>
                        <aside class="s-box s-premium-box">
                            <h3><?php _e( '🚀 Stackable Premium', 'stackable' ) ?></h3>
                            <p><?php _e( 'If you are ready for even more, Stackable Premium will give you premium layout options, effects and other goodies for creating your perfect site!', 'stackable' ) ?></p>
							<div class="s-premium-box__button">
								<p><a href="<?php echo esc_url( sugb_fs()->get_upgrade_url() ) ?>" class="s-button" title="<?php esc_attr_e( 'View Premium Features', 'stackable' ) ?>"><?php _e( 'View Premium Features', 'stackable' ) ?></a></p>
							</div>
							<p><a href="https://rebrand.ly/plugin-learn-premium-side" target="_blank" title="<?php esc_attr_e( 'Visit Plugin Site', 'stackable' ) ?>"><?php _e( 'Visit Plugin Site', 'stackable' ) ?></a></p>
						</aside>
						<?php endif; ?>
                        <aside class="s-box">
                            <h3><?php _e( '🍺 Free Theme Download', 'stackable' ) ?></h3>
                            <p><?php _e( 'Get our FREE WordPress theme that\'s beautiful & flexible, and made especially for Stackable blocks and the new WordPress editor. Subscribe to our newsletter to get the Stackable Theme now.', 'stackable' ) ?></p>
                            <p><a href="https://rebrand.ly/plugin-welcome-theme-download" class="s-button" target="_blank" title="<?php esc_attr_e( 'Subscribe & Download', 'stackable' ) ?>"><?php _e( 'Subscribe & Download', 'stackable' ) ?></a></p>
                        </aside>
                        <aside class="s-box s-news-box">
							<h3><?php _e( '🗞 Stackable News', 'stackable' ) ?></h3>
							<div class="s-news-box-content"><?php stackable_news_feed_links_cached() ?></div>
							<p><?php _e( 'Keep up to date by subscribing to our newsletter.', 'stackable' ) ?></p>
							<p><a href="https://rebrand.ly/plugin-welcome-subscribe" class="s-button" target="_blank" title="<?php esc_attr_e( 'Subscribe', 'stackable' ) ?>"><?php _e( 'Subscribe', 'stackable' ) ?></a></p>
                        </aside>
                        <aside class="s-box s-support-box">
                            <h3><?php _e( '🐛 Suggestions or Bug Reports', 'stackable' ) ?></h3>
                            <p><?php _e( 'If you have any suggestions and bug reports, let us know in our plugin support forum.', 'stackable' ) ?></p>
                            <p><a href="https://rebrand.ly/plugin-welcome-report" target="_blank" title="<?php esc_attr_e( 'Plugin Support Forum', 'stackable' ) ?>"><?php _e( 'Plugin Support Forum', 'stackable' ) ?></a></p>
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
