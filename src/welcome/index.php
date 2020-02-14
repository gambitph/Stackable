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
                __( 'Stackable', STACKABLE_I18N ), // Page Title.
                __( 'Stackable', STACKABLE_I18N ) . ' ' . stackable_notification_count(), // Menu Title.
                'edit_posts', // Capability.
                'stackable', // Menu slug.
                array( $this, 'stackable_welcome_content' ), // Action.
                'data:image/svg+xml;base64,' . base64_encode( $svg ) // Stackable icon.
            );
        }

        public function enqueue_dashboard_script( $hook ) {
            if ( 'toplevel_page_stackable' === $hook ) {
				wp_enqueue_style( 'stackable-welcome', plugins_url( 'dist/admin_welcome.css', STACKABLE_FILE ), array() );

				// Add translations.
				wp_set_script_translations( 'stackable-welcome', STACKABLE_I18N );

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
					'i18n' => STACKABLE_I18N,
					'cdnUrl' => STACKABLE_CLOUDFRONT_URL,
					'isPro' => sugb_fs()->can_use_premium_code(),
					'showProNotice' => stackable_should_show_pro_notices(),
					'pricingURL' => sugb_fs()->get_upgrade_url(),
					'contactURL' => ! sugb_fs()->is_whitelabeled() ? sugb_fs()->contact_url( 'technical_support' ) : '',
					'planName' => sugb_fs()->get_plan_name(),
					'disabledBlocks' => stackable_get_disabled_blocks(),
					'nonce' => stackable_get_disabled_blocks_nonce(),
					'showProNoticesOption' => stackable_show_pro_notices_option(),
					'nonceProNotice' => stackable_show_pro_notices_option_nonce(),
					'nonceNews' => stackable_get_news_feed_nonce(),
					'loadV1Styles' => stackable_should_load_v1_styles(),
					'nonceLoadV1Styles' => stackable_load_v1_styles_nonce(),
				) );
            }
        }

        public function stackable_welcome_content() {
            ?>
            <div class="wrap">
                <header class="s-header">
                    <h1><?php _e( 'Help & Settings', STACKABLE_I18N ) ?></h1>
					<img src="<?php echo esc_url( plugins_url( 'images/stackable-logo.png', __FILE__ ) ) ?>" alt="<?php esc_attr_e( 'Stackable', STACKABLE_I18N ) ?>"/>
                </header>
				<div class="s-separator">
					<svg viewBox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="fill:#111111;transform:scaleX(1)"><path class="wave-1_svg__st2" d="M1341.4 48.9c-182.4 0-254.2 80.4-429.4 80.4-117.8 0-209.7-67.5-393.5-67.5-142.2 0-212.6 38.8-324.6 38.8S-10 64.7-10 64.7V210h1620V102c-110.6-40.2-181-53.1-268.6-53.1z"></path></svg>
					<svg viewBox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" class="ugb-separator__layer-2" style="transform: scaleX(1) scaleY(1);fill:#8c33da;opacity:0.5"><path d="M1361.5 65.9c-63.2 0-93.4-27.3-186.7-27.3-83.3 0-127.8 44.5-238.4 44.5-116.3 0-127.8-51.7-234.1-51.7S542.9 84.6 471.1 84.6c-129.3 0-178.1-79-337.5-83.3C60.2-.7-10 14.2-10 14.2l-.9 185.8h1620l.9-162.8c-57.5 0-137.9 28.7-248.5 28.7z"></path></svg>
					<svg viewBox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" class="ugb-separator__layer-3" style="transform: scaleX(1) scaleY(1);fill:#f34957;opacity:0.5"><path d="M1476.4 15.9c-146.5 0-146.5 64.6-285.8 64.6-119.2 0-106.3-53.1-271.4-53.1-93.4 0-125 41.6-231.3 41.6-93.3 0-114.9-43.1-248.4-43.1S183.8 129.3 96.2 129.3H-10V206h1620V37.4s-43.1-21.5-133.6-21.5z"></path></svg>
				</div>
                <section class="s-body-container">
                    <div class="s-body">
                        <?php stackable_welcome_notification() ?>
                        <article class="s-intro s-box">
                            <div class="s-intro-col">
                                <h2><?php _e( '👋 Let\'s Get Started', STACKABLE_I18N ) ?></h2>
                                <p><?php _e( 'You now have Stackable blocks in your block editor 🤘', STACKABLE_I18N ) ?></p>
								<ol>
									<li><?php printf( __( 'Create a new page and click on the %s button to add a block', STACKABLE_I18N ), '<img src="' . esc_url( plugins_url( 'images/editor-plus-icon.svg', __FILE__ ) ) . '" class="s-plus-button"/>' ) ?></li>
									<li><?php _e( 'Scroll down and pick a Stackable block and customize it!', STACKABLE_I18N ) ?></li>
								</ol>
								<p><img src="https://gambitph.github.io/Stackable/assets/welcome/how.gif" alt="<?php esc_attr_e( '📖 How to Use', STACKABLE_I18N ) ?>" class="s-gif"/></p>
								<p><a href="<?php echo esc_url( admin_url( 'post-new.php?post_type=page&stackable_show_intro=true' ) ) ?>" class="s-button" title="<?php esc_attr_e( 'Create New Page', STACKABLE_I18N ) ?>"><?php _e( 'Create New Page', STACKABLE_I18N ) ?></a></p>
                            </div>
                            <div class="s-intro-col">
								<h2><?php _e( '🤔 Need Some Help?', STACKABLE_I18N ) ?></h2>
								<div id="s-help-area"></div>
                            </div>
                        </article>
                        <article class="s-box">
                            <h2><?php _e( '🎛 Enable & Disable Blocks', STACKABLE_I18N ) ?></h2>
                            <p><?php _e( 'We have a lot of awesome blocks. But if you\'re overwhelmed with awesomeness, you can hide some of them.' , STACKABLE_I18N ) ?><br /><em><?php _e( '(If your post contains a disabled block, it will still continue to work. You won\'t just be able to add the disabled blocks.)' , STACKABLE_I18N ) ?></em></p>
							<!-- We put all the block controls here. -->
                            <div class="s-settings-wrapper" />
						</article>
						<aside class="s-backward-compatibility-control-wrapper"></aside>
						<?php if ( STACKABLE_SHOW_PRO_NOTICES && ! sugb_fs()->can_use_premium_code() ): ?>
							<aside class="s-pro-control-wrapper"></aside>
						<?php endif; ?>
                    </div>
                    <div class="s-side">
						<?php if ( ! sugb_fs()->can_use_premium_code() ) : ?>
                        <aside class="s-box s-premium-box">
                            <h3><?php _e( '🚀 Stackable Premium', STACKABLE_I18N ) ?></h3>
							<p><?php _e( 'If you are ready for even more, upgrade to Premium and get:', STACKABLE_I18N ) ?></p>
								<ul class="s-check-list">
									<li><?php _e( '50+ Premium Layouts', STACKABLE_I18N ) ?></li>
									<li><?php _e( 'Seamless Layout Switching', STACKABLE_I18N ) ?></li>
									<li><?php _e( 'All Premium Effects', STACKABLE_I18N ) ?></li>
									<li><?php _e( '3-Layer Separators', STACKABLE_I18N ) ?></li>
									<li><?php _e( 'Custom CSS', STACKABLE_I18N ) ?></li>
									<li><?php _e( 'No Ads', STACKABLE_I18N ) ?></li>
									<li><?php _e( 'Customer Email Support', STACKABLE_I18N ) ?></li>
									<li><?php _e( 'Lifetime Use', STACKABLE_I18N ) ?></li>
									<li><?php _e( '1 Year of Updates & Support', STACKABLE_I18N ) ?></li>
								</ul>
							</p>
							<p>
								<a href="<?php echo esc_url( sugb_fs()->get_upgrade_url() ) ?>" class="s-button" title="<?php esc_attr_e( 'Get Stackable Premium', STACKABLE_I18N ) ?>"><?php esc_attr_e( 'Get Stackable Premium', STACKABLE_I18N ) ?></a>
							</p>
							<p>
								<a href="https://rebrand.ly/plugin-learn-premium-side" title="<?php esc_attr_e( 'Learn More', STACKABLE_I18N ) ?>" target="_blank" rel="noopener noreferrer"><?php esc_attr_e( 'Learn More', STACKABLE_I18N ) ?> →</a>
							</p>
						</aside>
						<?php endif; ?>
                        <aside class="s-box">
                            <h3><?php _e( '🍺 Free Theme Download', STACKABLE_I18N ) ?></h3>
                            <p><?php _e( 'Get our FREE WordPress theme that\'s beautiful & flexible, and made especially for Stackable blocks and the new WordPress editor. Subscribe to our newsletter to get the Stackable Theme now.', STACKABLE_I18N ) ?></p>
							<p><a href="https://rebrand.ly/plugin-welcome-theme-download" class="s-button" target="_blank" title="<?php esc_attr_e( 'Subscribe & Download', STACKABLE_I18N ) ?>"><?php _e( 'Subscribe & Download', STACKABLE_I18N ) ?></a></p>
                        </aside>
                        <aside class="s-box s-news-box">
							<h3><?php _e( '🗞 Stackable Blog', STACKABLE_I18N ) ?></h3>
							<div class="s-news-box-content"><?php stackable_news_feed_links_cached() ?></div>
							<p><?php _e( 'Keep up to date by subscribing to our newsletter.', STACKABLE_I18N ) ?></p>
							<p><a href="https://rebrand.ly/plugin-welcome-subscribe" class="s-button" target="_blank" title="<?php esc_attr_e( 'Subscribe', STACKABLE_I18N ) ?>"><?php _e( 'Subscribe', STACKABLE_I18N ) ?></a></p>
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
