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

			$plugin = plugin_basename( STACKABLE_FILE );
			add_filter( 'plugin_action_links_' . $plugin, array( $this, 'add_settings_link' ) );
        }

        public function add_dashboard_page() {

			// Our settings page.
			add_submenu_page(
				'options-general.php', // Parent slug.
				__( 'Stackable', STACKABLE_I18N ), // Page title.
				__( 'Stackable', STACKABLE_I18N ) . ' ' . stackable_notification_count(), // Menu title.
				'manage_options', // Capability.
				'stackable', // Menu slug.
				array( $this, 'stackable_settings_content' ), // Callback function.
				null // Position
			);

			// Our getting started page.
			add_submenu_page(
				isset( $_GET['page'] ) && $_GET['page'] === 'stackable-getting-started' ? 'options-general.php' : '', // Parent slug. Only show when in the page.
				__( 'Get Started', STACKABLE_I18N ), // Page title.
				'<span class="fs-submenu-item fs-sub"></span>' . __( 'Get Started', STACKABLE_I18N ), // Menu title.
				'manage_options', // Capability.
				'stackable-getting-started', // Menu slug.
				array( $this, 'stackable_getting_started_content' ), // Callback function.
				null // Position
			);
		}

        public function enqueue_dashboard_script( $hook ) {
			// For stackable pages, show our admin css.
            if ( 'settings_page_stackable' === $hook || stripos( $hook, 'page_stackable' ) !== false || stripos( $hook, 'page_stk' ) !== false ) {
				wp_enqueue_style( 'stackable-welcome', plugins_url( 'dist/admin_welcome.css', STACKABLE_FILE ), array() );
				wp_enqueue_style( 'ugb-block-editor-css', plugins_url( 'dist/editor_blocks.css', STACKABLE_FILE ), array() );
				do_action( 'stackable_settings_admin_enqueue_styles' );
			}

			// For the options page, load our options script.
			if ( 'settings_page_stackable' === $hook || stripos( $hook, 'page_stackable-settings' ) !== false || 'settings_page_stackable-getting-started' === $hook ) {

				wp_enqueue_script( 'wp-i18n' );
				wp_enqueue_script( 'wp-element' );
				wp_enqueue_script( 'wp-hooks' );
				wp_enqueue_script( 'wp-util' ); // Need wp.ajax.
				wp_enqueue_script( 'wp-components' ); // Need Spinner.
				wp_enqueue_style( 'wp-components' ); // Need Spinner.

				do_action( 'stackable_settings_admin_enqueue_scripts' );

				wp_enqueue_script( 'stackable-welcome', plugins_url( 'dist/admin_welcome.js', STACKABLE_FILE ), array( 'wp-i18n', 'wp-element', 'wp-hooks', 'wp-util', 'wp-components', 'wp-api', 'wp-editor', 'lodash' ) );

				// Add translations.
				wp_set_script_translations( 'stackable-welcome', STACKABLE_I18N );
				stackable_load_js_translations(); // This is needed for the translation strings to be loaded.

				$args = apply_filters( 'stackable_localize_settings_script', array(
					'srcUrl' => untrailingslashit( plugins_url( '/', STACKABLE_FILE ) ),
					'welcomeSrcUrl' => untrailingslashit( plugins_url( '/', __FILE__ ) ),
					'i18n' => STACKABLE_I18N,
					'cdnUrl' => STACKABLE_DESIGN_LIBRARY_URL,
					'isPro' => sugb_fs()->can_use_premium_code() && STACKABLE_BUILD !== 'free',
					'showProNotice' => stackable_should_show_pro_notices(),
					'pricingURL' => 'https://wpstackable.com/premium/?utm_source=wp-settings&utm_campaign=gopremium&utm_medium=wp-dashboard',
					'contactURL' => ! sugb_fs()->is_whitelabeled() ? sugb_fs()->contact_url( 'technical_support' ) : '',
					'planName' => sugb_fs()->get_plan_name(),
					'showProNoticesOption' => STACKABLE_SHOW_PRO_NOTICES && ( ! sugb_fs()->can_use_premium_code() || STACKABLE_BUILD === 'free' ),
					'nonceNews' => stackable_get_news_feed_nonce(),
				) );
				wp_localize_script( 'stackable-welcome', 'stackable', $args );
            }
        }

		public static function print_tabs() {
			$screen = get_current_screen();
			?>
			<div class="s-body s-tabs">
				<a class="s-tab <?php echo $screen->base === 'settings_page_stackable-getting-started' ? 's-active' : '' ?>"
					href="<?php echo admin_url( 'options-general.php?page=stackable-getting-started' ) ?>">
					<span><?php _e( 'Getting Started', STACKABLE_I18N ) ?></span>
				</a>

				<a class="s-tab <?php echo $screen->base === 'settings_page_stackable' ? 's-active' : '' ?>"
					href="<?php echo admin_url( 'options-general.php?page=stackable' ) ?>">
					<span><?php _e( 'Settings', STACKABLE_I18N ) ?></span>
				</a>

				<?php if ( sugb_fs()->get_user() ) { ?>
					<a class="s-tab <?php echo $screen->base === 'settings_page_stackable-account' ? 's-active' : '' ?>"
						href="<?php echo sugb_fs()->get_account_url() ?>">
						<span><?php _e( 'Account', STACKABLE_I18N ) ?></span>
					</a>
				<?php } ?>

				<?php if ( sugb_fs()->has_affiliate_program() ) { ?>
					<a class="s-tab <?php echo $screen->base === 'settings_page_stackable-affiliation' ? 's-active' : '' ?>"
						href="<?php echo admin_url( 'options-general.php?page=stackable-affiliation' ) ?>">
						<span><?php _e( 'Affiliation', STACKABLE_I18N ) ?></span>
					</a>
				<?php } ?>

				<a class="s-tab" href="https://docs.wpstackable.com" target="_docs">
				<span><?php _e( 'Documentation', STACKABLE_I18N ) ?></span></a>

				<a class="s-tab <?php echo $screen->base === 'settings_page_stackable-contact' ? 's-active' : '' ?>"
					href="<?php echo admin_url( 'options-general.php?page=stackable-contact' ) ?>">
					<span><?php _e( 'Contact Us', STACKABLE_I18N ) ?></span>
				</a>

				<?php if ( function_exists( 'stackable_is_custom_fields_enabled' ) ) { ?>
					<?php if ( stackable_is_custom_fields_enabled() && current_user_can( 'manage_stackable_custom_fields' ) ) { ?>
						<a class="s-tab <?php echo $screen->base === 'toplevel_page_stk-custom-fields' ? 's-active' : '' ?>"
							href="<?php echo admin_url( 'admin.php?page=stk-custom-fields' ) ?>">
							<span><?php _e( 'Custom Fields', STACKABLE_I18N ) ?></span>
						</a>
					<?php } ?>
				<?php } ?>
			</div>
			<?php
		}

		public static function print_header( $title = '', $image = 'logo' ) {
			?>
			<header class="s-header s-heading-1 <?php echo ! current_user_can( 'manage_options' ) ? 's-header-no-tabs' : '' ?> s-logo-<?php echo $image ?>" role="heading" aria-level="1" aria-labelledby="s-heading-<?php echo empty( $title ) ? 'logo' : 'title' ?>">
				<img id="s-heading-logo" src="<?php echo esc_url( plugins_url( 'images/stackable-' . $image . '.png', __FILE__ ) ) ?>" alt="<?php esc_attr_e( 'Stackable', STACKABLE_I18N ) ?>"/>
				<span id="s-heading-title"><?php echo $title ?></span>
			</header>
			<?php
		}

		public static function print_premium_button() { ?>
			<?php if ( ! sugb_fs()->can_use_premium_code() ) : ?>

				<a href="https://wpstackable.com/premium/?utm_source=wp-settings-tabs&utm_campaign=gopremium&utm_medium=wp-dashboard" class="s-button s-premium-button" title="<?php esc_attr_e( 'Get Stackable Premium', STACKABLE_I18N ) ?>" target="_new"><?php esc_attr_e( 'Upgrade to Premium', STACKABLE_I18N ) ?></a>
			<?php endif; ?>
		<?php
		}

        public function stackable_settings_content() {
            ?>
            <div class="wrap">
				<div class="s-header-wrap">
					<?php $this->print_header() ?>
					<?php echo $this->print_premium_button() ?>
					<?php echo $this->print_tabs() ?>
				</div>
				<h1 aria-hidden="true" class="s-admin-notice-marker"></h1>
                <section class="s-body-container s-body-container-grid">
                    <div class="s-body">
						<?php stackable_welcome_notification() ?>
						<?php do_action( 'stackable_settings_page' ) ?>
						<article class="s-box" id="editor-settings">
							<h2><?php _e( '🎛 Editor Settings', STACKABLE_I18N ) ?></h2>
							<p class="s-settings-subtitle"><?php _e( 'You can customize some of the features and behavior of Stackable in the editor here.' , STACKABLE_I18N ) ?></em></p>
							<div class="s-editor-settings"></div>
						</article>
						<article class="s-box" id="dynamic-breakpoints">
							<h2><?php _e( '📱 Responsive Breakpoints', STACKABLE_I18N ) ?></h2>
							<p class="s-settings-subtitle"><?php printf( __( 'Blocks can be styles differently for tablet and mobile screens, and some styles adjust to make them fit better in smaller screens. You can change the widths when tablet and mobile views are triggered. %sLearn more%s.' , STACKABLE_I18N ), '<a href="https://docs.wpstackable.com/article/464-how-to-use-dynamic-breakpoints?utm_source=wp-settings-global-settings&utm_campaign=learnmore&utm_medium=wp-dashboard" target="_docs">', '</a>' ) ?></em></p>
							<div class="s-dynamic-breakpoints"></div>
						</article>
						<article class="s-box" id="global-settings">
							<h2><?php _e( '🌏 Global Settings', STACKABLE_I18N ) ?></h2>
							<p class="s-settings-subtitle"><?php printf( __( 'Each WordPress theme is unique, so if your global settings are not working correctly with your theme, here are a few options you can tweak to make them work. %sLearn more%s.' , STACKABLE_I18N ), '<a href="https://docs.wpstackable.com/article/361-how-to-use-global-settings?utm_source=wp-settings-global-settings&utm_campaign=learnmore&utm_medium=wp-dashboard" target="_docs">', '</a>' ) ?></em></p>
							<div class="s-global-settings"></div>
						</article>
						<article class="s-box <?php echo apply_filters( 'stackable_fa_settings_class', '' ) ?>" id="icon-settings">
							<h2><?php _e( '🧰 Icon Library Settings', STACKABLE_I18N ) ?></h2>
							<?php if ( sugb_fs()->can_use_premium_code() ) : ?>
								<p class="s-settings-subtitle"><?php printf( __( 'If you have %sFont Awesome Pro%s, you can use your Pro icons by inputting your Pro Kit code below.' , STACKABLE_I18N ), '<a href="https://fontawesome.com/referral?a=2c8dfc8669" target="_fontawesome">', '</a>' ) ?></em></p>
							<?php else: ?>
								<p class="s-settings-subtitle"><?php printf( __( '%sFont Awesome Pro%s Integration is available by inputting your Pro Kit code. %sLearn more%s.' , STACKABLE_I18N ), '<a href="https://fontawesome.com/referral?a=2c8dfc8669" target="_fontawesome">', '</a>', '<a href="https://docs.wpstackable.com/article/358-how-to-use-your-font-awesome-pro-icons?utm_source=wp-settings-icons&utm_campaign=learnmore&utm_medium=wp-dashboard" target="_docs">', '</a>' ) ?></em></p>
							<?php endif; ?>
							<div class="s-icon-settings"></div>
							<?php if ( ! sugb_fs()->can_use_premium_code() ) : ?>
								<p class="s-settings-pro"><?php _e( 'This is only available in Stackable Premium.', STACKABLE_I18N ) ?> <a href="https://wpstackable.com/premium/?utm_source=wp-settings-icons&utm_campaign=gopremium&utm_medium=wp-dashboard" target="_premium"><?php _e( 'Go Premium', STACKABLE_I18N ) ?></a></p>
							<?php endif; ?>
						</article>
						<article class="s-box" id="role-manager">
							<h2><?php _e( '📰 Role Manager', STACKABLE_I18N ) ?></h2>
							<?php if ( ! sugb_fs()->can_use_premium_code() ) : ?>
								<p class="s-settings-subtitle"><?php echo __( 'Lock the Block Editor\'s inspector for different user roles, and give clients edit access to only images and content. Content Editing Mode affects all blocks.' , STACKABLE_I18N ) . ' <a href="https://wpstackable.com/blog/introducing-role-manager-for-gutenberg/?utm_source=wp-settings-role-manager&utm_campaign=learnmore&utm_medium=wp-dashboard" target="_docs">' . __( 'Learn more', STACKABLE_I18N ) . '</a>' ?></em></p>
							<?php endif; ?>
							<?php if ( sugb_fs()->can_use_premium_code() ) : ?>
								<p class="s-settings-subtitle"><?php echo __( 'Lock the Block Editor\'s inspector for different user roles, and give clients edit access to only images and content. Content Editing Mode affects all blocks.' , STACKABLE_I18N ) . ' <a href="https://docs.wpstackable.com/article/360-role-manager-and-content-editing-mode?utm_source=wp-settings-role-manager&utm_campaign=learnmore&utm_medium=wp-dashboard" target="_docs">' . __( 'Learn more', STACKABLE_I18N ) . '</a>' ?></em></p>
							<?php endif; ?>
							<div class="s-editing-mode-settings"></div>
							<?php if ( ! sugb_fs()->can_use_premium_code() ) : ?>
								<p class="s-settings-pro"><?php _e( 'This is only available in Stackable Premium.', STACKABLE_I18N ) ?> <a href="https://wpstackable.com/premium/?utm_source=wp-settings-role-manager&utm_campaign=gopremium&utm_medium=wp-dashboard" target="_premium"><?php _e( 'Go Premium', STACKABLE_I18N ) ?></a></p>
							<?php endif; ?>
						</article>
						<article class="s-box" id="custom-fields-settings">
							<div class="s-custom-fields-settings-header">
								<h2><?php _e( '📋 Custom Fields', STACKABLE_I18N ) ?></h2>
								<div class="s-custom-fields-enable"></div>
							</div>
							<p class="s-settings-subtitle"><?php printf( __( 'Create Custom Fields that you can reference across your entire site. You can assign which roles can manage your Custom Fields. %sLearn more%s.' , STACKABLE_I18N ), '<a href="https://docs.wpstackable.com/article/463-how-to-use-stackable-custom-fields/?utm_source=wp-settings-custom-fields&utm_campaign=learnmore&utm_medium=wp-dashboard" target="_docs">', '</a>' ) ?></em></p>
							<div class="s-custom-fields-manager"></div>
							<?php if ( ! sugb_fs()->can_use_premium_code() ) : ?>
								<p class="s-settings-pro"><?php _e( 'This is only available in Stackable Premium.', STACKABLE_I18N ) ?> <a href="https://wpstackable.com/premium/?utm_source=wp-settings-custom-fields&utm_campaign=gopremium&utm_medium=wp-dashboard" target="_premium"><?php _e( 'Go Premium', STACKABLE_I18N ) ?></a></p>
							<?php endif; ?>
						</article>
                        <article class="s-box" id="block-settings">
                            <h2><?php _e( '🎛 Enable & Disable Blocks', STACKABLE_I18N ) ?></h2>
                            <p class="s-settings-subtitle"><?php _e( 'We have a lot of awesome blocks. But if you\'re overwhelmed with awesomeness, you can hide some of them.' , STACKABLE_I18N ) ?> <em><?php _e( '(If your post contains a disabled block, it will still continue to work. You won\'t just be able to add the disabled blocks.)' , STACKABLE_I18N ) ?></em></p>
							<!-- We put all the block controls here. -->
                            <div class="s-settings-wrapper" />
						</article>
						<?php do_action( 'stackable_settings_page_mid' ); ?>
						<!-- We put all the other options here. -->
						<article class="s-box" id="other-settings">
							<h2><?php _e( '🔩 Other Settings', STACKABLE_I18N ) ?></h2>
							<aside class="s-other-options-wrapper"></aside>
						</article>
                    </div>
                    <div class="s-side">
						<?php if ( ! sugb_fs()->can_use_premium_code() ) : ?>
                        <aside class="s-box s-premium-box">
                            <h3><?php _e( '🚀 Stackable Premium', STACKABLE_I18N ) ?></h3>
							<p><?php _e( 'If you are ready for even more, upgrade to Premium and get:', STACKABLE_I18N ) ?></p>
								<ul class="s-check-list">
									<li><?php _e( '54+ Additional Block Layouts', STACKABLE_I18N ) ?></li>
									<li><?php _e( '230+ Additional Library Designs', STACKABLE_I18N ) ?></li>
									<li><?php _e( 'Dynamic Content', STACKABLE_I18N ) ?></li>
									<li><?php _e( 'Motion Effects', STACKABLE_I18N ) ?></li>
									<li><?php _e( 'Conditionally Display Blocks', STACKABLE_I18N ) ?></li>
									<li><?php _e( 'User Role Manager', STACKABLE_I18N ) ?></li>
									<li><?php _e( 'Font Awesome Pro Integration', STACKABLE_I18N ) ?></li>
									<li><?php _e( 'Custom Block CSS', STACKABLE_I18N ) ?></li>
									<li><?php _e( '1 Year of Updates', STACKABLE_I18N ) ?></li>
									<li><?php _e( '1 Year of Support', STACKABLE_I18N ) ?></li>
									<li><?php _e( 'No Ads', STACKABLE_I18N ) ?></li>
								</ul>
							</p>
							<p>
								<a href="https://wpstackable.com/premium/?utm_source=wp-settings-sidebar&utm_campaign=gopremium&utm_medium=wp-dashboard" class="s-button" title="<?php esc_attr_e( 'Get Stackable Premium', STACKABLE_I18N ) ?>" target="_new"><?php esc_attr_e( 'Get Stackable Premium', STACKABLE_I18N ) ?></a>
							</p>
							<p>
								<a href="https://wpstackable.com/premium/?utm_source=wp-settings-sidebar&utm_campaign=learnmore&utm_medium=wp-dashboard" title="<?php esc_attr_e( 'Learn More', STACKABLE_I18N ) ?>" target="_blank" rel="noopener noreferrer"><?php esc_attr_e( 'Learn More', STACKABLE_I18N ) ?> →</a>
							</p>
						</aside>
						<?php endif; ?>
                        <aside class="s-box s-left-align">
                            <h3><?php _e( '🎉 Join the Community', STACKABLE_I18N ) ?></h3>
                            <p><?php _e( 'Join the very active Stackable Community in Facebook, join thousands of like-minded people who are also building their websites and crafting beautiful and impactful web pages.', STACKABLE_I18N ) ?></p>
							<p><a href="https://www.facebook.com/groups/wpstackable" class="s-button" target="_new" title="<?php esc_attr_e( 'Join Facebook Community', STACKABLE_I18N ) ?>"><?php _e( 'Join Facebook Community', STACKABLE_I18N ) ?></a></p>
                        </aside>
                        <aside class="s-box s-news-box s-left-align">
							<h3><?php _e( '🗞 Stackable Blog', STACKABLE_I18N ) ?></h3>
							<div class="s-news-box-content"><?php stackable_news_feed_links_cached() ?></div>
							<p><?php _e( 'Keep up to date by subscribing to our newsletter.', STACKABLE_I18N ) ?></p>
							<p><a href="http://eepurl.com/dJY9xI" class="s-button" target="_new" title="<?php esc_attr_e( 'Subscribe', STACKABLE_I18N ) ?>"><?php _e( 'Subscribe', STACKABLE_I18N ) ?></a></p>
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
			return untrailingslashit( STACKABLE_DESIGN_LIBRARY_URL ) . '/dist/videos/welcome/' . $video_file;
		}

		/**
		 * Getting Started Content
		 */
		public function stackable_getting_started_content() {
			?>
			<div class="wrap s-getting-started">
			<div class="s-header-wrap">
					<?php $this->print_header() ?>
					<?php echo $this->print_premium_button() ?>
					<?php echo $this->print_tabs() ?>
				</div>
				<h1 aria-hidden="true" class="s-admin-notice-marker"></h1>
				<section class="s-body-container s-narrow s-body-container-center s-getting-started__body">
				</section>
			</div>
			<?php
		}

		/**
		 * Adds links to the plugins page entry.
		 *
		 * @param Array $links
		 *
		 * @return Array
		 */
		public function add_settings_link( $links ) {
			// Settings link.
			if ( current_user_can( 'manage_options' ) ) {
				$settings_link = sprintf( '<a href="%s">%s</a>',
					admin_url( 'options-general.php?page=stackable' ),
					__( 'Settings', STACKABLE_I18N )
				);

				// Prevent warnings in PHP 7.0+ when a plugin uses this filter incorrectly.
				$links = (array) $links;
				array_unshift( $links, $settings_link );
			}

			// Go Premium link.
			if ( ! sugb_fs()->is_whitelabeled() && ! sugb_fs()->can_use_premium_code() ) {
				$premium_link = sprintf( '<a href="%s" target="_blank" style="color: #93003c; text-shadow: 1px 1px 1px #eee; font-weight: bold;">%s</a>',
					'https://wpstackable.com/premium/?utm_source=wp-plugins&utm_campaign=gopremium&utm_medium=wp-dashboard',
					__( 'Go Premium', STACKABLE_I18N )
				);

				// Prevent warnings in PHP 7.0+ when a plugin uses this filter incorrectly.
				$links = (array) $links;
				$links[] = $premium_link;
			}

			return $links;
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
            if ( get_option( 'stackable_redirect_to_welcome' ) &&
			     current_user_can( 'manage_options' ) &&
			     ! sugb_fs()->is_activation_mode()
			) {
				// Never go here again.
                delete_option( 'stackable_redirect_to_welcome' );

				// Allow others to bypass the welcome screen.
				if ( ! apply_filters( 'stackable_activation_screen_enabled', true ) ) {
					return;
				}

				// Or go to the getting started page.
				wp_redirect( esc_url( admin_url( 'options-general.php?page=stackable-getting-started' ) ) );

                die();
            }
        }
    }

    new Stackable_Welcome_Screen();
}

// This filter is used by the Freemius activation screen, we can disable redirection with this.
add_filter( 'fs_redirect_on_activation_stackable-ultimate-gutenberg-blocks', function ( $redirect ) {
	return apply_filters( 'stackable_activation_screen_enabled', $redirect );
} );

// Redirect to the welcome screen.
register_activation_hook( STACKABLE_FILE, array( 'Stackable_Welcome_Screen', 'start_redirect_to_welcome_page' ) );
