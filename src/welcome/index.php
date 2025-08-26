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

				wp_enqueue_script( 'stackable-welcome', plugins_url( 'dist/admin_welcome.js', STACKABLE_FILE ), array( 'wp-i18n', 'wp-element', 'wp-hooks', 'wp-util', 'wp-components', 'wp-api', 'wp-editor', 'lodash' ), STACKABLE_VERSION );

				// Add translations.
				wp_set_script_translations( 'stackable-welcome', STACKABLE_I18N );
				stackable_load_js_translations(); // This is needed for the translation strings to be loaded.

				$args = apply_filters( 'stackable_localize_settings_script', array(
					'srcUrl' => untrailingslashit( plugins_url( '/', STACKABLE_FILE ) ),
					'welcomeSrcUrl' => untrailingslashit( plugins_url( '/', __FILE__ ) ),
					'i18n' => STACKABLE_I18N,
					'cdnUrl' => STACKABLE_DESIGN_LIBRARY_URL,
					'isPro' => STACKABLE_BUILD !== 'free' && sugb_fs()->can_use_premium_code(),
					'showProNotice' => stackable_should_show_pro_notices(),
					'pricingURL' => 'https://wpstackable.com/premium/?utm_source=wp-settings&utm_campaign=gopremium&utm_medium=wp-dashboard',
					'contactURL' => STACKABLE_BUILD === 'free' ? '' : ( ! sugb_fs()->is_whitelabeled() ? sugb_fs()->contact_url( 'technical_support' ) : '' ),
					'planName' => STACKABLE_BUILD === 'free' ? '' : sugb_fs()->get_plan_name(),
					'showProNoticesOption' => STACKABLE_SHOW_PRO_NOTICES && ( STACKABLE_BUILD === 'free' || ! sugb_fs()->can_use_premium_code() ),
					'nonceNews' => stackable_get_news_feed_nonce(),
				) );
				wp_localize_script( 'stackable-welcome', 'stackable', $args );
			}
		}

		public static function print_tabs() {
			$screen = get_current_screen();

			$display_account_tab = true;
			$display_contact_tab = true;
			$account_url = STACKABLE_BUILD === 'free' ? '' : sugb_fs()->get_account_url();
			$contact_url = admin_url( 'options-general.php?page=stackable-contact' );

			// If network activated and in multisite, the accounts page is in a different URL.
			if ( STACKABLE_BUILD === 'free' ) {
				$display_account_tab = false;
				$display_contact_tab = false;
			} else {
				if ( is_multisite() && sugb_fs()->is_network_active() ) {
					$account_url = str_replace( 'options-general.php', 'admin.php', $account_url );
					$contact_url = admin_url( 'network/admin.php?page=stackable-contact' );
					if ( ! is_main_site() ) {
						$display_account_tab = false;
						$display_contact_tab = false;
					}
				}
				if ( sugb_fs()->is_whitelabeled() ) {
					$display_contact_tab = false;
				}
			}

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

				<?php if ( $display_account_tab && STACKABLE_BUILD !== 'free' && sugb_fs()->get_user() ) { ?>
					<a class="s-tab <?php echo $screen->base === 'settings_page_stackable-account' ? 's-active' : '' ?>"
						href="<?php echo $account_url ?>">
						<span><?php _e( 'Account', STACKABLE_I18N ) ?></span>
					</a>
				<?php } ?>

				<?php if ( STACKABLE_BUILD !== 'free' && sugb_fs()->has_affiliate_program() ) { ?>
					<a class="s-tab <?php echo $screen->base === 'settings_page_stackable-affiliation' ? 's-active' : '' ?>"
						href="<?php echo admin_url( 'options-general.php?page=stackable-affiliation' ) ?>">
						<span><?php _e( 'Affiliation', STACKABLE_I18N ) ?></span>
					</a>
				<?php } ?>

				<a class="s-tab" href="https://docs.wpstackable.com" target="_docs">
				<span><?php _e( 'Documentation', STACKABLE_I18N ) ?></span></a>

				<?php if ( $display_contact_tab && STACKABLE_BUILD !== 'free' ) { ?>
					<a class="s-tab <?php echo $screen->base === 'settings_page_stackable-contact' ? 's-active' : '' ?>"
						href="<?php echo $contact_url ?>">
						<span><?php _e( 'Contact Us', STACKABLE_I18N ) ?></span>
					</a>
				<?php } ?>

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
			<?php if ( STACKABLE_BUILD === 'free' || ! sugb_fs()->can_use_premium_code() ) : ?>
				<a href="https://wpstackable.com/premium/?utm_source=wp-settings-tabs&utm_campaign=gopremium&utm_medium=wp-dashboard" class="s-button s-premium-button" title="<?php esc_attr_e( 'Unlock my Premium Features', STACKABLE_I18N ) ?>" target="_new">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" style="vertical-align: middle; fill: currentColor"><path d="M321.7 0c19.1 0 32.9 18.3 27.6 36.6L295.8 224l85.2 0c19.3 0 34.9 15.6 34.9 34.9c0 10.3-4.5 20-12.3 26.6L144.9 505.2c-5.2 4.4-11.8 6.8-18.6 6.8c-19.1 0-32.9-18.3-27.6-36.6L152.2 288l-86.4 0C47.1 288 32 272.9 32 254.3c0-9.9 4.3-19.2 11.8-25.6L303.1 6.9C308.3 2.4 314.9 0 321.7 0zM285.6 85L104.4 240l79.6 0c7.5 0 14.6 3.5 19.2 9.5s6 13.8 3.9 21L162.3 427.5 345.5 272 264 272c-7.5 0-14.6-3.5-19.2-9.5s-6-13.8-3.9-21L285.6 85z"/></svg>
					<?php esc_attr_e( 'Unlock my Premium Features', STACKABLE_I18N ) ?>
				</a>
			<?php endif; ?>
		<?php
		}

		public function stackable_settings_content() {
			?>
			<div class="wrap wrap-settings">
				<div class="s-header-wrap s-header-settings">
					<?php $this->print_header() ?>
					<?php echo $this->print_premium_button() ?>
					<?php echo $this->print_tabs() ?>
				</div>
				<h1 aria-hidden="true" class="s-admin-notice-marker"></h1>
				<section id="settings-notice">
					<div class="s-rest-settings-notice"></div>
					<div class="s-save-settings-notice"></div>
				</section>
				<?php stackable_welcome_notification() ?>
				<section class="s-body-container s-body-container-with-sidenav">
					<div class="s-body" id="settings-body">
						<?php do_action( 'stackable_settings_page' ) ?>

						<div class="s-content" id="settings-content"></div>
						<?php do_action( 'stackable_settings_page_mid' ); ?>
					</div>
					<!-- <div class="s-side">
						<?php if ( STACKABLE_BUILD === 'free' || ! sugb_fs()->can_use_premium_code() ) : ?>
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
					</div> -->



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
			if ( STACKABLE_BUILD === 'free' ) {
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
		public static function start_redirect_to_welcome_page( $network_wide ) {
			if ( ! $network_wide && ! defined( 'STACKABLE_NO_WELCOME_REDIRECT' ) ) {
				update_option( 'stackable_redirect_to_welcome', '1' );
			}
		}

		/**
		 * Redirect to the welcome screen if our marker exists.
		 */
		public function redirect_to_welcome_page() {

			if ( get_option( 'stackable_redirect_to_welcome' ) &&
				current_user_can( 'manage_options' ) &&
				( STACKABLE_BUILD === 'free' || ! sugb_fs()->is_activation_mode() )
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
