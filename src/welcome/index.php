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
				__( 'Stackable', STACKABLE_I18N ), // Menu title.
				'manage_options', // Capability.
				'stackable', // Menu slug.
				array( $this, 'stackable_settings_content' ), // Callback function.
				null // Position
			);

			// Our getting started page.
			add_submenu_page(
				isset( $_GET['page'] ) && $_GET['page'] === 'stackable-getting-started' ? 'options-general.php' : null, // Parent slug. Only show when in the page.
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
            if ( 'settings_page_stackable' === $hook || stripos( $hook, 'page_stackable' ) !== false ) {
				wp_enqueue_style( 'stackable-welcome', plugins_url( 'dist/admin_welcome.css', STACKABLE_FILE ), array() );
				wp_enqueue_style( 'ugb-block-editor-css', plugins_url( 'dist/editor_blocks.css', STACKABLE_FILE ), array() );
				do_action( 'stackable_settings_admin_enqueue_styles' );
			}

			// For the options page, load our options script.
			if ( 'settings_page_stackable' === $hook || stripos( $hook, 'page_stackable-settings' ) !== false ) {
				// Add translations.
				wp_set_script_translations( 'stackable-welcome', STACKABLE_I18N );

				wp_enqueue_script( 'wp-i18n' );
				wp_enqueue_script( 'wp-element' );
				wp_enqueue_script( 'wp-hooks' );
				wp_enqueue_script( 'wp-util' ); // Need wp.ajax.
				wp_enqueue_script( 'wp-components' ); // Need Spinner.
				wp_enqueue_style( 'wp-components' ); // Need Spinner.

				do_action( 'stackable_settings_admin_enqueue_scripts' );

				wp_enqueue_script( 'stackable-welcome', plugins_url( 'dist/admin_welcome.js', STACKABLE_FILE ), array( 'wp-i18n', 'wp-element', 'wp-hooks', 'wp-util', 'wp-components', 'wp-api', 'wp-editor' ) );

				$args = apply_filters( 'stackable_localize_settings_script', array(
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
				wp_localize_script( 'stackable-welcome', 'stackable', $args );
            }
        }

		public static function print_tabs() {
			$screen = get_current_screen();
			?>
			<div class="s-body s-tabs">
				<a class="s-tab <?php echo $screen->base === 'settings_page_stackable-getting-started' ? 's-active' : '' ?>"
					href="<?php echo admin_url( 'options-general.php?page=stackable-getting-started' ) ?>">
					<?php _e( 'Getting Started', STACKABLE_I18N ) ?>
				</a>

				<a class="s-tab <?php echo $screen->base === 'settings_page_stackable' ? 's-active' : '' ?>"
					href="<?php echo admin_url( 'options-general.php?page=stackable' ) ?>">
					<?php _e( 'Settings', STACKABLE_I18N ) ?>
				</a>

				<?php if ( sugb_fs()->get_user() ) { ?>
					<a class="s-tab <?php echo $screen->base === 'settings_page_stackable-account' ? 's-active' : '' ?>"
						href="<?php echo sugb_fs()->get_account_url() ?>">
						<?php _e( 'Account', STACKABLE_I18N ) ?>
					</a>
				<?php } ?>

				<?php if ( sugb_fs()->has_affiliate_program() ) { ?>
					<a class="s-tab <?php echo $screen->base === 'settings_page_stackable-affiliation' ? 's-active' : '' ?>"
						href="<?php echo admin_url( 'options-general.php?page=stackable-affiliation' ) ?>">
						<?php _e( 'Affiliation', STACKABLE_I18N ) ?>
					</a>
				<?php } ?>

				<a class="s-tab" href="https://docs.wpstackable.com" target="_docs"><?php _e( 'Documentation', STACKABLE_I18N ) ?></a>

				<a class="s-tab <?php echo $screen->base === 'settings_page_stackable-contact' ? 's-active' : '' ?>"
					href="<?php echo admin_url( 'options-general.php?page=stackable-contact' ) ?>">
					<?php _e( 'Contact Us', STACKABLE_I18N ) ?>
				</a>

				<?php if ( ! sugb_fs()->is_whitelabeled() ) { ?>
					<?php if ( ! sugb_fs()->can_use_premium_code() ) { ?>
						<a class="s-tab s-tab-premium" href="<?php echo esc_url( sugb_fs()->get_upgrade_url() ) ?>"><?php _e( 'Go Premium', STACKABLE_I18N ) ?></a>
					<?php } ?>
				<?php } ?>

			</div>
			<?php
		}

		public static function print_header( $title = '', $image = 'icon' ) {
			?>
			<header class="s-header s-logo-<?php echo $image ?>">
				<h1>
					<img src="<?php echo esc_url( plugins_url( 'images/stackable-' . $image . '.png', __FILE__ ) ) ?>" alt="<?php esc_attr_e( 'Stackable', STACKABLE_I18N ) ?>"/>
					<?php echo $title ?>
				</h1>
			</header>
			<?php
		}

        public function stackable_settings_content() {
            ?>
            <div class="wrap">
				<?php $this->print_header( __( 'Stackable Settings', STACKABLE_I18N ) ) ?>
				<?php echo $this->print_tabs() ?>
                <section class="s-body-container s-body-container-grid">
                    <div class="s-body">
						<?php stackable_welcome_notification() ?>
						<?php do_action( 'stackable_settings_page' ) ?>
						<article class="s-box <?php echo apply_filters( 'stackable_fa_settings_class', '' ) ?>" id="icon-settings">
							<h2><?php _e( '🧰 Icon Library Settings', STACKABLE_I18N ) ?></h2>
							<?php if ( sugb_fs()->can_use_premium_code() ) : ?>
								<p class="s-settings-subtitle"><?php printf( __( 'If you have %sFont Awesome Pro%s, you can use your Pro icons by inputting your Pro Kit code below.' , STACKABLE_I18N ), '<a href="https://fontawesome.com/referral?a=2c8dfc8669" target="_fontawesome">', '</a>' ) ?></em></p>
							<?php else: ?>
								<p class="s-settings-subtitle"><?php printf( __( '%sFont Awesome Pro%s Integration is available by inputting your Pro Kit code. %sLearn more%s.' , STACKABLE_I18N ), '<a href="https://fontawesome.com/referral?a=2c8dfc8669" target="_fontawesome">', '</a>', '<a href="https://docs.wpstackable.com/stackable-guides/advanced-guides/how-to-use-your-font-awesome-pro-icons/?utm_source=wp-settings-icons&utm_campaign=learnmore&utm_medium=wp-dashboard" target="_docs">', '</a>' ) ?></em></p>
							<?php endif; ?>
							<div class="s-icon-settings"></div>
							<?php if ( ! sugb_fs()->can_use_premium_code() ) : ?>
								<p class="s-settings-pro"><?php _e( 'This is only available in Stackable Premium.', STACKABLE_I18N ) ?> <a href="https://wpstackable.com/premium/?utm_source=wp-settings-icons&utm_campaign=gopremium&utm_medium=wp-dashboard" target="_premium"><?php _e( 'Go Premium', STACKABLE_I18N ) ?></a></p>
							<?php endif; ?>
						</article>
						<article class="s-box" id="role-manager">
							<h2><?php _e( '📰 Role Manager', STACKABLE_I18N ) ?></h2>
							<?php if ( ! sugb_fs()->can_use_premium_code() ) : ?>
								<p class="s-settings-subtitle"><?php printf( __( 'Lock the Block Editor\'s inspector for different user roles, and give clients edit access to only images and content. Content Editing Mode affects all blocks. %sLearn more%s.' , STACKABLE_I18N ), '<a href="https://wpstackable.com/blog/introducing-role-manager-for-gutenberg/?utm_source=wp-settings-role-manager&utm_campaign=learnmore&utm_medium=wp-dashboard" target="_docs">', '</a>' ) ?></em></p>
							<?php endif; ?>
							<?php if ( sugb_fs()->can_use_premium_code() ) : ?>
								<p class="s-settings-subtitle"><?php printf( __( 'Lock the Block Editor\'s inspector for different user roles, and give clients edit access to only images and content. Content Editing Mode affects all blocks. %sLearn more%s.' , STACKABLE_I18N ), '<a href="https://docs.wpstackable.com/stackable-guides/advanced-guides/role-manager-and-content-editing-mode/?utm_source=wp-settings-role-manager&utm_campaign=learnmore&utm_medium=wp-dashboard" target="_docs">', '</a>' ) ?></em></p>
							<?php endif; ?>
							<div class="s-editing-mode-settings"></div>
							<?php if ( ! sugb_fs()->can_use_premium_code() ) : ?>
								<p class="s-settings-pro"><?php _e( 'This is only available in Stackable Premium.', STACKABLE_I18N ) ?> <a href="https://wpstackable.com/premium/?utm_source=wp-settings-role-manager&utm_campaign=gopremium&utm_medium=wp-dashboard" target="_premium"><?php _e( 'Go Premium', STACKABLE_I18N ) ?></a></p>
							<?php endif; ?>
						</article>
						<article class="s-box" id="global-settings">
							<h2><?php _e( '🌏 Global Settings', STACKABLE_I18N ) ?></h2>
							<p class="s-settings-subtitle"><?php printf( __( 'Each WordPress theme is unique, so if your global settings are not working correctly with your theme, here are a few options you can tweak to make them work. %sLearn more%s.' , STACKABLE_I18N ), '<a href="https://docs.wpstackable.com/stackable-guides/advanced-guides/how-to-use-global-settings/?utm_source=wp-settings-global-settings&utm_campaign=learnmore&utm_medium=wp-dashboard" target="_docs">', '</a>' ) ?></em></p>
							<div class="s-global-settings"></div>
						</article>
                        <article class="s-box" id="block-settings">
                            <h2><?php _e( '🎛 Enable & Disable Blocks', STACKABLE_I18N ) ?></h2>
                            <p class="s-settings-subtitle"><?php _e( 'We have a lot of awesome blocks. But if you\'re overwhelmed with awesomeness, you can hide some of them.' , STACKABLE_I18N ) ?> <em><?php _e( '(If your post contains a disabled block, it will still continue to work. You won\'t just be able to add the disabled blocks.)' , STACKABLE_I18N ) ?></em></p>
							<!-- We put all the block controls here. -->
                            <div class="s-settings-wrapper" />
						</article>
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
									<li><?php _e( '60+ Additional Block Layouts', STACKABLE_I18N ) ?></li>
									<li><?php _e( '230+ Additional Block Designs', STACKABLE_I18N ) ?></li>
									<li><?php _e( 'Additional Block Styling Options', STACKABLE_I18N ) ?></li>
									<li><?php _e( 'User Role Manager', STACKABLE_I18N ) ?></li>
									<li><?php _e( 'Font Awesome Pro Integration', STACKABLE_I18N ) ?></li>
									<li><?php _e( 'Custom Block CSS', STACKABLE_I18N ) ?></li>
									<li><?php _e( '1 Year of Updates', STACKABLE_I18N ) ?></li>
									<li><?php _e( '1 Year of Support', STACKABLE_I18N ) ?></li>
									<li><?php _e( 'No Ads', STACKABLE_I18N ) ?></li>
								</ul>
							</p>
							<p>
								<a href="<?php echo esc_url( sugb_fs()->get_upgrade_url() ) ?>" class="s-button" title="<?php esc_attr_e( 'Get Stackable Premium', STACKABLE_I18N ) ?>"><?php esc_attr_e( 'Get Stackable Premium', STACKABLE_I18N ) ?></a>
							</p>
							<p>
								<a href="https://wpstackable.com/premium/?utm_source=wp-settings-sidebar&utm_campaign=learnmore&utm_medium=wp-dashboard" title="<?php esc_attr_e( 'Learn More', STACKABLE_I18N ) ?>" target="_blank" rel="noopener noreferrer"><?php esc_attr_e( 'Learn More', STACKABLE_I18N ) ?> →</a>
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
				<?php $this->print_header( '', 'logo' ) ?>
				<section class="s-body-container s-narrow s-body-container-center">
					<?php $this->print_tabs() ?>

					<div class="s-body s-box s-box-spaced s-getting-started">

						<div class="s-getting-started__centered">
							<h2 class="title"><?php _e( 'How to start using Stackable', STACKABLE_I18N ) ?></h2>
							<p class="subtitle"><?php _e( 'There\'s a lot you can achieve using Stackable. Here\'s a quick guide to start you off.', STACKABLE_I18N )?></p>
						</div>

						<div class="s-getting-started__two-column">
							<div class="s-getting-started__entry">
								<h4><?php _e( 'ADDING BLOCKS', STACKABLE_I18N )?></h4>
								<p><?php _e( 'There are 2 ways to start using Stackable:', STACKABLE_I18N)?></p>
								<ul>
									<li>
										<p><?php _e( 'Add a block by <strong>Block Type</strong>', STACKABLE_I18N )?></p>
									</li>
									<li>
										<p><?php _e( 'Add a block from the <strong>Design Library</strong>', STACKABLE_I18N )?></p>
									</li>
								</ul>
							</div>
							<div class="s-image-caption">
								<img draggable="false" src="<?php echo plugins_url( 'images/adding-a-new-block.jpg', __FILE__ ) ?>">
							</div>
						</div>

						<div class="s-getting-started__two-column">
							<div class="s-getting-started__entry">
								<h4><?php _e( 'Adding by Block Type', STACKABLE_I18N )?></h4>
								<p><?php _e( 'Click the <strong>(+) icon</strong> then scroll to the <strong>Stackable Blocks area</strong> to add a block.', STACKABLE_I18N )?></p>
							</div>
							<div class="s-image-caption">
								<img draggable="false" src="<?php echo plugins_url( 'images/layout-picker-and-block-picker.jpg', __FILE__ ) ?>">
							</div>
						</div>

						<div class="s-getting-started__two-column">
							<div class="s-getting-started__entry">
								<h4><?php _e( 'Adding from the Design Library', STACKABLE_I18N )?></h4>
								<p><?php _e( 'You can also launch the Design Library, and choose from <strong>ready-made UI Kits</strong> & <strong>Block Designs</strong>.', STACKABLE_I18N ) ?></p>
								<span class="indented">
									<h5><?php _e( 'UI Kits', STACKABLE_I18N )?></h5>
									<p><?php _e( 'Choose blocks from different <strong>UI Kits</strong> that can be used to build an entire website.', STACKABLE_I18N ) ?></p>
								</span>
								<span class="indented">
									<h5><?php _e( 'Block Designs', STACKABLE_I18N )?></h5>
									<p><?php _e( 'Choose from different <strong>individual Block Designs</strong>. Mix and match block designs to build your site.', STACKABLE_I18N )?></p>
								</span>
							</div>
							<div class="s-image-caption">
								<img draggable="false" src="<?php echo plugins_url( 'images/design-library.jpg', __FILE__ )?>">
							</div>
						</div>

						<div class="s-getting-started__centered">
							<div class="s-getting-started__help-tip primary">
								<img draggable="false" src="<?php echo plugins_url( 'images/info.svg', __FILE__ )?>">
								<h4><?php _e( 'What is a UI Kit?', STACKABLE_I18N )?></h4>
								<p><?php _e( 'A UI Kit is a cohesive collection of block designs with a uniform look and feel.', STACKABLE_I18N )?></p>
							</div>
						</div>

						<div class="s-getting-started__centered">
							<h4><?php _e( 'STYLING BLOCKS', STACKABLE_I18N )?></h4>
							<div class="inner-columns">
								<div class="getting-started__entry">
									<p><?php _e( 'You can style your blocks using 3 tool areas:', STACKABLE_I18N )?></p>
									<ul>
										<li><p><?php _e( 'Inspector', STACKABLE_I18N )?></p></li>
										<li><p><?php _e( 'Toolbar', STACKABLE_I18N )?></p></li>
										<li><p><?php _e( 'Global Settings Panel', STACKABLE_I18N )?></p></li>
									</ul>
								</div>
								<div class="s-getting-started__entry">
									<h5><strong><?php _e( 'Inspector', STACKABLE_I18N )?></strong></h5>
									<p><?php _e( 'The <strong>Inspector</strong> is the main styling area. Explore the 3 tabs to style the block to your liking & level of expertise.', STACKABLE_I18N )?></p>
									<h5><strong><?php _e( 'Toolbar', STACKABLE_I18N )?></strong></h5>
									<p><?php _e( 'Use the Toolbar to edit elements such as your Block Width, Text and other formatting specs.', STACKABLE_I18N )?></p>
								</div>
							</div>
						</div>

						<div class="s-getting-started__centered">
							<img draggable="false" src="<?php echo plugins_url( 'images/toolbar-and-inspector.jpg', __FILE__ )?>">
						</div>

						<div class="s-getting-started__centered">
							<div class="s-getting-started__help-tip secondary">
								<img draggable="false" src="<?php echo plugins_url( 'images/star.svg', __FILE__ )?>">
								<span>
									<h4><?php _e( 'Tip', STACKABLE_I18N)?></h4>
									<p><?php _e( 'You can automatically open the inspector panel you want to tweak (ex. Title, Container, etc.) by double-clicking the element on the design area.', STACKABLE_I18N )?></p>
								</span>
							</div>
						</div>

						<div class="s-getting-started__two-column reverse">
							<div class="s-getting-started__entry">
								<h4><?php _e( 'Global Settings Panel', STACKABLE_I18N )?></h4>
								<p><?php _e( 'Define and edit site-wide typography and color palettes in one place. Launch Global Settings with the Stackable icon.', STACKABLE_I18N )?></p>
							</div>
							<div class="s-image-caption">
								<img draggable="false" src="<?php echo plugins_url( 'images/global-settings.jpg', __FILE__ )?>">
							</div>
						</div>

						<div class="s-getting-started__centered">
							<div class="s-getting-started__footer" style="background-image: url('<?php echo plugins_url( 'images/cta-bg.jpg', __FILE__ ) ?>')">
								<h2><?php _e( 'Ready to make your website?', STACKABLE_I18N )?></h2>
								<p><?php _e( 'Start creating your site or check out our full guide to Stackable.', STACKABLE_I18N )?></p>
								<div class="button-group">
									<a class="s-getting-started__button primary" href="post-new.php?post_type=page"><?php _e( 'Create New Page', STACKABLE_I18N )?></a>
									<a class="s-getting-started__button secondary" target="_docs" href="https://docs.wpstackable.com/stackable-guides/beginner-guides/customizing-blocks/?utm_source=wp-getting-started-footer&utm_campaign=getting-started&utm_medium=wp-dashboard"><?php _e( 'Read Full Guide', STACKABLE_I18N )?></a>
								</div>
							</div>
						</div>

						<h4 class="title"><?php _e( 'More Resources', STACKABLE_I18N )?></h4>

						<div class="s-getting-started__centered">
							<div class="inner-columns">
								<div class="resources__item s-box">
									<img draggable="false" src="<?php echo plugins_url( 'images/smile.svg', __FILE__ )?>">
									<h5><?php _e( 'Community', STACKABLE_I18N )?></h5>
									<p><?php _e( 'Join like-minded people who help each other do amazing things', STACKABLE_I18N )?></p>
									<a class="s-getting-started__button primary" href="https://wpstackable.com/community/?utm_source=wp-getting-started-footer&utm_campaign=getting-started&utm_medium=wp-dashboard">
										<?php _e( 'Join Now', STACKABLE_I18N )?>
									</a>
								</div>

								<div class="resources__item s-box">
									<img draggable="false" src="<?php echo plugins_url( 'images/book-open.svg', __FILE__ )?>">
									<h5><?php _e( 'Documentation', STACKABLE_I18N )?></h5>
									<p><?php _e( 'Learn how to use Stackable\'s powerful page building tools', STACKABLE_I18N )?></p>
									<a class="s-getting-started__button primary" href="https://docs.wpstackable.com/?utm_source=wp-getting-started-footer&utm_campaign=getting-started&utm_medium=wp-dashboard">
										<?php _e( 'Visit Docs', STACKABLE_I18N )?>
									</a>
								</div>

								<div class="resources__item s-box">
									<img draggable="false" src="<?php echo plugins_url( 'images/align-left.svg', __FILE__ )?>">
									<h5><?php _e( 'Blog', STACKABLE_I18N )?></h5>
									<p><?php _e( 'Browse through our articles and find what you\'re looking for', STACKABLE_I18N )?></p>
									<a class="s-getting-started__button primary" href="https://wpstackable.com/blog/?utm_source=wp-getting-started-footer&utm_campaign=getting-started&utm_medium=wp-dashboard">
										<?php _e( 'Read More', STACKABLE_I18N )?>
									</a>
								</div>

								<div class="resources__item s-box">
									<img draggable="false" src="<?php echo plugins_url( 'images/headphones.svg', __FILE__ )?>">
									<?php if ( sugb_fs()->can_use_premium_code() ) { ?>
										<h5><?php _e( 'Get Support', STACKABLE_I18N )?></h5>
										<p><?php _e( 'Stuck with something? Email us and we\'ll help you out', STACKABLE_I18N )?></p>
										<a class="s-getting-started__button primary" href="<?php echo esc_url( sugb_fs()->contact_url( 'technical_support' ) ) ?>">
											<?php _e( 'Contact Support', STACKABLE_I18N )?>
										</a>
									<?php } else { ?>
										<h5><?php _e( 'Get Support', STACKABLE_I18N )?></h5>
										<p><?php _e( 'Upgrade to Premium and our support team can help you out.', STACKABLE_I18N )?></p>
										<a class="s-getting-started__button primary" href="https://wpstackable.com/upgrade/?utm_source=wp-getting-started-footer&utm_campaign=getting-started&utm_medium=wp-dashboard">
											<?php _e( 'Learn more', STACKABLE_I18N )?>
										</a>
									<?php }	?>
								</div>
							</div>
						</div>

					</div>
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
            if ( ! sugb_fs()->is_activation_mode() && get_option( 'stackable_redirect_to_welcome' ) ) {
                delete_option( 'stackable_redirect_to_welcome' );
                wp_redirect( esc_url( admin_url( 'options-general.php?page=stackable-getting-started' ) ) );
                die();
            }
        }
    }

    new Stackable_Welcome_Screen();
}

// Redirect to the welcome screen.
register_activation_hook( STACKABLE_FILE, array( 'Stackable_Welcome_Screen', 'start_redirect_to_welcome_page' ) );
