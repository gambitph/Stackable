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

			// Our main menu.
            add_menu_page(
                __( 'Stackable', STACKABLE_I18N ), // Page Title.
                __( 'Stackable', STACKABLE_I18N ) . ' ' . stackable_notification_count(), // Menu Title.
                'edit_posts', // Capability.
                'stackable', // Menu slug.
                array( $this, 'stackable_getting_started_content' ), // Action.
                'data:image/svg+xml;base64,' . base64_encode( $svg ) // Stackable icon.
            );

			// Our getting started page.
			add_submenu_page(
				'stackable', // Parent slug.
				__( 'Getting Started', STACKABLE_I18N ), // Page title.
				__( 'Getting Started', STACKABLE_I18N ), // Menu title.
				'manage_options', // Capability.
				'stackable', // Menu slug.
				array( $this, 'stackable_getting_started_content' ), // Callback function.
				1 // Position
			);

			// Our settings page.
			add_submenu_page(
				'stackable', // Parent slug.
				__( 'Settings', STACKABLE_I18N ), // Page title.
				__( 'Settings', STACKABLE_I18N ) . ' ' . stackable_notification_count(), // Menu title.
				'manage_options', // Capability.
				'stackable-settings', // Menu slug.
				array( $this, 'stackable_settings_content' ), // Callback function.
				2 // Position
			);
		}

        public function enqueue_dashboard_script( $hook ) {
			// For stackable pages, show our admin css.
            if ( 'toplevel_page_stackable' === $hook || stripos( $hook, 'page_stackable' ) !== false ) {
				wp_enqueue_style( 'stackable-welcome', plugins_url( 'dist/admin_welcome.css', STACKABLE_FILE ), array() );
			}

			// For the options page, load our options script.
			if ( 'toplevel_page_stackable' === $hook || stripos( $hook, 'page_stackable-settings' ) !== false ) {
				// Add translations.
				wp_set_script_translations( 'stackable-welcome', STACKABLE_I18N );

				wp_enqueue_script( 'wp-i18n' );
				wp_enqueue_script( 'wp-element' );
				wp_enqueue_script( 'wp-hooks' );
				wp_enqueue_script( 'wp-util' ); // Need wp.ajax.
				wp_enqueue_script( 'wp-components' ); // Need Spinner.
				wp_enqueue_style( 'wp-components' ); // Need Spinner.

				wp_enqueue_script( 'stackable-welcome', plugins_url( 'dist/admin_welcome.js', STACKABLE_FILE ), array( 'wp-i18n', 'wp-element', 'wp-hooks', 'wp-util', 'wp-components', 'wp-api' ) );

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
					'showProNoticesOption' => STACKABLE_SHOW_PRO_NOTICES && ! sugb_fs()->can_use_premium_code(),
					'nonceNews' => stackable_get_news_feed_nonce(),
				) );
            }
        }

		public static function print_tabs() {
			$screen = get_current_screen();
			?>
			<div class="s-body s-tabs">
				<a class="s-tab <?php echo $screen->base === 'toplevel_page_stackable' ? 's-active' : '' ?>"
					href="<?php echo admin_url( 'admin.php?page=stackable' ) ?>">
					<?php _e( 'Getting Started', STACKABLE_I18N ) ?>
				</a>

				<a class="s-tab <?php echo $screen->base === 'stackable_page_stackable-settings' ? 's-active' : '' ?>"
					href="<?php echo admin_url( 'admin.php?page=stackable-settings' ) ?>">
					<?php _e( 'Settings', STACKABLE_I18N ) ?>
				</a>

				<?php if ( sugb_fs()->get_user() ) { ?>
					<a class="s-tab <?php echo $screen->base === 'stackable_page_stackable-account' ? 's-active' : '' ?>"
						href="<?php echo sugb_fs()->get_account_url() ?>">
						<?php _e( 'Account', STACKABLE_I18N ) ?>
					</a>
				<?php } ?>

				<?php if ( sugb_fs()->has_affiliate_program() ) { ?>
					<a class="s-tab <?php echo $screen->base === 'stackable_page_stackable-affiliation' ? 's-active' : '' ?>"
						href="<?php echo admin_url( 'admin.php?page=stackable-affiliation' ) ?>">
						<?php _e( 'Affiliation', STACKABLE_I18N ) ?>
					</a>
				<?php } ?>

				<a class="s-tab" href="https://wpstackable.com/documentation" target="_docs"><?php _e( 'Documentation', STACKABLE_I18N ) ?></a>

				<a class="s-tab <?php echo $screen->base === 'stackable_page_stackable-contact' ? 's-active' : '' ?>"
					href="<?php echo admin_url( 'admin.php?page=stackable-contact' ) ?>">
					<?php _e( 'Contact Us', STACKABLE_I18N ) ?>
				</a>

				<?php if ( ! sugb_fs()->can_use_premium_code() ) { ?>
					<a class="s-tab s-tab-premium" href="<?php echo esc_url( sugb_fs()->get_upgrade_url() ) ?>"><?php _e( 'Go Premium', STACKABLE_I18N ) ?></a>
				<?php } else { ?>
					<a class="s-tab s-tab-premium" href="<?php echo esc_url( sugb_fs()->get_upgrade_url() ) ?>"><?php _e( 'Pricing', STACKABLE_I18N ) ?></a>
				<?php } ?>

			</div>
			<?php
		}

		public static function print_header( $title = '' ) {
			?>
			<header class="s-header">
				<?php if ( ! empty( $title ) ) { ?>
					<h1><?php echo $title ?></h1>
				<?php } ?>
				<img src="<?php echo esc_url( plugins_url( 'images/stackable-logo.png', __FILE__ ) ) ?>" alt="<?php esc_attr_e( 'Stackable', STACKABLE_I18N ) ?>"/>
			</header>
			<div class="s-separator">
				<svg viewBox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="fill:#111111;transform:scaleX(1)"><path class="wave-1_svg__st2" d="M1341.4 48.9c-182.4 0-254.2 80.4-429.4 80.4-117.8 0-209.7-67.5-393.5-67.5-142.2 0-212.6 38.8-324.6 38.8S-10 64.7-10 64.7V210h1620V102c-110.6-40.2-181-53.1-268.6-53.1z"></path></svg>
				<svg viewBox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" class="ugb-separator__layer-2" style="transform: scaleX(1) scaleY(1);fill:#8c33da;opacity:0.5"><path d="M1361.5 65.9c-63.2 0-93.4-27.3-186.7-27.3-83.3 0-127.8 44.5-238.4 44.5-116.3 0-127.8-51.7-234.1-51.7S542.9 84.6 471.1 84.6c-129.3 0-178.1-79-337.5-83.3C60.2-.7-10 14.2-10 14.2l-.9 185.8h1620l.9-162.8c-57.5 0-137.9 28.7-248.5 28.7z"></path></svg>
				<svg viewBox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" class="ugb-separator__layer-3" style="transform: scaleX(1) scaleY(1);fill:#f34957;opacity:0.5"><path d="M1476.4 15.9c-146.5 0-146.5 64.6-285.8 64.6-119.2 0-106.3-53.1-271.4-53.1-93.4 0-125 41.6-231.3 41.6-93.3 0-114.9-43.1-248.4-43.1S183.8 129.3 96.2 129.3H-10V206h1620V37.4s-43.1-21.5-133.6-21.5z"></path></svg>
			</div>
			<?php
		}

        public function stackable_settings_content() {
            ?>
            <div class="wrap">
				<?php $this->print_header( __( 'Settings', STACKABLE_I18N ) ) ?>
				<?php echo $this->print_tabs() ?>
                <section class="s-body-container s-body-container-grid">
                    <div class="s-body">
                        <?php stackable_welcome_notification() ?>
                        <article class="s-box">
                            <h2><?php _e( '🎛 Enable & Disable Blocks', STACKABLE_I18N ) ?></h2>
                            <p><?php _e( 'We have a lot of awesome blocks. But if you\'re overwhelmed with awesomeness, you can hide some of them.' , STACKABLE_I18N ) ?><br /><em><?php _e( '(If your post contains a disabled block, it will still continue to work. You won\'t just be able to add the disabled blocks.)' , STACKABLE_I18N ) ?></em></p>
							<!-- We put all the block controls here. -->
                            <div class="s-settings-wrapper" />
						</article>
						<!-- We put all the other options here. -->
						<aside class="s-other-options-wrapper"></aside>
                    </div>
                    <div class="s-side">
						<?php if ( ! sugb_fs()->can_use_premium_code() ) : ?>
                        <aside class="s-box s-premium-box">
                            <h3><?php _e( '🚀 Stackable Premium', STACKABLE_I18N ) ?></h3>
							<p><?php _e( 'If you are ready for even more, upgrade to Premium and get:', STACKABLE_I18N ) ?></p>
								<ul class="s-check-list">
									<li><?php _e( '60+ Premium Layouts', STACKABLE_I18N ) ?></li>
									<li><?php _e( '220+ Premium Block Designs', STACKABLE_I18N ) ?></li>
									<li><?php _e( 'One-Click Switchable Designs', STACKABLE_I18N ) ?></li>
									<li><?php _e( 'Additional Block Options', STACKABLE_I18N ) ?></li>
									<li><?php _e( '3-Layer Separators', STACKABLE_I18N ) ?></li>
									<li><?php _e( 'All Premium Effects', STACKABLE_I18N ) ?></li>
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
		 * Gets the video URL. If we are in development mode, display the source video,
		 * if in an actual site, use the one in the CDN.
		 */
		private function get_video_url( $video_file ) {
			if ( file_exists( untrailingslashit( plugin_dir_path( __FILE__ ) ) . '/videos/' . $video_file ) ) {
				return untrailingslashit( plugins_url( '/', STACKABLE_FILE ) ) . '/src/welcome/videos/' . $video_file;
			}
			return untrailingslashit( STACKABLE_CLOUDFRONT_URL ) . '/dist/videos/welcome/' . $video_file;
		}

		/**
		 * Getting Started Content
		 */
		public function stackable_getting_started_content() {
            ?>
            <div class="wrap getting-started">
				<?php $this->print_header() ?>
				<section class="s-body-container s-narrow s-body-container-center">
					<?php $this->print_tabs() ?>
					<div class="s-body s-box s-box-spaced">
						<h2 class="s-title"><?php _e( '🚀 Getting Started', STACKABLE_I18N ) ?></h2>
						<div class="s-spacer"></div>
						<div class="s-getting-started-body">
							<div>
								<h3><?php _e( '1. Choose Block Templates from the Design Library', STACKABLE_I18N ) ?></h3>
								<p><?php _e( 'After adding a new page/post, select "Design Library" at the top of your editing screen', STACKABLE_I18N ) ?></p>
								<p><?php _e( 'Choose your preferred design and add it to your page.', STACKABLE_I18N ) ?></p>
								<p class="s-tip">👉 <em><?php _e( 'Tip: After adding, you can easily switch between block designs in the block\'s settings', STACKABLE_I18N ) ?></em></p>
							</div>
							<div>
								<video
									autoPlay
									loop
									muted
									role="img"
									src="<?php echo $this->get_video_url( 'getting-started-step1.mp4' ) ?>"
								/>
							</div>
						</div>
						<div class="s-getting-started-body">
							<div>
								<video
									autoPlay
									loop
									muted
									role="img"
									src="<?php echo $this->get_video_url( 'getting-started-step2.mp4' ) ?>"
								/>
							</div>
							<div>
								<h3><?php _e( '2. Add a New Stackable block', STACKABLE_I18N ) ?></h3>
								<p><?php _e( 'To add a new Stackable block, just follow these steps:', STACKABLE_I18N ) ?></p>
								<ol>
									<li><?php printf( __( 'Click the %s icon found at the top left corner of the page.', STACKABLE_I18N ), '<img src="' . esc_url( plugins_url( 'images/editor-plus-icon.svg', __FILE__ ) ) . '" class="s-plus-button"/>' ) ?></li>
									<li><?php _e( 'Navigate through the Stackable section and click on your preferred block', STACKABLE_I18N ) ?></li>
								</ol>
								<p class="s-tip">👉 <em><?php _e( 'Tip: You can distinguish Stackable blocks easily with their purple and pink colored icons', STACKABLE_I18N ) ?></em></p>
							</div>
						</div>
						<div class="s-getting-started-body">
							<div>
								<h3><?php _e( '3. Customize your Block', STACKABLE_I18N ) ?></h3>
								<p><?php _e( 'You can easily customize the look of your block with the Inspector found at the right side of the editor. Each tab of the inspector contains different block settings:', STACKABLE_I18N ) ?></p>
								<ul>
									<li><?php printf( __( '%sLayout Tab%s - Allows you to switch to your desired layout or design for the block.', STACKABLE_I18N ), '<strong>', '</strong>' ) ?></li>
									<li><?php printf( __( '%sStyle Tab%s - Toggle on/off different block elements. You can also customize your fonts, colors, backgrounds, and more.', STACKABLE_I18N ), '<strong>', '</strong>' ) ?></li>
									<li><?php printf( __( '%sAdvanced Tab%s - Adjust more complex settings, spacing, CSS and the responsiveness of the block.', STACKABLE_I18N ), '<strong>', '</strong>' ) ?></li>
								</ul>
								<p class="s-tip">👉 <em><?php _e( 'Tip: Each block is unique and has different layouts, designs and style options', STACKABLE_I18N ) ?></em></p>
							</div>
							<div>
								<video
									autoPlay
									loop
									muted
									role="img"
									src="<?php echo $this->get_video_url( 'getting-started-step3.mp4' ) ?>"
								/>
							</div>
						</div>
						<div class="s-spacer"></div>
						<div class="s-buttons">
							<p><a href="<?php echo esc_url( admin_url( 'post-new.php?post_type=page&stackable_show_intro=true' ) ) ?>" class="s-button" title="<?php esc_attr_e( 'Create New Page', STACKABLE_I18N ) ?>"><?php _e( 'Create New Page', STACKABLE_I18N ) ?></a></p>
							<p><a href="https://wpstackable.com/blog/how-to-add-content-using-stackable" class="s-button s-button-plain" title="<?php esc_attr_e( 'Read Full Guide', STACKABLE_I18N ) ?>" target="_tutorial"><?php _e( 'Read Full Guide', STACKABLE_I18N ) ?> <span class="dashicons dashicons-arrow-right-alt"></span></a></p>
						</div>
						<div class="s-spacer"></div>
						<h2 class="s-title"><?php _e( '📹 3-Minute Introduction Video', STACKABLE_I18N ) ?></h2>
						<p class="s-center"><?php _e( 'More of a tutorial person? Check out this video to see what you can do with Stackable.', STACKABLE_I18N ) ?></p>
						<iframe
							class="s-video"
							title="Video Tutorial"
							width="853"
							height="505"
							src="https://www.youtube.com/embed/UW0Rg96aATA"
							frameBorder="0"
							allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen></iframe>
						<div class="s-spacer"></div>
						<div class="s-buttons">
							<p><a href="<?php echo esc_url( admin_url( 'post-new.php?post_type=page&stackable_show_intro=true' ) ) ?>" class="s-button" title="<?php esc_attr_e( 'Create New Page', STACKABLE_I18N ) ?>"><?php _e( 'Create New Page', STACKABLE_I18N ) ?></a></p>
							<p><a href="https://wpstackable.com/blog/how-to-add-content-using-stackable" class="s-button s-button-plain" title="<?php esc_attr_e( 'Read Full Guide', STACKABLE_I18N ) ?>" target="_tutorial"><?php _e( 'Read Full Guide', STACKABLE_I18N ) ?> <span class="dashicons dashicons-arrow-right-alt"></span></a></p>
						</div>
						<div class="s-spacer"></div>
						<h2 class="s-title"><?php _e( '🤔 Want to Learn More?', STACKABLE_I18N ) ?></h2>
						<div class="<?php echo sugb_fs()->is_whitelabeled() ? 's-3-column' : 's-4-column' ?>">
							<div class="s-box s-center s-box-small">
								<h3><?php _e( 'Community', STACKABLE_I18N ) ?></h3>
								<p><?php _e( 'Join like-minded people who help each other do amazing things.', STACKABLE_I18N ) ?></p>
								<p><a href="https://rebrand.ly/getting-started-footer-community" class="s-button s-button-small" title="<?php esc_attr_e( 'Join Now', STACKABLE_I18N ) ?>" target="_blank" rel="noopener noreferrer"><?php _e( 'Join Now', STACKABLE_I18N ) ?></a></p>
							</div>
							<div class="s-box s-center s-box-small">
								<h3><?php _e( 'Documentation', STACKABLE_I18N ) ?></h3>
								<p><?php _e( 'Learn how to use Stackable\'s powerful page building tools', STACKABLE_I18N ) ?></p>
								<p><a href="https://rebrand.ly/getting-started-footer-documentation" class="s-button s-button-small" title="<?php esc_attr_e( 'Visit Docs', STACKABLE_I18N ) ?>" target="_blank" rel="noopener noreferrer"><?php _e( 'Visit Docs', STACKABLE_I18N ) ?></a></p>
							</div>
							<div class="s-box s-center s-box-small">
								<h3><?php _e( 'Blog', STACKABLE_I18N ) ?></h3>
								<p><?php _e( 'Browse through our articles and find what you\'re looking for', STACKABLE_I18N ) ?></p>
								<p><a href="https://rebrand.ly/getting-started-footer-blog" class="s-button s-button-small" title="<?php esc_attr_e( 'Read More', STACKABLE_I18N ) ?>" target="_blank" rel="noopener noreferrer"><?php _e( 'Read More', STACKABLE_I18N ) ?></a></p>
							</div>
							<?php if ( ! sugb_fs()->is_whitelabeled() ) { ?>
								<div class="s-box s-center s-box-small">
									<?php
									if ( ! sugb_fs()->can_use_premium_code() ) {
										?>
										<h3><?php _e( 'Get Support', STACKABLE_I18N ) ?></h3>
										<p><?php _e( 'Upgrade to Premium and our support team can help you out.', STACKABLE_I18N ) ?></p>
										<p><a href="https://rebrand.ly/getting-started-footer-support" class="s-button s-button-small" title="<?php esc_attr_e( 'Learn More', STACKABLE_I18N ) ?>" target="_blank" rel="noopener noreferrer"><?php _e( 'Learn More', STACKABLE_I18N ) ?></a></p>
										<?php
									} else {
										?>
										<h3><?php _e( 'Get Support', STACKABLE_I18N ) ?></h3>
										<p><?php _e( 'Stuck with something? Email us and we’ll help you out.', STACKABLE_I18N ) ?></p>
										<p><a href="<?php echo esc_url( sugb_fs()->contact_url( 'technical_support' ) ) ?>" class="s-button s-button-small" title="<?php esc_attr_e( 'Contact Support', STACKABLE_I18N ) ?>"><?php _e( 'Contact Support', STACKABLE_I18N ) ?></a></p>
										<?php
									}
									?>
								</div>
							<?php } ?>
						</div>
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
